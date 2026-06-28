"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Client = {
  id: string
  name: string
  email: string
  company?: string
}

export default function OnboardingStep3Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/clients")
      if (!res.ok) throw new Error("Failed to fetch clients")
      return res.json()
    },
  })

  const clients: Client[] = data?.clients ?? []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      clientId: formData.get("clientId"),
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      dueDate: formData.get("dueDate"),
      description: formData.get("description"),
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to create invoice")

      router.push("/dashboard")
    } catch {
      setError("Failed to create invoice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Invoice Agent</h1>
        <p className="text-muted-foreground">Let's get you set up in just a few steps</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {["Business Info", "Add Client", "First Invoice", "Done"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < 2 ? "bg-primary text-primary-foreground"
                : index === 2 ? "bg-primary text-primary-foreground"
                : "border-2 text-muted-foreground"
              }`}>
                {index < 2 ? "✓" : index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{step}</span>
            </div>
            {index < 3 && <div className="w-16 h-px bg-border mx-2 mb-4" />}
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Create your first invoice</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add an invoice to start tracking payments
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Client <span className="text-destructive">*</span></label>
            <select
              name="clientId"
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount <span className="text-destructive">*</span></label>
              <input
                name="amount"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="1000.00"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                name="currency"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date <span className="text-destructive">*</span></label>
            <input
              name="dueDate"
              type="date"
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              name="description"
              type="text"
              placeholder="Web design project"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push("/onboarding/step-2")}
              className="px-4 py-2 border text-sm rounded-md hover:bg-muted transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Finish Setup →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
