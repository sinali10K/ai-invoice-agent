import { signIn } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="w-full max-w-md space-y-6 p-8 border rounded-xl shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to continue
        </p>
      </div>

      {params.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {params.error}
        </div>
      )}

      {params.message === "check_email" && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
          Confirmation email sent. Please check your inbox.
        </div>
      )}

      <form action={signIn} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  )
}
