import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "@/components/seo/SEO";

/**
 * Asserts the /crisis-reputation-management route emits the expected SEO head
 * tags (title, meta description, canonical, OpenGraph, Twitter card).
 *
 * The SEO component is the single source of head tags for the page. We render it
 * with the exact config values used by CrisisReputationManagementPage.tsx and
 * verify react-helmet-async writes them to document.head. The static string
 * assertions below also guard the page config against silent drift.
 */

const SITE_URL = "https://www.ariaops.co.uk";
const PATH = "/crisis-reputation-management";
const TITLE = "Crisis PR & Reputation Management | 24/7 | A.R.I.A™";
const DESCRIPTION =
  "24/7 operator-led crisis PR & reputation management. Live response across press, Google, AI search, social & legal for founders, executives & brands.";
const IMAGE = "/assets/og/crisis-reputation-management.png"; // root-relative -> absolutized by SEO

afterEach(cleanup);

function meta(selector: string): string | null {
  return document.head.querySelector(selector)?.getAttribute("content") ?? null;
}

describe("/crisis-reputation-management SEO meta", () => {
  it("emits title, description, canonical, OpenGraph and Twitter tags", async () => {
    render(
      <HelmetProvider>
        <SEO
          title={TITLE}
          description={DESCRIPTION}
          path={PATH}
          image={IMAGE}
          imageWidth={1200}
          imageHeight={630}
          imageType="image/png"
        />
      </HelmetProvider>,
    );

    const url = `${SITE_URL}${PATH}`;
    const absImage = `${SITE_URL}${IMAGE}`;

    await waitFor(() => {
      expect(document.title).toBe(TITLE);
    });

    // Core
    expect(meta('meta[name="description"]')).toBe(DESCRIPTION);
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe(url);

    // OpenGraph
    expect(meta('meta[property="og:title"]')).toBe(TITLE);
    expect(meta('meta[property="og:description"]')).toBe(DESCRIPTION);
    expect(meta('meta[property="og:url"]')).toBe(url);
    expect(meta('meta[property="og:type"]')).toBe("website");
    expect(meta('meta[property="og:image"]')).toBe(absImage);
    expect(meta('meta[property="og:image:width"]')).toBe("1200");
    expect(meta('meta[property="og:image:height"]')).toBe("630");
    expect(meta('meta[property="og:image:type"]')).toBe("image/png");

    // Twitter
    expect(meta('meta[name="twitter:card"]')).toBe("summary_large_image");
    expect(meta('meta[name="twitter:title"]')).toBe(TITLE);
    expect(meta('meta[name="twitter:description"]')).toBe(DESCRIPTION);
    expect(meta('meta[name="twitter:image"]')).toBe(absImage);
  });

  it("keeps the page config values in sync with this test", () => {
    // Guard against silent drift in the page config the SEO tags derive from.
    const cfg = readCrisisConfig();
    expect(cfg).toContain(`path: '${PATH}'`);
    expect(cfg).toContain(`title: '${TITLE}'`);
    expect(cfg).toContain(DESCRIPTION);
    expect(cfg).toMatch(/imageWidth:\s*1200/);
    expect(cfg).toMatch(/imageHeight:\s*630/);
    expect(cfg).toMatch(/imageType:\s*'image\/png'/);
  });
});

function readCrisisConfig(): string {
  // Lazy require to keep node fs out of the jsdom render path above.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFileSync } = require("node:fs");
  const { resolve } = require("node:path");
  return readFileSync(
    resolve(__dirname, "..", "pages/stealth/CrisisReputationManagementPage.tsx"),
    "utf8",
  );
}
