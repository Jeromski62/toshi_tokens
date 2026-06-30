#!/usr/bin/env node

// Blocks any file write that contains hardcoded color or dimension values.
// Hardcoded values break the token architecture — everything must reference a token.

import fs from "fs";

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);

const relevantPaths = ["tokens/", "components/", "harness/"];
if (!relevantPaths.some((p) => filePath.includes(p))) process.exit(0);

const content = fs.readFileSync(filePath, "utf-8");

const violations = [];

const hexPattern = /#([0-9A-Fa-f]{3,8})\b/g;
const rawDimensionPattern = /:\s*\d+(\.\d+)?(px|rem|em|%|vw|vh)\b/g;

let match;
while ((match = hexPattern.exec(content)) !== null) {
  violations.push(`Hardcoded hex value found: ${match[0]}`);
}

while ((match = rawDimensionPattern.exec(content)) !== null) {
  if (!content.slice(Math.max(0, match.index - 20), match.index).includes("{")) {
    violations.push(`Hardcoded dimension value found: ${match[0].trim()}`);
  }
}

if (violations.length > 0) {
  console.error("HOOK FAIL — No-Hardcode-Check");
  console.error(`File: ${filePath}`);
  console.error("Violations:");
  violations.forEach((v) => console.error(`  ❌ ${v}`));
  console.error("\nAll values must reference a token. Use {token.path} syntax.");
  process.exit(1);
}

console.log("HOOK PASS — No-Hardcode-Check");
process.exit(0);
