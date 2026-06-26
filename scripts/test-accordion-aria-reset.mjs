#!/usr/bin/env node
/**
 * Playwright regression test: footer accordion ARIA reset on navigation.
 *
 * The footer accordion (src/components/layout/Footer.tsx) is keyed on the
 * current pathname so it fully remounts on every route change. This test
 * guards that behaviour by asserting that, after opening an accordion section
 * and then navigating to a new route, every accordion trigger resets to
 * `aria-expanded="false"` and its `aria-controls` panel is collapsed.
 *
 * Usage:
 *   node scripts/test-accordion-aria-reset.mjs
 *   BASE_URL=http://localhost:8080 node scripts/test-accordion-aria-reset.mjs
 *
 * Exits non-zero on any assertion failure — drop-in for CI.
 */

import { chromium } from 'playwright';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

const TRIGGER_SEL = 'footer [data-radix-collection-item], footer button[aria-controls]';

/** Collect aria-expanded / aria-controls state for every footer accordion trigger. */
async function readTriggerState(page) {
  return page.evaluate(() => {
    const triggers = Array.from(
      document.querySelectorAll('footer button[aria-controls]'),
    );
    return triggers.map((t) => {
      const controls = t.getAttribute('aria-controls');
      const panel = controls ? document.getElementById(controls) : null;
      return {
        label: (t.textContent || '').trim(),
        expanded: t.getAttribute('aria-expanded'),
        controls,
        panelExists: !!panel,
        panelHidden: panel ? panel.hasAttribute('hidden') || panel.getAttribute('data-state') === 'closed' : true,
      };
    });
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
const page = await context.newPage();

let failures = 0;
const log = [];

try {
  // 1. Land on home and scroll the footer into view.
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForSelector('footer button[aria-controls]', { timeout: 15_000 });

  // 2. All triggers should start collapsed.
  let state = await readTriggerState(page);
  assert(state.length > 0, 'No footer accordion triggers found');
  for (const t of state) {
    assert(t.expanded === 'false', `Initial state: "${t.label}" expected aria-expanded=false, got ${t.expanded}`);
    assert(t.panelHidden, `Initial state: "${t.label}" panel should be collapsed`);
  }
  log.push(`✓ ${state.length} triggers start collapsed`);

  // 3. Open the first accordion section and confirm it expands.
  const firstTrigger = page.locator('footer button[aria-controls]').first();
  await firstTrigger.click();
  await page.waitForFunction(
    () => document.querySelector('footer button[aria-controls]')?.getAttribute('aria-expanded') === 'true',
    { timeout: 5_000 },
  );
  state = await readTriggerState(page);
  assert(state[0].expanded === 'true', `After click: first trigger expected aria-expanded=true, got ${state[0].expanded}`);
  assert(!state[0].panelHidden, 'After click: first panel should be visible');
  log.push(`✓ first section "${state[0].label}" opens (aria-expanded=true, panel visible)`);

  // 4. Navigate to another route via a footer link.
  await page.goto(`${BASE_URL}/about`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForSelector('footer button[aria-controls]', { timeout: 15_000 });

  // 5. Every trigger must have reset to collapsed with a fresh aria-controls binding.
  state = await readTriggerState(page);
  assert(state.length > 0, 'No footer accordion triggers after navigation');
  for (const t of state) {
    assert(t.expanded === 'false', `After nav: "${t.label}" expected aria-expanded=false, got ${t.expanded}`);
    assert(t.controls, `After nav: "${t.label}" missing aria-controls`);
    assert(t.panelExists, `After nav: "${t.label}" aria-controls="${t.controls}" points to no panel`);
    assert(t.panelHidden, `After nav: "${t.label}" panel should be collapsed`);
  }
  log.push(`✓ after navigation all ${state.length} triggers reset to aria-expanded=false with valid aria-controls`);
} catch (e) {
  failures += 1;
  failureMessages.push(e.message);
  log.push(`✗ ${e.message}`);
}

await browser.close();

console.log(`Accordion ARIA reset regression test against ${BASE_URL}`);
for (const line of log) console.log('  ' + line);

// Emit GitHub Actions annotations so failures surface inline on the PR.
if (process.env.GITHUB_ACTIONS === 'true') {
  for (const msg of failureMessages) {
    const clean = msg.replace(/\r?\n/g, ' ');
    console.log(
      `::error file=scripts/test-accordion-aria-reset.mjs,title=Accordion ARIA reset regression::${clean}`,
    );
  }
}

if (failures > 0) {
  console.error(`\n❌ Accordion ARIA reset test failed`);
  process.exit(1);
}
console.log(`\n✅ Footer accordion resets aria-expanded / aria-controls correctly after navigation`);
