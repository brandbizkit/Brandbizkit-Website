/**
 * Draft approval actions from /admin.
 *
 * POST (form): { slug, action: "publish" | "reject" }
 *  - publish → writes content/posts/<slug>.md (date stamped today) and removes
 *    the draft. The article joins the blog index, sitemap, RSS, llms.txt and
 *    gets its .md mirror on the next deploy.
 *  - reject  → moves the draft to content/drafts/rejected/ for reference.
 *
 * On Vercel the filesystem is read-only, so both actions commit the change to
 * GitHub via the API (see lib/github.ts) when GITHUB_TOKEN is set — the commit
 * triggers a redeploy and the change is live ~1–2 min later. Without a token
 * (local `npm run dev`) it falls back to a direct filesystem write.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logEvent } from "@/lib/db";
import { commitFiles, githubConfigured } from "@/lib/github";

const CONTENT = path.join(process.cwd(), "content");
const SLUG_RE = /^[a-z0-9-]{3,120}$/;

function authorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_KEY;
  return !!adminKey && req.cookies.get("bb_admin")?.value === adminKey;
}

function back(req: NextRequest, params: Record<string, string>) {
  const url = new URL("/admin", req.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return back(req, { error: "1" });

  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const action = String(form.get("action") ?? "");
  if (!SLUG_RE.test(slug)) return back(req, { err: "bad-slug" });

  const src = path.join(CONTENT, "drafts", `${slug}.md`);
  if (!fs.existsSync(src)) return back(req, { err: "draft-missing" });
  const raw = fs.readFileSync(src, "utf8");

  if (!githubConfigured() && process.env.VERCEL) {
    return back(req, { err: "no-github-token" });
  }

  try {
    if (action === "publish") {
      const { data, content } = matter(raw);
      data.date = new Date().toISOString().slice(0, 10);
      const postMd = matter.stringify(content, data);

      if (githubConfigured()) {
        await commitFiles(`Publish draft: ${slug}`, [
          { path: `content/posts/${slug}.md`, content: postMd },
          { path: `content/drafts/${slug}.md`, delete: true },
        ]);
      } else {
        fs.writeFileSync(path.join(CONTENT, "posts", `${slug}.md`), postMd);
        fs.unlinkSync(src);
      }
      await logEvent("draft.published", "admin", { slug });
      return back(req, { ok: `published:${slug}` });
    }

    if (action === "reject") {
      if (githubConfigured()) {
        await commitFiles(`Reject draft: ${slug}`, [
          { path: `content/drafts/rejected/${slug}.md`, content: raw },
          { path: `content/drafts/${slug}.md`, delete: true },
        ]);
      } else {
        const rejectedDir = path.join(CONTENT, "drafts", "rejected");
        fs.mkdirSync(rejectedDir, { recursive: true });
        fs.renameSync(src, path.join(rejectedDir, `${slug}.md`));
      }
      await logEvent("draft.rejected", "admin", { slug });
      return back(req, { ok: `rejected:${slug}` });
    }

    return back(req, { err: "bad-action" });
  } catch (e) {
    await logEvent("draft.action_failed", "admin", {
      slug,
      action,
      error: String(e),
    }).catch(() => {});
    return back(req, { err: "commit-failed" });
  }
}
