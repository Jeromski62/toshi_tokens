#!/usr/bin/env node

// Runs when Claude finishes responding (Stop hook).
// Picks up any session-log JSON files dropped in harness/observability/logs/
// (shape: harness/observability/session-log-template.json) and appends one
// row per file to the Session Log table in harness/observability/metrics.md.
// Processed files are moved to logs/processed/ so they are never double-counted.

import fs from "fs";
import path from "path";

const logsDir = path.resolve("harness/observability/logs");
const processedDir = path.join(logsDir, "processed");
const metricsPath = path.resolve("harness/observability/metrics.md");

if (!fs.existsSync(logsDir)) process.exit(0);

const pending = fs
  .readdirSync(logsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.join(logsDir, f));

if (pending.length === 0) process.exit(0);

if (!fs.existsSync(metricsPath)) {
  console.warn("HOOK WARN — Metrics-Log: harness/observability/metrics.md not found.");
  process.exit(0);
}

fs.mkdirSync(processedDir, { recursive: true });

const metrics = fs.readFileSync(metricsPath, "utf-8");
const lines = metrics.split("\n");
const headerIndex = lines.findIndex((l) => l.startsWith("| Datum | Pipeline | Task |"));

if (headerIndex === -1) {
  console.error("HOOK FAIL — Metrics-Log: Session Log table not found in metrics.md");
  process.exit(1);
}

const separatorIndex = headerIndex + 1;
let insertAt = separatorIndex + 1;
// Drop the placeholder "| — | — | — | — | — | — | — |" row on first real entry.
if (lines[insertAt]?.includes("| — | — | — |")) {
  lines.splice(insertAt, 1);
}

const newRows = [];

for (const file of pending) {
  const session = JSON.parse(fs.readFileSync(file, "utf-8"));

  const reviewerFails = (session.agents || []).filter(
    (a) => a.agent === "reviewer" && a.result === "fail"
  ).length;
  const hookBlocks = (session.hooks || []).reduce((sum, h) => sum + (h.blocked || 0), 0);
  const duration =
    typeof session.duration_minutes === "number" ? `${session.duration_minutes}min` : `${session.duration_minutes}`;

  newRows.push(
    `| ${session.date} | ${session.pipeline} | ${session.task} | ${session.total_tokens} | ${reviewerFails} | ${hookBlocks} | ${duration} |`
  );

  fs.renameSync(file, path.join(processedDir, path.basename(file)));
}

lines.splice(insertAt, 0, ...newRows);
fs.writeFileSync(metricsPath, lines.join("\n"), "utf-8");

console.log(`HOOK — Metrics-Log: appended ${newRows.length} session(s) to metrics.md`);
process.exit(0);
