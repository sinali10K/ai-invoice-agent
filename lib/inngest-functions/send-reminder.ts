import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { generateReminderEmail } from "@/lib/ai";
import { sendReminderEmail } from "@/lib/resend";
import { ReminderTone } from "@prisma/client";

export const sendReminderFunction = inngest.createFunction(
  {
    id: "send-invoice-reminder",
    name: "Send Invoice Reminder",
    triggers: [{ event: "invoice/reminder.send" }],
  } as any,
  async ({ event, step }: any) => {
    const { invoiceId, tone } = event.data as {
      invoiceId: string;
      tone: ReminderTone;
    };

    const invoice = await step.run("fetch-invoice", async () => {
      return prisma.invoice.findFirst({
        where: { id: invoiceId },
        include: { client: true, user: true },
      });
    });

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    if (invoice.status === "PAID") {
      return { skipped: true, reason: "Invoice already paid" };
    }

    const daysPastDue = Math.max(
      0,
      Math.floor(
        (new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    const emailContent = await step.run("generate-email", async () => {
      return generateReminderEmail({
        clientName: invoice.client.name,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        dueDate: invoice.dueDate,
        daysPastDue,
        tone,
        freelancerName: invoice.user.name ?? "Your Service Provider",
      });
    });

    await step.run("send-email", async () => {
      return sendReminderEmail({
        to: invoice.client.email,
        subject: emailContent.subject,
        body: emailContent.body,
      });
    });

    const reminderLog = await step.run("save-reminder-log", async () => {
      return prisma.reminderLog.create({
        data: {
          invoiceId: invoice.id,
          tone,
          subject: emailContent.subject,
          body: emailContent.body,
        },
      });
    });

    if (daysPastDue > 0 && invoice.status === "SENT") {
      await step.run("update-invoice-status", async () => {
        return prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: "OVERDUE" },
        });
      });
    }

    return { success: true, reminderLogId: reminderLog.id };
  }
);