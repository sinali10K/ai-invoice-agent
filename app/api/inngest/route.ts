import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { sendReminderFunction } from "@/lib/inngest-functions/send-reminder";
import { checkOverdueFunction } from "@/lib/inngest-functions/check-overdue";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendReminderFunction, checkOverdueFunction],
});