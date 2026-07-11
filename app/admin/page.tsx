import { cookies } from "next/headers";
import { listLeads, listSubscribers, listEvents } from "@/lib/db";
import { getAllSlugs, getPosts, getDrafts, getVideos } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — BrandBizkit CMS", robots: { index: false } };

function Login({ error }: { error?: boolean }) {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-2xl font-bold">BrandBizkit Admin</h1>
      <form method="POST" action="/api/admin/login" className="mt-6 grid gap-3">
        <input
          type="password"
          name="key"
          placeholder="Admin key"
          className="rounded-lg border border-brand-ink/15 bg-white px-4 py-3"
        />
        <button className="rounded-full bg-brand-periwinkle px-6 py-3 font-semibold">Sign in</button>
        {error && <p className="text-sm text-red-400">Wrong key (or ADMIN_KEY not set in .env).</p>}
      </form>
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const adminKey = process.env.ADMIN_KEY;
  const authed = !!adminKey && cookieStore.get("bb_admin")?.value === adminKey;
  if (!authed) return <Login error={!!error} />;

  const leads = await listLeads();
  const drafts = getDrafts();
  const subs = await listSubscribers();
  const events = listEvents(50);
  const slugs = getAllSlugs();
  const posts = getPosts();
  const videos = getVideos();
  const missingTranscripts = videos.filter((v) => !v.transcript).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">
        Digital Home — <span className="text-brand-accent">Command Center</span>
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Drafts awaiting approval", value: drafts.length },
          { label: "Leads", value: leads.length },
          { label: "Subscribers", value: subs.length },
          { label: "Published pages", value: slugs.length + 2 },
          { label: "Videos missing transcripts", value: missingTranscripts },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-ink/10 bg-white shadow-sm p-5">
            <p className="text-3xl font-bold text-brand-periwinkle">{s.value}</p>
            <p className="mt-1 text-sm text-brand-text/70">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">📝 Article drafts awaiting approval</h2>
      <p className="mt-1 text-sm text-brand-text/60">
        Written by the every-other-day research agent. Preview shows the article exactly as it
        will publish; publishing stamps today&apos;s date and adds it to the blog, sitemap, RSS,
        and llms.txt automatically.
      </p>
      {drafts.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-brand-ink/20 p-5 text-sm text-brand-text/50">
          No drafts waiting. The next one arrives with the scheduled research run.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {drafts.map((d) => (
            <div key={d.slug} className="card flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-brand-ink">{d.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-brand-text/70">{d.description}</p>
                <p className="mt-1.5 text-xs text-brand-text/50">
                  By {d.author} · drafted {d.date}
                  {d.readTime ? ` · ${d.readTime}` : ""}
                  {d.charts?.length ? ` · ${d.charts.length} chart${d.charts.length > 1 ? "s" : ""}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <a href={`/admin/drafts/${d.slug}`} className="btn btn-secondary px-5 py-2 text-sm">
                  Preview
                </a>
                <form method="POST" action="/api/admin/drafts">
                  <input type="hidden" name="slug" value={d.slug} />
                  <input type="hidden" name="action" value="publish" />
                  <button className="btn btn-primary px-5 py-2 text-sm">Publish</button>
                </form>
                <form method="POST" action="/api/admin/drafts">
                  <input type="hidden" name="slug" value={d.slug} />
                  <input type="hidden" name="action" value="reject" />
                  <button className="btn btn-outline px-5 py-2 text-sm">Reject</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-12 font-display text-xl font-bold">CRM — Latest leads</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-brand-light text-left text-brand-text/70">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Source</th>
              <th className="p-3">AI experience</th>
              <th className="p-3">GHL sync</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-brand-text/50">No leads yet — they land here (and forward to GoHighLevel if configured).</td></tr>
            )}
            {leads.slice(0, 25).map((l) => (
              <tr key={l.id} className="border-t border-brand-ink/10">
                <td className="p-3 text-brand-text/60">{l.created_at}</td>
                <td className="p-3">{l.name}</td>
                <td className="p-3">{l.email}</td>
                <td className="p-3">{l.source}</td>
                <td className="p-3 text-brand-text/60">{l.experience_level ?? "—"}</td>
                <td className="p-3">{l.synced_to_ghl ? "✅" : "—"}</td>
                <td className="max-w-xs truncate p-3 text-brand-text/70">{l.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">📬 Newsletter subscribers</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-brand-light text-left text-brand-text/70">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Source</th>
              <th className="p-3">Page</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-brand-text/50">No subscribers yet — footer signup and popups feed in here.</td></tr>
            )}
            {subs.slice(0, 25).map((s) => (
              <tr key={s.id} className="border-t border-brand-ink/10">
                <td className="p-3 text-brand-text/60">{s.created_at}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.name ?? "—"}</td>
                <td className="p-3">{s.source ?? "—"}</td>
                <td className="p-3 text-brand-text/60">{s.page_path ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">CMS — Content inventory</h2>
      <p className="mt-1 text-sm text-brand-text/60">
        Content lives as files in <code>content/</code>. Posts can be created/updated via{" "}
        <code>POST /api/agent/content</code> (x-api-key). Schema, sitemap, llms.txt, RSS and
        markdown mirrors regenerate automatically.
      </p>
      <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        {posts.map((p) => (
          <div key={p.slug} className="rounded-xl border border-brand-ink/10 bg-white shadow-sm p-3">
            <a href={`/${p.slug}`} className="font-semibold text-brand-accent hover:underline">/{p.slug}</a>
            <p className="text-brand-text/60">post · {p.date}{p.updated ? ` · updated ${p.updated}` : ""}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-bold">Agentic pipeline — Event log</h2>
      <div className="mt-4 grid gap-1 text-sm">
        {events.length === 0 && <p className="text-brand-text/50">No events yet.</p>}
        {events.map((e, i) => (
          <p key={i} className="text-brand-text/70">
            <span className="text-brand-text/40">{e.created_at}</span>{" "}
            <span className="font-semibold text-brand-accent">{e.type}</span>{" "}
            <span className="text-brand-text/50">by {e.actor}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
