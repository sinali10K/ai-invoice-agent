import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await resend.emails.send({
    from: "AI Invoice Agent <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${body.replace(/\n/g, "<br/>")}
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}