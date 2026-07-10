import { NextRequest } from "next/server";

/** Shared auth for the agent publishing API. Set AGENT_API_KEY in .env. */
export function agentAuthorized(req: NextRequest): boolean {
  const key = process.env.AGENT_API_KEY;
  if (!key) return false; // API disabled until a key is configured
  const header = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace(/^Bearer /, "");
  return header === key;
}
