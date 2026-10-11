import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("globals.css contains essential mobile responsiveness rules and sheets", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.sheet/);
  assert.match(css, /\.sheet-backdrop/);
  assert.match(css, /\.mobile-only/);
  assert.match(css, /\.mobile-search-btn/);
  assert.match(css, /\.pdp/);
  assert.match(css, /\.actions-stack/);
  assert.match(css, /\.cart-layout/);
  assert.match(css, /\.luxury-mobile-dock/);
  assert.match(css, /env\(safe-area-inset-bottom/);
});

test("mobile dock is centered without overflow", async () => {
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /left:\s*50%/);
  assert.match(css, /transform:\s*translateX\(-50%\)/);

  const bottomNavTsx = await readFile(new URL("../src/components/layout/BottomNav.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(bottomNavTsx, /className="[^"]*bottom-nav [^"]*"/);
  assert.match(bottomNavTsx, /className="luxury-mobile-dock"/);
});

test("layout.tsx configures mobile responsive viewport with safe area support", async () => {
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /width:\s*"device-width"/);
  assert.match(layout, /initialScale:\s*1/);
  assert.match(layout, /viewportFit:\s*"cover"/);
});

test("ticker badge is responsive on mobile screens", async () => {
  const ticker = await readFile(new URL("../src/components/home/TrendingPaliTicker.tsx", import.meta.url), "utf8");
  assert.match(ticker, /ticker-badge-text-full/);
  assert.match(ticker, /ticker-badge-text-short/);
});
