export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r">
        {/* Sidebar - بعداً کامل می‌شه */}
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
