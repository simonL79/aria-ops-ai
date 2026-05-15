import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/seo/SEO";

interface TrackerRun {
  stamp: string;
  trigger: string | null;
  results: Record<string, { pageRank: number | null; imageRank: number | null; heroLive: boolean }>;
}
interface TrackerHistory {
  generatedAt: string;
  queries: string[];
  runs: TrackerRun[];
}
interface SitemapRow {
  loc: string;
  status: number | null;
  contentType: string;
  ok: boolean;
  error?: string;
}

const REPO_ACTIONS_URL =
  "https://github.com/lovable-dev-internal/aria-ops/actions"; // generic Actions link
const WORKFLOWS = [
  { name: "Image sitemap audit", file: "image-sitemap-audit.yml" },
  { name: "Post-publish SEO checks", file: "post-publish-seo-checks.yml" },
  { name: "Post-deploy Google Images tracker", file: "post-deploy-tracker.yml" },
  { name: "JSON-LD ImageObject check", file: "jsonld-image-check.yml" },
  { name: "OG render test", file: "og-render-test.yml" },
];

async function liveSitemapAudit(): Promise<SitemapRow[]> {
  const res = await fetch("/image-sitemap.xml", { cache: "no-store" });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  const locs: string[] = [];
  const re = /<image:loc>([^<]+)<\/image:loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) locs.push(m[1].trim());

  return Promise.all(
    locs.map(async (loc) => {
      try {
        const u = new URL(loc);
        // Hit same-origin path so the browser doesn't CORS us.
        const head = await fetch(u.pathname, { method: "HEAD", cache: "no-store" });
        const contentType = head.headers.get("content-type") ?? "";
        const ok = head.ok && /^image\/jpe?g\b/i.test(contentType);
        return { loc, status: head.status, contentType, ok };
      } catch (e) {
        return { loc, status: null, contentType: "", ok: false, error: (e as Error).message };
      }
    }),
  );
}

export default function SeoStatusPage() {
  const [history, setHistory] = useState<TrackerHistory | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [sitemap, setSitemap] = useState<SitemapRow[] | null>(null);
  const [sitemapError, setSitemapError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/seo-status/tracker-history.json", { cache: "no-store" });
        if (!r.ok) throw new Error(`tracker-history.json ${r.status}`);
        setHistory(await r.json());
      } catch (e) {
        setHistoryError((e as Error).message);
      }
      try {
        setSitemap(await liveSitemapAudit());
      } catch (e) {
        setSitemapError((e as Error).message);
      }
      setLoading(false);
    })();
  }, []);

  const latestRun = history?.runs.at(-1);
  const totalQueries = history?.queries.length ?? 0;
  const liveCount = useMemo(() => {
    if (!latestRun) return 0;
    return Object.values(latestRun.results).filter((r) => r.heroLive).length;
  }, [latestRun]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="SEO status — A.R.I.A"
        description="Internal SEO automation status: sitemap audit, OG/JSON-LD CI, Google Images tracker history."
        path="/admin/seo-status"
        noIndex
      />

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">SEO automation</p>
          <h1 className="mt-2 text-4xl font-bold">Status dashboard</h1>
          <p className="mt-3 text-muted-foreground">
            Live sitemap audit · most recent CI checks · Google Images tracker trajectory.
          </p>
        </header>

        {/* TOP-LINE METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            label="Sitemap images OK"
            value={sitemap ? `${sitemap.filter((r) => r.ok).length}/${sitemap.length}` : "…"}
            ok={!!sitemap && sitemap.every((r) => r.ok)}
          />
          <MetricCard
            label="Hero live in Google Images"
            value={`${liveCount}/${totalQueries}`}
            ok={liveCount > 0 && liveCount === totalQueries}
          />
          <MetricCard
            label="Tracker snapshots"
            value={String(history?.runs.length ?? 0)}
            ok={(history?.runs.length ?? 0) > 0}
          />
        </section>

        {/* SITEMAP AUDIT */}
        <Section title="Image sitemap audit (live)">
          {sitemapError ? (
            <p className="text-destructive">{sitemapError}</p>
          ) : !sitemap ? (
            <p className="text-muted-foreground">Probing /og/*.jpg…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">URL</th>
                    <th>Status</th>
                    <th>Content-Type</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {sitemap.map((r) => (
                    <tr key={r.loc} className="border-t border-border/40">
                      <td className="py-2 font-mono text-xs">{new URL(r.loc).pathname}</td>
                      <td>{r.status ?? "—"}</td>
                      <td className="font-mono text-xs">{r.contentType || "—"}</td>
                      <td>{r.ok ? <span className="text-accent">✓ OK</span> : <span className="text-destructive">✗ {r.error ?? "fail"}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* CI WORKFLOWS */}
        <Section
          title="Rendered OG + JSON-LD CI"
          subtitle="Automated Playwright validators run on every SEO push and post-publish."
        >
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WORKFLOWS.map((w) => (
              <li
                key={w.file}
                className="rounded-lg border border-border/60 bg-card/40 px-4 py-3 backdrop-blur"
              >
                <p className="font-medium">{w.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{w.file}</p>
                <a
                  href={`${REPO_ACTIONS_URL}/workflows/${w.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs text-accent hover:underline"
                >
                  View latest runs ↗
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* TRACKER HISTORY */}
        <Section
          title="Google Images tracker — heroLive over time"
          subtitle={
            history
              ? `Generated ${new Date(history.generatedAt).toLocaleString()} · ${history.runs.length} snapshots`
              : ""
          }
        >
          {historyError ? (
            <p className="text-destructive">
              {historyError}. The first snapshot will appear after the next post-deploy run.
            </p>
          ) : !history || history.runs.length === 0 ? (
            <p className="text-muted-foreground">No tracker snapshots yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4">Run</th>
                    {history.queries.map((q) => (
                      <th key={q} className="px-2 text-xs">{q}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...history.runs].reverse().map((run) => (
                    <tr key={run.stamp} className="border-t border-border/40">
                      <td className="py-2 pr-4">
                        <div className="font-mono text-xs">{new Date(run.stamp).toLocaleString()}</div>
                        {run.trigger && <div className="text-xs text-muted-foreground">{run.trigger}</div>}
                      </td>
                      {history.queries.map((q) => {
                        const cell = run.results[q];
                        if (!cell) return <td key={q} className="px-2 text-muted-foreground">—</td>;
                        return (
                          <td key={q} className="px-2">
                            {cell.heroLive ? (
                              <span className="text-accent">✓ #{cell.imageRank}</span>
                            ) : (
                              <span className="text-muted-foreground">no</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
      </main>
    </div>
  );
}

function MetricCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${ok ? "text-accent" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
