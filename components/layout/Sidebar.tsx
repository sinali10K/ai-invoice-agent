import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  CreditCard,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/review", label: "Review Queue", icon: ClipboardList },
  { href: "/settings", label: "Brand Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
]

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r bg-background flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-semibold tracking-tight">Invoice Agent</h1>
        <p className="text-xs text-muted-foreground mt-1">AI Collection Tool</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
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
