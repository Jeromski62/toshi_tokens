#!/usr/bin/env node

// Checks that every documented component state has a corresponding Storybook story.
// Runs after a story file is written.

import fs from "fs";
import path from "path";

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);
if (!filePath.includes("stories/") && !filePath.includes(".stories.")) process.exit(0);

// Extract component name from file path
const fileName = path.basename(filePath, ".stories.ts");

// Load context to get documented states for this component
const contextPath = path.resolve("context/components.json");
if (!fs.existsSync(contextPath)) {
  console.warn("HOOK WARN — Storybook-Completeness-Check: context/components.json not found.");
  process.exit(0);
}

const components = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
const componentKey = fileName.toLowerCase();
const component = components[componentKey];

if (!component) {
  console.warn(`HOOK WARN — Storybook-Completeness-Check: No context entry found for "${fileName}". Run Context Agent first.`);
  process.exit(0);
}

const documentedStates = component.states || [];

// Extract exported story names from the file
const content = fs.readFileSync(filePath, "utf-8");
const exportPattern = /^export\s+const\s+(\w+)\s*=/gm;
const storyNames = [];
let match;
while ((match = exportPattern.exec(content)) !== null) {
  if (match[1] !== "default") storyNames.push(match[1].toLowerCase());
}

// Check each documented state has a story
const missing = documentedStates.filter(
  (state) => !storyNames.some((s) => s.includes(state.toLowerCase()))
);

if (missing.length > 0) {
  console.error("HOOK FAIL — Storybook-Completeness-Check");
  console.error(`Component: ${fileName}`);
  console.error("Missing stories for documented states:");
  missing.forEach((s) => console.error(`  ❌ ${s}`));
  console.error("\nAdd a story for each missing state before accepting this documentation.");
  process.exit(1);
}

console.log(`HOOK PASS — Storybook-Completeness-Check (${storyNames.length} stories cover all ${documentedStates.length} states)`);
process.exit(0);
