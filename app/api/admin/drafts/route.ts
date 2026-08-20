/**
 * Draft approval actions from /admin.
 *
 * POST (form): { slug, action: "publish" | "reject" }
 *  - publish → moves content/drafts/<slug>.md to content/posts/<slug>.md and
 *    stamps `date` with today (the real publish date). The article instantly
 *    joins the blog index, sitemap, RSS, llms.txt and gets its .md mirror.
 *  - reject  → moves the draft to content/drafts/rejected/ for reference.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logEvent } from "@/lib/db";

const CONTENT = path.join(process.cwd(), "content");

function authorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_KEY;
  return !!adminKey && req.cookies.get("bb_admin")?.value === adminKey;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), 303);
  }
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const action = String(form.get("action") ?? "");
  const src = path.join(CONTENT, "drafts", `${slug}.md`);
  if (!/^[a-z0-9-]{3,120}$/.test(slug) || !fs.existsSync(src)) {
    return NextResponse.redirect(new URL("/admin", req.url), 303);
  }

  if (action === "publish") {
    const raw = fs.readFileSync(src, "utf8");
    const { data, content } = matter(raw);
    data.date = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(
      path.join(CONTENT, "posts", `${slug}.md`),
      matter.stringify(content, data)
    );
    fs.unlinkSync(src);
    await logEvent("draft.published", "admin", { slug });
  } else if (action === "reject") {
    const rejectedDir = path.join(CONTENT, "drafts", "rejected");
    fs.mkdirSync(rejectedDir, { recursive: true });
    fs.renameSync(src, path.join(rejectedDir, `${slug}.md`));
    await logEvent("draft.rejected", "admin", { slug });
  }
  return NextResponse.redirect(new URL("/admin", req.url), 303);
}
