import { signIn } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="w-full max-w-md space-y-6 p-8 border rounded-xl shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">ورود به حساب</h1>
        <p className="text-muted-foreground text-sm">
          برای ادامه وارد شوید
        </p>
      </div>

      {searchParams.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {searchParams.error}
        </div>
      )}

      {searchParams.message === "check_email" && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
          ایمیل تایید ارسال شد. لطفاً اینباکس خود را چک کنید.
        </div>
      )}

      <form action={signIn} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            ایمیل
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
            رمز عبور
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
          ورود
        </Button>
      </form>
    </div>
  )
}
