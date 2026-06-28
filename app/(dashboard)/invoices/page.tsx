"use client"

import { useQuery } from "@tanstack/react-query"

type Client = {
  id: string
  name: string
  email: string
}

type Invoice = {
  id: string
  client: Client
  amount: string
  currency: string
  status: string
  dueDate: string
  invoiceDate: string
}

function formatCurrency(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  OVERDUE: "bg-red-100 text-red-700",
  PAID: "bg-green-100 text-green-700",
}

export default function InvoicesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices")
      if (!res.ok) throw new Error("Failed to fetch invoices")
      return res.json()
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and track your invoices
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
          + New Invoice
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Client</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Due Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-muted-foreground">
                  Loading invoices...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-destructive">
                  Failed to load invoices.
                </td>
              </tr>
            )}
            {!isLoading && !error && data?.invoices?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-muted-foreground">
                  No invoices yet. Create your first invoice to get started.
                </td>
              </tr>
            )}
            {data?.invoices?.map((invoice: Invoice) => (
              <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{invoice.client?.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.client?.email}</p>
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[invoice.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
