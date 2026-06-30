#!/usr/bin/env node

// Blocks alias token rename or deletion without an explicit migration order.
// Renaming or deleting an alias token breaks all consumers: Figma, PrimeNG, Storybook.

import fs from "fs";
import path from "path";

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);
if (!filePath.includes("tokens/alias/")) process.exit(0);

// Read the current alias file (before the write) and the new content
const currentContent = fs.existsSync(filePath)
  ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
  : {};

const newContent = JSON.parse(process.env.CLAUDE_TOOL_INPUT_CONTENT || "{}");

// Flatten token keys for comparison
function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === "object" && !v.$value ? flattenKeys(v, key) : [key];
  });
}

const currentKeys = new Set(flattenKeys(currentContent));
const newKeys = new Set(flattenKeys(newContent));

const removed = [...currentKeys].filter((k) => !newKeys.has(k));

if (removed.length === 0) process.exit(0);

// Check if a migration order exists in changelog
const changelogPath = path.resolve("context/changelog.json");
const changelog = fs.existsSync(changelogPath)
  ? JSON.parse(fs.readFileSync(changelogPath, "utf-8"))
  : { migrations: [] };

const approvedMigrations = new Set(
  (changelog.migrations || []).map((m) => m.token)
);

const blocked = removed.filter((k) => !approvedMigrations.has(k));

if (blocked.length > 0) {
  console.error("HOOK FAIL — Alias-Migration-Check");
  console.error("The following alias tokens would be removed without a migration order:");
  blocked.forEach((t) => console.error(`  ❌ ${t}`));
  console.error("\nTo proceed:");
  console.error("  1. Add a migration entry to context/changelog.json");
  console.error("  2. Notify all consumers (Figma, PrimeNG, Storybook) of the change");
  console.error("  3. Re-run after migration is documented");
  process.exit(1);
}

console.log("HOOK PASS — Alias-Migration-Check");
process.exit(0);
