"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

type Client = {
  id: string
  name: string
  email: string
}

type Invoice = {
  id: string
  clientId: string
  client: Client
  amount: string
  currency: string
  status: string
  dueDate: string
  invoiceDate: string
}

function getDaysPastDue(dueDate: string) {
  const due = new Date(dueDate)
  const now = new Date()
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function formatCurrency(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount))
}

export default function ReviewPage() {
  const queryClient = useQueryClient()
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices")
      if (!res.ok) throw new Error("Failed to fetch invoices")
      return res.json()
    },
  })

  const sendReminder = useMutation({
    mutationFn: async (invoiceId: string) => {
      const res = await fetch(`/api/invoices/${invoiceId}/remind`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone: "FRIENDLY" }),
      })
      if (!res.ok) throw new Error("Failed to send reminder")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      setToast("Reminder sent successfully!")
      setTimeout(() => setToast(null), 3000)
    },
    onError: () => {
      setToast("Failed to send reminder.")
      setTimeout(() => setToast(null), 3000)
    },
  })

  const overdueInvoices = data?.invoices?.filter(
    (inv: Invoice) => inv.status === "OVERDUE"
  ) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overdue invoices waiting for AI reminder
        </p>
      </div>

      {toast && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
          {toast}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse bg-muted/30 h-24" />
          ))}
        </div>
      )}

      {error && (
        <div className="border rounded-lg p-6 text-center text-destructive text-sm">
          Failed to load invoices. Please try again.
        </div>
      )}

      {!isLoading && !error && overdueInvoices.length === 0 && (
        <div className="border rounded-lg p-12 text-center text-muted-foreground text-sm">
          No overdue invoices. Great job staying on top of your collections!
        </div>
      )}

      <div className="space-y-3">
        {overdueInvoices.map((invoice: Invoice) => {
          const daysPastDue = getDaysPastDue(invoice.dueDate)
          return (
            <div key={invoice.id} className="border rounded-lg p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{invoice.client?.name}</p>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {daysPastDue} days overdue
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.client?.email}</p>
                <p className="text-lg font-bold">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </p>
              </div>
              <button
                onClick={() => {
                  setSendingId(invoice.id)
                  sendReminder.mutate(invoice.id, {
                    onSettled: () => setSendingId(null),
                  })
                }}
                disabled={sendingId === invoice.id}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {sendingId === invoice.id ? "Sending..." : "Send Reminder"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
