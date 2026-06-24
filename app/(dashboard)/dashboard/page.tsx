export default function DashboardPage() {
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
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        <div className="border rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Overdue Invoices</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Collected This Month</p>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      </div>
    </div>
  )
}
