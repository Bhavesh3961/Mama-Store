import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("MAMA STORE has a custom accessible SVG identity", async () => {
  const logo = await readFile(new URL("../src/components/brand/MamaLogo.tsx", import.meta.url), "utf8");
  assert.match(logo, /<svg/);
  assert.match(logo, /aria-label=.MAMA STORE/);
  assert.match(logo, /MAMA/);
});
