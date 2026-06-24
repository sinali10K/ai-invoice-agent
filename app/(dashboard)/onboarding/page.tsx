export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Invoice Agent</h1>
        <p className="text-muted-foreground">
          Let's get you set up in just a few steps
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {["Business Info", "Add Client", "First Invoice", "Done"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "border-2 text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{step}</span>
            </div>
            {index < 3 && (
              <div className="w-16 h-px bg-border mx-2 mb-4" />
            )}
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Tell us about your business</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This information will appear on your invoices and reminders
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <input
              type="text"
              placeholder="Acme Freelance Studio"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="John Smith"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Currency</label>
            <select className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="CAD">CAD — Canadian Dollar</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors">
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
