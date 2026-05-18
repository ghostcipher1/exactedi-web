import { parseRequestBody } from "./_lib/parse-body.js";
import { deliverLead } from "./_lib/send-lead.js";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const data = await parseRequestBody(req);
    const email = (data.email ?? "").trim();
    const company = (data.company ?? data.organization ?? "").trim();
    const useCase = (data.primary_use_case ?? "").trim();

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid work email required" }, { status: 400 });
    }
    if (!useCase) {
      return Response.json({ error: "Primary use case required" }, { status: 400 });
    }

    const lines = [
      `Email: ${email}`,
      `Company: ${company || "(not provided)"}`,
      `Name: ${data.name ?? data.full_name ?? "(not provided)"}`,
      `Title: ${data.title ?? data.job_title ?? "(not provided)"}`,
      `Primary use case: ${useCase}`,
      `Monthly X12 volume: ${data.monthly_volume ?? data.volume ?? "(not provided)"}`,
      `Deployment: ${data.deployment ?? "(not provided)"}`,
      `Message: ${data.message ?? data.notes ?? "(not provided)"}`,
      `Authorization: ${data.authorization ?? "(not provided)"}`,
      `Submitted: ${new Date().toISOString()}`,
      `Source: exactedi.com/request-access`,
    ];

    await deliverLead(
      `[ExactEDI Beta] ${company || email}`,
      lines.join("\n"),
      { email, company, use_case: useCase, form: "beta_access" }
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("beta-access error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 }
    );
  }
}
