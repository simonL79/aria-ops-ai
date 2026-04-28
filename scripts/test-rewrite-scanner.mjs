#!/usr/bin/env node
/**
 * Unit tests for the link classifier and rewrite logic in
 * scripts/rewrite-broken-links.mjs.
 *
 * These tests exercise tricky cases the regex-based scanner must handle
 * correctly — most importantly, NEVER rewriting external URLs, mailto/tel
 * schemes, protocol-relative URLs, or template-literal interpolations.
 *
 * Run: node scripts/test-rewrite-scanner.mjs
 */
import { writeFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REWRITER = join(__dirname, "rewrite-broken-links.mjs");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// ---------- fixtures ----------
// Each fixture is a single-file scenario. We assert which links are rewritten,
// which are skipped as external, and which are left untouched (dynamic/safe).
const FIXTURES = [
  {
    name: "External URLs are never rewritten",
    file: "External.tsx",
    input: `
      export const x = (
        <>
          <a href="https://example.com/dashboard">site</a>
          <a href="http://example.com/clients">site</a>
          <a href="mailto:hello@example.com?subject=/dashboard">email</a>
          <a href="tel:+15551234567">phone</a>
          <a href="sms:+15551234567">sms</a>
          <a href="ftp://files.example.com/dashboard">ftp</a>
          <a href="ws://socket.example.com/clients">ws</a>
          <a href="data:text/plain;base64,SGVsbG8=">data</a>
          <a href="blob:https://example.com/abc-123">blob</a>
          <a href="javascript:void(0)">js</a>
          <a href="//cdn.example.com/dashboard">protocol-relative</a>
        </>
      );
    `,
    expectUnchanged: true,
    expectSkippedExternal: 11,
  },
  {
    name: "Template literals with interpolation are never rewritten",
    file: "TemplateLiteral.tsx",
    input: [
      "const id = '42';",
      "export const a = <a href={`/dashboard/${id}`}>x</a>;",
      "export const b = <Link to={`/clients/${id}/edit`}>y</Link>;",
      "navigate(`/dashboard/${id}`);",
    ].join("\n"),
    expectUnchanged: true,
  },
  {
    name: "Hash-only and query-only links are never rewritten",
    file: "HashQuery.tsx",
    input: `
      <a href="#section">anchor</a>
      <Link to="#top">top</Link>
      <a href="?utm_source=x">query-only</a>
    `,
    expectUnchanged: true,
  },
  {
    name: "Relative paths are never rewritten",
    file: "Relative.tsx",
    input: `
      <a href="../dashboard">rel</a>
      <a href="./clients">rel</a>
      <a href="dashboard">bare</a>
    `,
    expectUnchanged: true,
  },
  {
    name: "Dynamic route segments resolve via param matchers",
    file: "Dynamic.tsx",
    input: `
      <Link to="/blog/some-post-slug">post</Link>
      <Link to="/admin/shield/alerts/abc-123">alert</Link>
    `,
    // /blog/:slug and /admin/shield/alerts/:id are registered → not broken,
    // not rewritten. File must be unchanged.
    expectUnchanged: true,
  },
  {
    name: "JSX prop variants: braces, backticks, single+double quotes",
    file: "JsxVariants.tsx",
    input: [
      `<Link to="/dashboard">A</Link>`,                  // string literal → rewrite
      `<Link to='/clients'>B</Link>`,                    // single quotes → rewrite
      `<Link to={"/settings"}>C</Link>`,                 // braced string → rewrite
      "<Link to={`/notifications`}>D</Link>",            // backtick no-interp → rewrite
      `<NavLink to="/dashboard" end>E</NavLink>`,        // extra props after → rewrite
      `<Navigate to="/clients" replace />`,              // <Navigate /> → rewrite
    ].join("\n"),
    expectRewriteCount: 6,
  },
  {
    name: "navigate() and href= rewrites with query/hash preserved",
    file: "QueryHash.tsx",
    input: [
      `navigate("/dashboard?tab=overview");`,
      `navigate('/clients#list');`,
      `<a href="/settings?x=1&y=2#anchor">z</a>`,
    ].join("\n"),
    expectRewriteCount: 3,
    expectContains: [
      "/admin?tab=overview",
      "/admin/clients#list",
      "/admin/settings?x=1&y=2#anchor",
    ],
  },
  {
    name: "Mixed file: external preserved, internal rewritten, dynamic untouched",
    file: "Mixed.tsx",
    input: [
      `<a href="https://docs.example.com/dashboard">docs</a>`,  // external
      `<a href="mailto:x@example.com">mail</a>`,                 // external
      `<Link to="/dashboard">admin</Link>`,                      // rewrite
      "<Link to={`/blog/${slug}`}>post</Link>",                  // dynamic, skip
      `<Link to="/blog/static-slug">static</Link>`,              // matches /blog/:slug
    ].join("\n"),
    expectRewriteCount: 1,
    expectSkippedExternal: 2,
    expectContains: [
      `https://docs.example.com/dashboard`, // unchanged
      `mailto:x@example.com`,               // unchanged
      `to="/admin"`,                        // rewritten
      "`/blog/${slug}`",                    // unchanged
      `to="/blog/static-slug"`,             // unchanged
    ],
  },
];

// ---------- runner ----------
// We run the real rewriter against a temporary src tree per fixture so the
// behaviour we test is exactly the production behaviour. To do this without
// touching the real codebase, we copy the rewriter into a scratch project
// directory containing a minimal src/App.tsx + src/nav-items.tsx that
// register the routes the fixtures need, plus the support JSON files.

const REGISTERED_ROUTES_APP = `
import React from "react";
import { Routes, Route } from "react-router-dom";
const Stub = () => null;
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Stub />} />
      <Route path="/admin" element={<Stub />} />
      <Route path="/admin/clients" element={<Stub />} />
      <Route path="/admin/settings" element={<Stub />} />
      <Route path="/admin/notifications" element={<Stub />} />
      <Route path="/admin/shield/alerts/:id" element={<Stub />} />
      <Route path="/blog/:slug" element={<Stub />} />
      <Route path="/contact" element={<Stub />} />
    </Routes>
  );
}
`;
const NAV_ITEMS = `export const navItems = [];`;

const ALLOWLIST = {
  ignoredLinkPaths: ["^/$", "^/#", "^#"],
  ignoredOrphanPages: [],
};
const CANONICAL = {
  rewrites: {
    "/dashboard": "/admin",
    "/dashboard/*": "/admin/*",
    "/clients": "/admin/clients",
    "/settings": "/admin/settings",
    "/notifications": "/admin/notifications",
  },
};

function setupScratch() {
  const dir = mkdtempSync(join(tmpdir(), "rewrite-test-"));
  mkdirSync(join(dir, "src"), { recursive: true });
  mkdirSync(join(dir, "scripts"), { recursive: true });
  writeFileSync(join(dir, "src/App.tsx"), REGISTERED_ROUTES_APP);
  writeFileSync(join(dir, "src/nav-items.tsx"), NAV_ITEMS);
  writeFileSync(
    join(dir, "scripts/route-integrity.allowlist.json"),
    JSON.stringify(ALLOWLIST, null, 2)
  );
  writeFileSync(
    join(dir, "scripts/route-canonical-map.json"),
    JSON.stringify(CANONICAL, null, 2)
  );
  // Copy the real rewriter so tests run the exact production code.
  const rewriter = readFileSync(REWRITER, "utf8");
  writeFileSync(join(dir, "scripts/rewrite-broken-links.mjs"), rewriter);
  return dir;
}

function runFixture(fixture) {
  const dir = setupScratch();
  const fixturePath = join(dir, "src", fixture.file);
  writeFileSync(fixturePath, fixture.input);

  const result = spawnSync(
    "node",
    [join(dir, "scripts/rewrite-broken-links.mjs")],
    { encoding: "utf8" }
  );

  const after = readFileSync(fixturePath, "utf8");
  const reportPath = join(dir, "reports/route-rewrite.json");
  let report = null;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    /* no report — likely a crash */
  }

  rmSync(dir, { recursive: true, force: true });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status, after, report };
}

// ---------- assertions ----------
const failures = [];
let passCount = 0;

for (const fixture of FIXTURES) {
  const { after, report } = runFixture(fixture);
  const errors = [];

  if (!report) {
    errors.push("rewriter did not produce a JSON report");
  } else {
    if (fixture.expectUnchanged && after !== fixture.input) {
      errors.push(
        `expected file UNCHANGED, but it was rewritten:\n--- before ---\n${fixture.input}\n--- after ---\n${after}`
      );
    }
    if (typeof fixture.expectRewriteCount === "number" && report.summary.rewritten !== fixture.expectRewriteCount) {
      errors.push(
        `expected ${fixture.expectRewriteCount} rewrite(s), got ${report.summary.rewritten}. Items: ${JSON.stringify(report.rewritten.items)}`
      );
    }
    if (typeof fixture.expectSkippedExternal === "number" && report.summary.skippedExternal !== fixture.expectSkippedExternal) {
      errors.push(
        `expected ${fixture.expectSkippedExternal} skipped external link(s), got ${report.summary.skippedExternal}. Items: ${JSON.stringify(report.skippedExternal.items)}`
      );
    }
    // Hard guarantee: NEVER rewrite external schemes, no matter the fixture.
    const externalRewrites = (report.rewritten.items || []).filter((r) =>
      /^[a-z][a-z0-9+.-]*:/i.test(r.from) || r.from.startsWith("//")
    );
    if (externalRewrites.length > 0) {
      errors.push(
        `external URL was rewritten — invariant violated: ${JSON.stringify(externalRewrites)}`
      );
    }
    for (const needle of fixture.expectContains ?? []) {
      if (!after.includes(needle)) {
        errors.push(`expected output to contain ${JSON.stringify(needle)}\n--- got ---\n${after}`);
      }
    }
  }

  if (errors.length === 0) {
    passCount++;
    console.log(`${GREEN}✓${RESET} ${fixture.name}`);
  } else {
    failures.push({ name: fixture.name, errors });
    console.log(`${RED}✗${RESET} ${fixture.name}`);
    for (const e of errors) console.log(`    ${DIM}${e}${RESET}`);
  }
}

console.log(`\n${passCount}/${FIXTURES.length} passed`);
if (failures.length) {
  console.log(`${RED}${failures.length} test(s) failed.${RESET}`);
  process.exit(1);
}
console.log(`${GREEN}All rewrite-scanner tests passed.${RESET}`);
