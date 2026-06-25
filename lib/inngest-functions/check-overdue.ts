import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { ReminderTone, EscalationStage } from "@/lib/types";

export const checkOverdueFunction = inngest.createFunction(
  { id: "check-overdue-invoices", triggers: [{ cron: "0 9 * * *" }] },
  async ({ step }) => {
    const overdueInvoices = await step.run("fetch-overdue-invoices", async () => {
      return prisma.invoice.findMany({
        where: {
          status: { in: ["SENT", "OVERDUE"] },
          dueDate: { lt: new Date() },
        },
        include: {
          reminderLogs: {
            orderBy: { sentAt: "desc" },
            take: 1,
          },
        },
      });
    });

    const results = [];

    for (const invoice of overdueInvoices) {
      const daysPastDue = Math.floor(
        (new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (invoice.status === "SENT") {
        await step.run(`update-status-${invoice.id}`, async () => {
          return prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: "OVERDUE" },
          });
        });
      }

      let tone: ReminderTone = ReminderTone.FRIENDLY;
      let stage: EscalationStage = EscalationStage.STAGE_1;

      if (daysPastDue >= 30) {
        tone = ReminderTone.FINAL;
        stage = EscalationStage.STAGE_4;
      } else if (daysPastDue >= 16) {
        tone = ReminderTone.FIRM;
        stage = EscalationStage.STAGE_3;
      } else if (daysPastDue >= 8) {
        tone = ReminderTone.FIRM;
        stage = EscalationStage.STAGE_2;
      }

      // آپدیت escalation stage در DB
      await step.run(`update-stage-${invoice.id}`, async () => {
        return prisma.invoice.update({
          where: { id: invoice.id },
          data: { escalationStage: stage },
        });
      });

      const lastReminder = invoice.reminderLogs[0];
      if (lastReminder) {
        const daysSinceLastReminder = Math.floor(
          (new Date().getTime() - new Date(lastReminder.sentAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastReminder < 3) {
          results.push({ invoiceId: invoice.id, skipped: true });
          continue;
        }
      }

      await step.sendEvent(`send-reminder-${invoice.id}`, {
        name: "invoice/reminder.send",
        data: { invoiceId: invoice.id, tone },
      });

      results.push({ invoiceId: invoice.id, tone, sent: true });
    }

    return { processed: overdueInvoices.length, results };
  }
);