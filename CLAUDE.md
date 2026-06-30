# Toshi Design System

Lies zuerst: `harness/AGENTS.md` — dort sind alle Regeln und der Kontext für dieses System.

## Skills

Für spezialisierte Aufgaben lade das passende Skill-File:
- `harness/skills/token-agent.md`
- `harness/skills/component-agent.md`
- `harness/skills/docs-agent.md`
- `harness/skills/context-agent.md`
- `harness/skills/reviewer-agent.md`

## Pipelines

Für Pipelines und Orchestrierung: `harness/agents/pipeline.md`  
Für Copy-Paste Pipeline-Prompts: `harness/agents/orchestrator-prompt.md`

## Tools

Verfügbare Tools und wann sie einzusetzen sind: `harness/tools/tool-descriptions.md`  
MCP-Konfiguration: `harness/tools/mcp.config.json`

## Observability

Nach jeder Pipeline-Session: Session-Log anlegen nach `harness/observability/session-log-template.json`  
Logs ablegen unter: `harness/observability/logs/`  
Metriken werden automatisch via Hook in `harness/observability/metrics.md` eingetragen.
