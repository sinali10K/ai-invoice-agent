"use client"

import { useQuery } from "@tanstack/react-query"

type Invoice = {
  id: string
  amount: string
  currency: string
  status: string
  dueDate: string
  client: {
    name: string
    email: string
  }
}

function formatCurrency(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount))
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json()
    },
  })

  const invoices: Invoice[] = data?.invoices ?? []

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length

  const paidThisMonth = invoices
    .filter((inv) => {
      if (inv.status !== "PAID") return false
      const date = new Date(inv.dueDate)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const recentInvoices = invoices.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your invoice collection activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Total Outstanding</p>
          {isLoading ? (
            <div className="h-9 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold">
              {formatCurrency(totalOutstanding.toString(), "USD")}
            </p>
          )}
        </div>
        <div className="border rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Overdue Invoices</p>
          {isLoading ? (
            <div className="h-9 bg-muted animate-pulse rounded" />
          ) : (
            <p className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-600" : ""}`}>
              {overdueCount}
            </p>
          )}
        </div>
        <div className="border rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Collected This Month</p>
          {isLoading ? (
            <div className="h-9 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold">
              {formatCurrency(paidThisMonth.toString(), "USD")}
            </p>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Invoices</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : recentInvoices.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No invoices yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Client</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">{invoice.client?.name}</td>
                  <td className="px-4 py-3">{formatCurrency(invoice.amount, invoice.currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      invoice.status === "PAID" ? "bg-green-100 text-green-700" :
                      invoice.status === "OVERDUE" ? "bg-red-100 text-red-700" :
                      invoice.status === "SENT" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
