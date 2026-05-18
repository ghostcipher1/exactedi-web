import { parseRequestBody } from "./_lib/parse-body.js";
import { deliverLead } from "./_lib/send-lead.js";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await parseRequestBody(req);
    const email = (data.email ?? "").trim();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    await deliverLead(
      `[ExactEDI Newsletter] ${email}`,
      `Newsletter signup: ${email}\nSubmitted: ${new Date().toISOString()}`,
      { email, form: "newsletter" }
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("newsletter error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Subscription failed" },
      { status: 500 }
    );
  }
}
