#!/usr/bin/env node

// Triggers the Context Agent after any token or component file is written.
// Ensures the context layer is never stale after a change.

const filePath = process.env.CLAUDE_TOOL_INPUT_PATH;
if (!filePath) process.exit(0);

const triggerPaths = ["tokens/", "components/"];
const shouldSync = triggerPaths.some((p) => filePath.includes(p));

if (!shouldSync) process.exit(0);

console.log("HOOK — Context-Sync");
console.log(`File changed: ${filePath}`);
console.log("Action required: Run Context Agent to update context/tokens.json, context/components.json, and context/changelog.json");
console.log("\nContext Agent prompt:");
console.log("  'Update the context layer. The following file was just changed: " + filePath + "'");

// Exit 0 — this hook informs, it does not block.
// The Context Agent is triggered as a follow-up, not a gate.
process.exit(0);
