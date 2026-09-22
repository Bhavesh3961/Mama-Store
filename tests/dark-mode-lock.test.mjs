import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("ANTI-DARK-MODE: globals.css strictly enforces light mode and neutralizes dark mode", () => {
  const css = fs.readFileSync(path.resolve("src/app/globals.css"), "utf-8");

  // Verify color-scheme is light and forced-color-adjust is none
  assert.ok(
    css.includes("color-scheme: light !important;"),
    "globals.css must specify 'color-scheme: light !important;'"
  );
  assert.ok(
    css.includes("forced-color-adjust: none !important;"),
    "globals.css must specify 'forced-color-adjust: none !important;'"
  );

  // Verify prefers-color-scheme: dark media query is locked to light
  assert.ok(
    css.includes("@media (prefers-color-scheme: dark)"),
    "globals.css must handle and lock @media (prefers-color-scheme: dark)"
  );

  // Verify dark class and dark attribute selectors are locked to light styling
  assert.ok(
    css.includes("html.dark") || css.includes(".dark"),
    "globals.css must lock .dark class"
  );
  assert.ok(
    css.includes('[data-theme="dark"]'),
    "globals.css must lock [data-theme=\"dark\"] attribute"
  );
});

test("ANTI-DARK-MODE: layout.tsx configures viewport, meta tags and AntiDarkModeGuardian", () => {
  const layout = fs.readFileSync(path.resolve("src/app/layout.tsx"), "utf-8");

  assert.ok(
    layout.includes('colorScheme: "light"'),
    "layout.tsx must configure colorScheme: 'light' in viewport"
  );
  assert.ok(
    layout.includes('name="darkreader-lock"'),
    "layout.tsx must configure darkreader-lock meta tag"
  );
  assert.ok(
    layout.includes('data-theme="light"'),
    "layout.tsx must enforce data-theme='light' on html"
  );
  assert.ok(
    layout.includes("<AntiDarkModeGuardian />"),
    "layout.tsx must mount <AntiDarkModeGuardian /> component"
  );
});

test("ANTI-DARK-MODE: AntiDarkModeGuardian component exists and implements observer", () => {
  const guardian = fs.readFileSync(
    path.resolve("src/components/common/AntiDarkModeGuardian.tsx"),
    "utf-8"
  );

  assert.ok(
    guardian.includes("MutationObserver"),
    "AntiDarkModeGuardian must utilize MutationObserver to prevent DOM tampering"
  );
  assert.ok(
    guardian.includes("enforceLightMode"),
    "AntiDarkModeGuardian must have enforcement logic"
  );
  assert.ok(
    guardian.includes("color-scheme"),
    "AntiDarkModeGuardian must enforce color-scheme property"
  );
});
