#!/usr/bin/env node

// Runs before a component file is written.
// Checks that all token references in the file exist in the alias layer.

import fs from "fs";
import path from "path";

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);
if (!filePath.includes("components/")) process.exit(0);

const content = process.env.CLAUDE_TOOL_INPUT_CONTENT || fs.readFileSync(filePath, "utf-8");

// Extract all token references: {alias.color.button.primary.background}
const tokenRefPattern = /\{(alias\.[^}]+)\}/g;
const referencedTokens = [];
let match;
while ((match = tokenRefPattern.exec(content)) !== null) {
  referencedTokens.push(match[1]);
}

if (referencedTokens.length === 0) process.exit(0);

// Load context layer to verify tokens exist
const contextPath = path.resolve("context/tokens.json");
if (!fs.existsSync(contextPath)) {
  console.warn("HOOK WARN — Token-Existence-Check: context/tokens.json not found. Run Context Agent first.");
  process.exit(0);
}

const context = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
const knownTokens = new Set(Object.keys(context));

const missing = referencedTokens.filter((t) => !knownTokens.has(t));

if (missing.length > 0) {
  console.error("HOOK FAIL — Token-Existence-Check");
  console.error(`File: ${filePath}`);
  console.error("Missing tokens:");
  missing.forEach((t) => console.error(`  ❌ ${t} — does not exist in alias layer`));
  console.error("\nRun Token Agent to create missing tokens before building this component.");
  process.exit(1);
}

console.log("HOOK PASS — Token-Existence-Check");
process.exit(0);
