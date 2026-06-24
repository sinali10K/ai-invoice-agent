export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize how your invoices and reminders look
        </p>
      </div>

      <div className="border rounded-lg divide-y">
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">Brand Identity</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <input
              type="text"
              placeholder="Your Business Name"
              className="w-full max-w-md px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#000000"
                className="h-10 w-20 rounded-md border cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">#000000</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="font-semibold">Email Signature</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Signature Text</label>
            <textarea
              placeholder="Best regards,&#10;Your Name"
              rows={4}
              className="w-full max-w-md px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <div className="p-6">
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
