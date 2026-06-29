import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Automated verification of the AVIF/WebP -> JPEG/PNG fallback chain for every
 * image holdout that was converted to modern formats.
 *
 * A <picture> element progressively degrades: the browser walks the <source>
 * children top-to-bottom and renders the first <type> it supports. If it
 * supports none, it renders the plain <img>. Therefore a correct, resilient
 * holdout MUST emit, in this exact order:
 *
 *   1. <source type="image/avif">   (best compression, newest support)
 *   2. <source type="image/webp">   (wide modern support)
 *   3. <img src=...>                (universal raster: JPEG or PNG)
 *
 * These tests assert the markup ordering AND that the final <img> fallback is a
 * universally-supported raster (never avif/webp), guaranteeing the page still
 * shows an image on browsers that support neither modern format.
 */

const SRC = resolve(__dirname, "..");
const read = (rel: string) => readFileSync(resolve(SRC, rel), "utf8");

/** Returns the inner text of the first <picture>...</picture> block in `src`. */
function firstPicture(src: string): string {
  const m = src.match(/<picture[\s\S]*?<\/picture>/);
  if (!m) throw new Error("no <picture> element found");
  return m[0];
}

/** Asserts AVIF source precedes WebP source precedes the <img> fallback. */
function expectFallbackOrder(picture: string) {
  const avif = picture.indexOf('type="image/avif"');
  const webp = picture.indexOf('type="image/webp"');
  const img = picture.indexOf("<img");
  expect(avif, "expected an AVIF <source>").toBeGreaterThanOrEqual(0);
  expect(webp, "expected a WebP <source>").toBeGreaterThanOrEqual(0);
  expect(img, "expected an <img> fallback").toBeGreaterThanOrEqual(0);
  expect(avif).toBeLessThan(webp); // AVIF offered first
  expect(webp).toBeLessThan(img); // WebP before the universal fallback
}

/** Resolves the imagetools import statement for a given variable name. */
function importLine(src: string, varName: string): string {
  const re = new RegExp(`import\\s+${varName}\\s+from\\s+['"\`]([^'"\`]+)['"\`]`);
  const m = src.match(re);
  expect(m, `expected an import for ${varName}`).toBeTruthy();
  return m![1];
}

/** The <img src={var}> fallback must resolve to a NON avif/webp raster. */
function expectRasterFallback(src: string, picture: string) {
  const m = picture.match(/<img[\s\S]*?src=\{([A-Za-z0-9_]+)\}/);
  expect(m, "expected <img src={...}> fallback").toBeTruthy();
  const spec = importLine(src, m![1]);
  expect(spec).not.toMatch(/format=avif/);
  expect(spec).not.toMatch(/format=webp/);
  expect(spec).toMatch(/\.(jpe?g|png)/i);
  expect(spec).toMatch(/format=(jpe?g|png)|\.(jpe?g|png)(\?|$)/i);
}

// --- Simon cluster pages (7 holdouts share SimonClusterPage's <picture>) ---
const SIMON_PAGES = [
  "pages/simon-lindsay/BankruptcyPage.tsx",
  "pages/simon-lindsay/GlasgowPage.tsx",
  "pages/simon-lindsay/KSLHairComplaintsPage.tsx",
  "pages/simon-lindsay/KSLHairPage.tsx",
  "pages/simon-lindsay/KSLHairTheTruthPage.tsx",
  "pages/simon-lindsay/KSLPage.tsx",
  "pages/simon-lindsay/ReviewsPage.tsx",
];

describe("SimonClusterPage hero renders AVIF/WebP with JPEG fallback", () => {
  const src = read("components/seo/SimonClusterPage.tsx");

  it("emits AVIF -> WebP -> <img> fallback order", () => {
    expectFallbackOrder(firstPicture(src));
  });

  it("uses the JPEG/PNG prop fallback for the <img>", () => {
    const picture = firstPicture(src);
    expect(picture).toMatch(/src=\{heroFallbackUrl\}/);
  });
});

describe.each(SIMON_PAGES)("Simon holdout %s", (page) => {
  const src = read(page);

  it("imports an AVIF srcset, a WebP srcset, and a raster fallback", () => {
    expect(src).toMatch(/format=avif[^'"`]*as=srcset/);
    expect(src).toMatch(/format=webp[^'"`]*as=srcset/);
    // fallback import is a .jpg with no modern format applied
    expect(src).toMatch(/heroFallback\s+from\s+['"`][^'"`]*\.jpg(?:\?(?![^'"`]*format=(?:avif|webp))[^'"`]*)?['"`]/);
  });

  it("passes a full {avif, webp, fallback} heroImage object", () => {
    expect(src).toMatch(/heroImage=\{\{\s*avif:[\s\S]*?webp:[\s\S]*?fallback:[\s\S]*?\}\}/);
  });
});

// --- Inline <picture> holdouts ---
describe("BiographyPage portrait fallback chain", () => {
  const src = read("pages/BiographyPage.tsx");
  const picture = firstPicture(src);

  it("emits AVIF -> WebP -> <img> fallback order", () => {
    expectFallbackOrder(picture);
  });

  it("falls back to a universal raster (no avif/webp on the <img>)", () => {
    expectRasterFallback(src, picture);
  });
});

describe("BlogPostPage default hero fallback chain", () => {
  const src = read("pages/BlogPostPage.tsx");
  const picture = firstPicture(src);

  it("emits AVIF -> WebP -> <img> fallback order", () => {
    expectFallbackOrder(picture);
  });

  it("falls back to the branded JPEG default (no avif/webp on the <img>)", () => {
    expectRasterFallback(src, picture);
  });
});
