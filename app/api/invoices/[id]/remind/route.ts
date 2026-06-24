import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateReminderEmail } from "@/lib/ai";
import { sendReminderEmail } from "@/lib/resend";
import { NextResponse } from "next/server";
import { ReminderTone } from "@/lib/types";

// POST /api/invoices/:id/remind
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const tone: ReminderTone = body.tone ?? ReminderTone.FRIENDLY;

    // پیدا کردن invoice با client
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: user.id },
      include: { client: true, user: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json(
        { error: "Cannot send reminder for a paid invoice" },
        { status: 400 }
      );
    }

    // محاسبه تعداد روزهای تأخیر
    const daysPastDue = Math.max(
      0,
      Math.floor(
        (new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // تولید ایمیل با AI
    const { subject, body: emailBody } = await generateReminderEmail({
      clientName: invoice.client.name,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      daysPastDue,
      tone,
      freelancerName: invoice.user.name ?? "Your Service Provider",
    });

    // ارسال ایمیل
    await sendReminderEmail({
      to: invoice.client.email,
      subject,
      body: emailBody,
    });

    // ذخیره در ReminderLog
    const reminderLog = await prisma.reminderLog.create({
      data: {
        invoiceId: invoice.id,
        tone,
        subject,
        body: emailBody,
      },
    });

    // آپدیت وضعیت invoice به OVERDUE اگه دیر شده
    if (daysPastDue > 0 && invoice.status === "SENT") {
      await prisma.invoice.update({
        where: { id },
        data: { status: "OVERDUE" },
      });
    }

    return NextResponse.json({ reminderLog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices/:id/remind error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}