import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { readdirSync, statSync } from "node:fs";

const LEGAL_ROUTES = ["/terms", "/privacy-policy", "/disclaimer"] as const;
const SRC_DIR = resolve(__dirname, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "test" || entry === "__tests__" || entry === "node_modules") continue;
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry) && !/\.(test|spec)\./.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const ALL_SOURCE_FILES = walk(SRC_DIR);

describe("legal cross-links use React Router <Link>, never plain <a>", () => {
  for (const route of LEGAL_ROUTES) {
    it(`no <a href="${route}"> anchor exists in source`, () => {
      const offenders: string[] = [];
      // Match <a ... href="<route>" ...> with optional whitespace/attrs
      const re = new RegExp(`<a\\b[^>]*\\bhref\\s*=\\s*["'\\\`]${route}(?:[/?#"\\\`'][^"'\\\`]*)?["'\\\`]`, "i");
      for (const file of ALL_SOURCE_FILES) {
        const content = readFileSync(file, "utf8");
        if (re.test(content)) offenders.push(file);
      }
      expect(offenders, `Found plain <a href="${route}"> in: ${offenders.join(", ")}`).toEqual([]);
    });

    it(`at least one <Link to="${route}"> exists in source`, () => {
      const re = new RegExp(`<Link\\b[^>]*\\bto\\s*=\\s*["'\\\`]${route}["'\\\`]`);
      const hits = ALL_SOURCE_FILES.filter((f) => re.test(readFileSync(f, "utf8")));
      expect(hits.length, `Expected at least one <Link to="${route}">`).toBeGreaterThan(0);
    });
  }
});
