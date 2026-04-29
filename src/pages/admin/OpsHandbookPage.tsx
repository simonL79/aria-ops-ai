import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Vite raw import — keeps the markdown file as the single source of truth.
// eslint-disable-next-line import/no-unresolved
import handbook from '../../../docs/OPS.md?raw';

interface Section {
  id: string;
  title: string;
  body: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

function parseSections(md: string): Section[] {
  const lines = md.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) sections.push(current);
      const title = m[1];
      current = { id: slugify(title), title, body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

const OpsHandbookPage = () => {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => parseSections(handbook), []);
  const filtered = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q),
    );
  }, [sections, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Ops Handbook</h1>
              <p className="text-sm text-muted-foreground">
                Single source of truth for running A.R.I.A SIGMA day-to-day.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">v1</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Left nav (sticky) */}
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Card className="p-2 max-h-[70vh] overflow-y-auto">
                <nav aria-label="Handbook sections" className="text-sm">
                  <ul className="space-y-1">
                    {sections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="block rounded px-2 py-1 hover:bg-muted transition-colors"
                        >
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Card>
            </div>
          </aside>

          {/* Mobile search */}
          <div className="lg:hidden print:hidden">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search the handbook…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Body */}
          <main>
            <Card className="p-6 md:p-8 print:shadow-none print:border-0">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground">
                  No sections match "{query}".
                </p>
              ) : (
                <article
                  className="prose prose-invert max-w-none
                    prose-headings:scroll-mt-24
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-a:text-primary
                    prose-table:text-sm
                    prose-pre:bg-muted/40 prose-pre:text-foreground
                    prose-code:before:content-none prose-code:after:content-none
                    print:prose-invert-0"
                >
                  {filtered.map((s) => (
                    <section key={s.id} id={s.id}>
                      <h2>{s.title}</h2>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {s.body}
                      </ReactMarkdown>
                    </section>
                  ))}
                </article>
              )}
            </Card>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OpsHandbookPage;
