import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getDraft } from "@/lib/content";
import InsightArticle from "@/components/InsightArticle";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Draft preview — BrandBizkit CMS",
  robots: { index: false, follow: false },
};

/** Full-fidelity preview of a pending article draft, gated by the admin cookie. */
export default async function DraftPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || cookieStore.get("bb_admin")?.value !== adminKey) {
    redirect("/admin");
  }
  const { slug } = await params;
  const draft = getDraft(slug);
  if (!draft) notFound();

  return (
    <>
      <div className="sticky top-[65px] z-40 border-b border-brand-yellow/50 bg-brand-yellow/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <p className="font-display text-sm font-bold text-brand-ink">
            📝 Draft preview — not published
          </p>
          <div className="ml-auto flex gap-2">
            <form method="POST" action="/api/admin/drafts">
              <input type="hidden" name="slug" value={draft.slug} />
              <input type="hidden" name="action" value="publish" />
              <button className="btn btn-primary px-5 py-1.5 text-sm">✓ Publish</button>
            </form>
            <form method="POST" action="/api/admin/drafts">
              <input type="hidden" name="slug" value={draft.slug} />
              <input type="hidden" name="action" value="reject" />
              <button className="btn bg-white px-5 py-1.5 text-sm text-brand-ink hover:bg-brand-ink hover:text-white">
                ✕ Reject
              </button>
            </form>
            <Link href="/admin" className="btn bg-white/60 px-5 py-1.5 text-sm text-brand-ink hover:bg-white">
              Back
            </Link>
          </div>
        </div>
      </div>
      <InsightArticle post={draft} />
    </>
  );
}
