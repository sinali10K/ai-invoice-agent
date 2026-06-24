export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-generated reminders waiting for your approval
        </p>
      </div>

      <div className="border rounded-lg divide-y">
        <div className="p-6 text-center text-muted-foreground text-sm">
          No reminders in queue. When AI generates email reminders, they will appear here for review before sending.
        </div>
      </div>
    </div>
  )
}
