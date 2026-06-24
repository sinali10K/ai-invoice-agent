export type InvoiceStatus = "DRAFT" | "SENT" | "OVERDUE" | "PAID";
export type ReminderTone = "FRIENDLY" | "FIRM" | "FINAL";

export const ReminderTone = {
  FRIENDLY: "FRIENDLY" as ReminderTone,
  FIRM: "FIRM" as ReminderTone,
  FINAL: "FINAL" as ReminderTone,
};