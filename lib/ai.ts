import { ReminderTone } from "@prisma/client";

interface GenerateReminderEmailParams {
  clientName: string;
  amount: number;
  currency: string;
  dueDate: Date;
  daysPastDue: number;
  tone: ReminderTone;
  freelancerName: string;
}

interface GeneratedEmail {
  subject: string;
  body: string;
}

// وقتی API key داشتی، این تابع رو uncomment کن و mock رو حذف کن
// import Anthropic from "@anthropic-ai/sdk";
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateReminderEmail(
  params: GenerateReminderEmailParams
): Promise<GeneratedEmail> {
  const { clientName, amount, currency, dueDate, daysPastDue, tone, freelancerName } = params;

  // اگه API key وجود داشت از Claude استفاده کن
  if (process.env.ANTHROPIC_API_KEY) {
    return generateWithClaude(params);
  }

  // Mock response برای development
  return generateMockEmail(params);
}

async function generateWithClaude(
  params: GenerateReminderEmailParams
): Promise<GeneratedEmail> {
  const { clientName, amount, currency, dueDate, daysPastDue, tone, freelancerName } = params;

  // TODO: وقتی API key داشتی uncomment کن
  // const Anthropic = (await import("@anthropic-ai/sdk")).default;
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const message = await anthropic.messages.create({ ... });

  return generateMockEmail(params);
}

function generateMockEmail(params: GenerateReminderEmailParams): GeneratedEmail {
  const { clientName, amount, currency, dueDate, daysPastDue, tone, freelancerName } = params;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dueDate);

  const subjects: Record<ReminderTone, string> = {
    FRIENDLY: `Friendly Reminder: Invoice for ${formattedAmount}`,
    FIRM: `Action Required: Overdue Invoice - ${formattedAmount}`,
    FINAL: `Final Notice: Immediate Payment Required - ${formattedAmount}`,
  };

  const bodies: Record<ReminderTone, string> = {
    FRIENDLY: `Dear ${clientName},

I hope this message finds you well. I wanted to send a gentle reminder that an invoice for ${formattedAmount} was due on ${formattedDate}.

If you have already made the payment, please disregard this message. Otherwise, I would appreciate if you could arrange payment at your earliest convenience.

Please don't hesitate to reach out if you have any questions.

Best regards,
${freelancerName}`,

    FIRM: `Dear ${clientName},

This is a reminder that your invoice for ${formattedAmount}, which was due on ${formattedDate}, is now ${daysPastDue} days overdue.

Please arrange payment immediately to avoid any further delays. If there is an issue with the invoice, please contact me as soon as possible so we can resolve it.

I look forward to your prompt response.

Regards,
${freelancerName}`,

    FINAL: `Dear ${clientName},

Despite previous reminders, your invoice for ${formattedAmount} (due ${formattedDate}) remains unpaid after ${daysPastDue} days.

This is your final notice. If payment is not received within 7 days, I will be forced to pursue other means of collection.

Please contact me immediately to resolve this matter.

${freelancerName}`,
  };

  return {
    subject: subjects[tone],
    body: bodies[tone],
  };
}