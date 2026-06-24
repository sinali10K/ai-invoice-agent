import type { InvoiceStatus, ReminderTone } from "@/lib/types"

// Re-export
export type { InvoiceStatus, ReminderTone, EscalationStage } from "@/lib/types"

// Types اضافی برای Frontend
export type Client = {
  id: string
  userId: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Invoice = {
  id: string
  userId: string
  clientId: string
  client?: Client
  amount: number
  currency: string
  status: InvoiceStatus
  dueDate: Date
  invoiceDate: Date
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export type EmailReminder = {
  id: string
  invoiceId: string
  tone: ReminderTone
  subject: string
  body: string
  sentAt?: Date | null
  createdAt: Date
}

export type User = {
  id: string
  email: string
  name?: string | null
  createdAt: Date
  updatedAt: Date
}
