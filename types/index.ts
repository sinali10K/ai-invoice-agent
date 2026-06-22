export type InvoiceStatus = 'pending' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export type Client = {
  id: string
  name: string
  email: string
  company?: string
  createdAt: Date
}

export type Invoice = {
  id: string
  clientId: string
  client?: Client
  amount: number
  currency: string
  status: InvoiceStatus
  dueDate: Date
  invoiceNumber: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type ReminderTone = 'friendly' | 'professional' | 'firm'

export type EmailReminder = {
  id: string
  invoiceId: string
  tone: ReminderTone
  subject: string
  body: string
  sentAt?: Date
  createdAt: Date
}

export type User = {
  id: string
  email: string
  name?: string
  brandName?: string
  brandColor?: string
  createdAt: Date
}
