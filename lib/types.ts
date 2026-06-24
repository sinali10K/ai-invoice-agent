export type InvoiceStatus = "DRAFT" | "SENT" | "OVERDUE" | "PAID";
export type ReminderTone = "FRIENDLY" | "FIRM" | "FINAL";

export const ReminderTone = {
  FRIENDLY: "FRIENDLY" as ReminderTone,
  FIRM: "FIRM" as ReminderTone,
  FINAL: "FINAL" as ReminderTone,
};
export type EscalationStage = "STAGE_1" | "STAGE_2" | "STAGE_3" | "STAGE_4";

export const EscalationStage = {
  STAGE_1: "STAGE_1" as EscalationStage,
  STAGE_2: "STAGE_2" as EscalationStage,
  STAGE_3: "STAGE_3" as EscalationStage,
  STAGE_4: "STAGE_4" as EscalationStage,
};