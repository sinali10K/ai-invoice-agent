import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { ReminderTone } from "@/lib/types";

export const checkOverdueFunction = inngest.createFunction(
  { id: "check-overdue-invoices" },
  { cron: "0 9 * * *" },
  // @ts-expect-error Inngest 4 handler type
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
        (new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
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
      if (daysPastDue >= 30) {
        tone = ReminderTone.FINAL;
      } else if (daysPastDue >= 14) {
        tone = ReminderTone.FIRM;
      }

      const lastReminder = invoice.reminderLogs[0];
      if (lastReminder) {
        const daysSinceLastReminder = Math.floor(
          (new Date().getTime() - lastReminder.sentAt.getTime()) / (1000 * 60 * 60 * 24)
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