export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your subscription and payment details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Current Plan</h2>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Free
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Up to 5 invoices</li>
              <li>✓ 3 AI reminders per invoice</li>
              <li>✓ Basic email templates</li>
            </ul>
          </div>
          <button className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
            Upgrade to Pro
          </button>
        </div>

        <div className="border rounded-lg p-6 space-y-4 opacity-60">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pro Plan</h2>
            <span className="text-xs border px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Unlimited invoices</li>
              <li>✓ Unlimited AI reminders</li>
              <li>✓ Custom email templates</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Payment History</h2>
        <p className="text-sm text-muted-foreground">No payment history yet.</p>
      </div>
    </div>
  )
}
