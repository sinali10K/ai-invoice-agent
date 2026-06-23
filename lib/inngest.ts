import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-invoice-agent",
  eventKey: process.env.INNGEST_EVENT_KEY,
});