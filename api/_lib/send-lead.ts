export async function deliverLead(
  subject: string,
  body: string,
  meta?: Record<string, string>
): Promise<void> {
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, ...meta }),
    });
    if (!res.ok) {
      throw new Error(`Webhook failed: ${res.status}`);
    }
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL ?? "contact@exactedi.com";
  const from =
    process.env.RESEND_FROM_EMAIL ?? "ExactEDI Website <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error(
      "Lead capture not configured. Set RESEND_API_KEY or LEADS_WEBHOOK_URL in Vercel."
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Email delivery failed: ${err}`);
  }
}
