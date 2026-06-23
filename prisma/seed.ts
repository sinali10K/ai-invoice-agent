import { PrismaClient, InvoiceStatus, ReminderTone } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

const USERS = [
  { email: "alice@example.com", name: "Alice Johnson" },
  { email: "bob@example.com", name: "Bob Smith" },
];

const CLIENTS_PER_USER = [
  [
    { name: "Acme Corp", email: "billing@acme.com", company: "Acme Corp" },
    { name: "Globex Inc", email: "pay@globex.com", company: "Globex Inc" },
  ],
  [
    { name: "Initech", email: "accounts@initech.com", company: "Initech" },
    { name: "Umbrella Ltd", email: "finance@umbrella.com", company: "Umbrella Ltd" },
  ],
];

async function main() {
  console.log("🌱 Seeding database...");

  for (let i = 0; i < USERS.length; i++) {
    const userData = USERS[i];

    // idempotent: اگه user وجود داشت skip کن
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
      },
    });

    console.log(`✅ User: ${user.name} (${user.email})`);

    for (const clientData of CLIENTS_PER_USER[i]) {
      // idempotent: client رو پیدا کن یا بساز
      let client = await prisma.client.findFirst({
        where: { email: clientData.email, userId: user.id },
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            userId: user.id,
            name: clientData.name,
            email: clientData.email,
            company: clientData.company,
          },
        });
      }

      console.log(`  ✅ Client: ${client.name}`);

      // invoiceهای نمونه برای هر client
      const invoices = [
        {
          amount: 1500.0,
          status: InvoiceStatus.SENT,
          dueDate: days(14),
          invoiceDate: days(-5),
          description: "Web design services - Phase 1",
        },
        {
          amount: 2200.0,
          status: InvoiceStatus.OVERDUE,
          dueDate: days(-7),
          invoiceDate: days(-37),
          description: "Mobile app development - Sprint 1",
        },
        {
          amount: 800.0,
          status: InvoiceStatus.OVERDUE,
          dueDate: days(-15),
          invoiceDate: days(-45),
          description: "SEO consulting services",
        },
        {
          amount: 3500.0,
          status: InvoiceStatus.OVERDUE,
          dueDate: days(-30),
          invoiceDate: days(-60),
          description: "Backend API development",
        },
        {
          amount: 950.0,
          status: InvoiceStatus.PAID,
          dueDate: days(-45),
          invoiceDate: days(-75),
          description: "Logo and branding package",
        },
      ];

      for (const invoiceData of invoices) {
        // idempotent: invoice رو پیدا کن یا بساز
        const existing = await prisma.invoice.findFirst({
          where: {
            clientId: client.id,
            userId: user.id,
            description: invoiceData.description,
          },
        });

        if (!existing) {
          const invoice = await prisma.invoice.create({
            data: {
              userId: user.id,
              clientId: client.id,
              amount: invoiceData.amount,
              currency: "USD",
              status: invoiceData.status,
              dueDate: invoiceData.dueDate,
              invoiceDate: invoiceData.invoiceDate,
              description: invoiceData.description,
            },
          });

          // برای OVERDUE invoiceها یک ReminderLog نمونه بساز
          if (invoiceData.status === InvoiceStatus.OVERDUE) {
            await prisma.reminderLog.create({
              data: {
                invoiceId: invoice.id,
                tone: ReminderTone.FRIENDLY,
                subject: `Reminder: Invoice #${invoice.id.slice(0, 8)} is overdue`,
                body: `Dear ${client.name}, your invoice of $${invoiceData.amount} is overdue. Please arrange payment at your earliest convenience.`,
                sentAt: days(-1),
              },
            });
          }

          console.log(`    ✅ Invoice: ${invoiceData.description} — ${invoiceData.status}`);
        } else {
          console.log(`    ⏭️  Invoice already exists: ${invoiceData.description}`);
        }
      }
    }
  }

  console.log("\n✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });