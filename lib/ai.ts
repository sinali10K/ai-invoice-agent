import Groq from "groq-sdk";
import type { ReminderTone } from "@/lib/types";

interface GenerateReminderEmailParams {
  clientName: string;
  amount: number;
  currency: string;
  dueDate: Date;
  daysPastDue: number;
  tone: ReminderTone;
  freelancerName: string;
  escalationStage?: number;
}

interface GeneratedEmail {
  subject: string;
  body: string;
}

export async function generateReminderEmail(
  params: GenerateReminderEmailParams
): Promise<GeneratedEmail> {
  if (process.env.GROQ_API_KEY) {
    return generateWithGroq(params);
  }
  return generateMockEmail(params);
}

async function generateWithGroq(
  params: GenerateReminderEmailParams
): Promise<GeneratedEmail> {
  const {
    clientName,
    amount,
    currency,
    dueDate,
    daysPastDue,
    tone,
    freelancerName,
    escalationStage = 1,
  } = params;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dueDate);

  const prompt = `You are an AI assistant helping freelancers collect overdue invoices.
Write a professional invoice reminder email.

Details:
- Client Name: ${clientName}
- Invoice Amount: ${formattedAmount}
- Due Date: ${formattedDate}
- Days Past Due: ${daysPastDue}
- Escalation Stage: ${escalationStage} of 4
- Tone: ${tone} (FRIENDLY = polite reminder, FIRM = assertive, FINAL = urgent last notice)
- Sender Name: ${freelancerName}

Rules:
- Keep it professional and concise
- Stage 1: gentle reminder
- Stage 2-3: firm but professional
- Stage 4: final notice with consequences
- Do NOT include any placeholder text like [Your Name]

Respond ONLY with a valid JSON object, no markdown, no explanation:
{"subject": "email subject here", "body": "email body here"}`;

  const result = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
  });

  const text = result.choices[0]?.message?.content ?? "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return {
      subject: parsed.subject,
      body: parsed.body,
    };
  } catch {
    return generateMockEmail(params);
  }
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
    FRIENDLY: `Dear ${clientName},\n\nI hope this message finds you well. I wanted to send a gentle reminder that an invoice for ${formattedAmount} was due on ${formattedDate}.\n\nIf you have already made the payment, please disregard this message. Otherwise, I would appreciate if you could arrange payment at your earliest convenience.\n\nBest regards,\n${freelancerName}`,
    FIRM: `Dear ${clientName},\n\nThis is a reminder that your invoice for ${formattedAmount}, which was due on ${formattedDate}, is now ${daysPastDue} days overdue.\n\nPlease arrange payment immediately. If there is an issue, please contact me as soon as possible.\n\nRegards,\n${freelancerName}`,
    FINAL: `Dear ${clientName},\n\nDespite previous reminders, your invoice for ${formattedAmount} (due ${formattedDate}) remains unpaid after ${daysPastDue} days.\n\nThis is your final notice. If payment is not received within 7 days, I will be forced to pursue other means of collection.\n\n${freelancerName}`,
  };

  return {
    subject: subjects[tone],
    body: bodies[tone],
  };
}
