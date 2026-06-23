import Link from "next/link"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/review", label: "Review Queue" },
  { href: "/settings", label: "Brand Settings" },
  { href: "/billing", label: "Billing" },
]

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r bg-background flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-semibold">Invoice Agent</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">AI Invoice Agent v0.1</p>
      </div>
    </aside>
  )
}
