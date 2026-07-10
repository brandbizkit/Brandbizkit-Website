/**
 * GoHighLevel CRM sync. When GHL_API_KEY + GHL_LOCATION_ID (or a webhook URL)
 * are configured, every lead captured on the site is forwarded so existing
 * GHL automations (emails, pipelines, workflows) keep working while the
 * owned database remains the source of truth.
 */
export async function forwardLeadToGhl(lead: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
}): Promise<boolean> {
  const webhook = process.env.GHL_WEBHOOK_URL;
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      return res.ok;
    }
    if (apiKey && locationId) {
      const [firstName, ...rest] = lead.name.split(" ");
      const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId,
          firstName,
          lastName: rest.join(" ") || undefined,
          email: lead.email,
          phone: lead.phone || undefined,
          source: lead.source ?? "brandbizkit.com",
          tags: ["website-lead"],
        }),
      });
      return res.ok;
    }
  } catch {
    return false;
  }
  return false;
}
