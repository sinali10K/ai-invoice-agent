"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingStep2Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get("contactName"),
      email: formData.get("email"),
      company: formData.get("company"),
    }

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to create client")

      router.push("/onboarding/step-3")
    } catch {
      setError("Failed to create client. Please try again.")
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
                index < 1 ? "bg-primary text-primary-foreground"
                : index === 1 ? "bg-primary text-primary-foreground"
                : "border-2 text-muted-foreground"
              }`}>
                {index < 1 ? "✓" : index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{step}</span>
            </div>
            {index < 3 && <div className="w-16 h-px bg-border mx-2 mb-4" />}
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Add your first client</h2>
          <p className="text-sm text-muted-foreground mt-1">Who do you want to send invoices to?</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <input
              name="company"
              type="text"
              placeholder="Acme Corp"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Name <span className="text-destructive">*</span></label>
            <input
              name="contactName"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@acmecorp.com"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="px-4 py-2 border text-sm rounded-md hover:bg-muted transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
