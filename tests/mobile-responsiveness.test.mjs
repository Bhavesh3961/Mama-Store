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
});
