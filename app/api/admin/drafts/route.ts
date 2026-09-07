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
 * triggers a redeploy and the change is live ~1–2 min later. The repo (not the
 * deployed bundle) is the source of truth, so a double-submit on an
 * already-processed draft is a no-op instead of an error. Without a token
 * (local `npm run dev`) it falls back to a direct filesystem write.
 */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logEvent } from "@/lib/db";
import { commitFiles, getRepoFile, githubConfigured } from "@/lib/github";

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

function stampPost(raw: string): string {
  const { data, content } = matter(raw);
  data.date = new Date().toISOString().slice(0, 10);
  return matter.stringify(content, data);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return back(req, { error: "1" });

  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const action = String(form.get("action") ?? "");
  if (!SLUG_RE.test(slug)) return back(req, { err: "bad-slug" });
  if (action !== "publish" && action !== "reject") {
    return back(req, { err: "bad-action" });
  }

  try {
    // --- Production: commit to GitHub (repo is source of truth) ---
    if (githubConfigured()) {
      const draft = await getRepoFile(`content/drafts/${slug}.md`);

      if (!draft) {
        // Draft already gone — treat a repeat click as success if the
        // destination already exists, otherwise report it missing.
        const done =
          action === "publish"
            ? await getRepoFile(`content/posts/${slug}.md`)
            : await getRepoFile(`content/drafts/rejected/${slug}.md`);
        return done
          ? back(req, { ok: `${action}ed:${slug}` })
          : back(req, { err: "draft-missing" });
      }

      if (action === "publish") {
        await commitFiles(`Publish draft: ${slug}`, [
          { path: `content/posts/${slug}.md`, content: stampPost(draft.text) },
          { path: `content/drafts/${slug}.md`, delete: true },
        ]);
        await logEvent("draft.published", "admin", { slug });
      } else {
        await commitFiles(`Reject draft: ${slug}`, [
          { path: `content/drafts/rejected/${slug}.md`, content: draft.text },
          { path: `content/drafts/${slug}.md`, delete: true },
        ]);
        await logEvent("draft.rejected", "admin", { slug });
      }
      return back(req, { ok: `${action}ed:${slug}` });
    }

    // --- Local dev: write the filesystem directly ---
    const src = path.join(CONTENT, "drafts", `${slug}.md`);
    if (!fs.existsSync(src)) return back(req, { err: "draft-missing" });
    const raw = fs.readFileSync(src, "utf8");

    if (action === "publish") {
      fs.writeFileSync(path.join(CONTENT, "posts", `${slug}.md`), stampPost(raw));
      fs.unlinkSync(src);
      await logEvent("draft.published", "admin", { slug });
    } else {
      const rejectedDir = path.join(CONTENT, "drafts", "rejected");
      fs.mkdirSync(rejectedDir, { recursive: true });
      fs.renameSync(src, path.join(rejectedDir, `${slug}.md`));
      await logEvent("draft.rejected", "admin", { slug });
    }
    return back(req, { ok: `${action}ed:${slug}` });
  } catch (e) {
    await logEvent("draft.action_failed", "admin", {
      slug,
      action,
      error: String(e),
    }).catch(() => {});
    return back(req, { err: "commit-failed" });
  }
}
