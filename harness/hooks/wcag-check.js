#!/usr/bin/env node

// Checks WCAG 2 AA contrast ratios after a component file is written.
// Text: min 4.5:1 | UI elements and focus indicators: min 3:1

import fs from "fs";
import path from "path";

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);
if (!filePath.includes("components/")) process.exit(0);

// Load context to resolve token values
const contextPath = path.resolve("context/tokens.json");
if (!fs.existsSync(contextPath)) {
  console.warn("HOOK WARN — WCAG-Check: context/tokens.json not found. Run Context Agent first.");
  process.exit(0);
}

const tokens = JSON.parse(fs.readFileSync(contextPath, "utf-8"));

// Resolve a token reference to its hex value
function resolveToken(tokenName) {
  return tokens[tokenName]?.value || null;
}

// Calculate relative luminance from hex
function hexToLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = hexToLuminance(hex1);
  const l2 = hexToLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Extract color token pairs from component file
// Looks for comments like: // wcag-pair: foreground=alias.color.button.primary.label background=alias.color.button.primary.background type=text
const content = fs.readFileSync(filePath, "utf-8");
const pairPattern = /\/\/\s*wcag-pair:\s*foreground=([\w.]+)\s+background=([\w.]+)\s+type=(text|ui)/g;

const violations = [];
let match;
let pairsChecked = 0;

while ((match = pairPattern.exec(content)) !== null) {
  const [, fgToken, bgToken, type] = match;
  const fgHex = resolveToken(fgToken);
  const bgHex = resolveToken(bgToken);

  if (!fgHex || !bgHex) {
    violations.push(`Cannot resolve tokens: ${fgToken} or ${bgToken}`);
    continue;
  }

  const ratio = contrastRatio(fgHex, bgHex);
  const required = type === "text" ? 4.5 : 3.0;
  pairsChecked++;

  if (ratio < required) {
    violations.push(
      `❌ ${fgToken} on ${bgToken}: ${ratio.toFixed(2)}:1 (required ${required}:1 for ${type})`
    );
  }
}

if (pairsChecked === 0) {
  console.warn("HOOK WARN — WCAG-Check: No wcag-pair comments found in component.");
  console.warn("Add // wcag-pair: foreground=<token> background=<token> type=text|ui comments to enable contrast checking.");
  process.exit(0);
}

if (violations.length > 0) {
  console.error("HOOK FAIL — WCAG-Check");
  console.error(`File: ${filePath}`);
  console.error("Contrast violations:");
  violations.forEach((v) => console.error(`  ${v}`));
  console.error("\nAdjust token values to meet WCAG 2 AA requirements before accepting this component.");
  process.exit(1);
}

console.log(`HOOK PASS — WCAG-Check (${pairsChecked} pair(s) checked, all pass)`);
process.exit(0);
