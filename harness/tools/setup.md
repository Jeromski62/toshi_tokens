# Tool Setup — Schritt für Schritt

Die `mcp.config.json` beschreibt welche MCP Server der Harness braucht.
Diese Anleitung erklärt wie du sie tatsächlich aktivierst.

---

## 1. Filesystem MCP installieren

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

---

## 2. Figma API Key holen

1. Öffne Figma → Account Settings → Security
2. Erstelle einen neuen Personal Access Token
3. Speichere ihn als Environment Variable:

Windows (PowerShell):
```powershell
$env:FIGMA_API_KEY = "dein-key-hier"
```

Dauerhaft (System Environment Variables):
```
Variable: FIGMA_API_KEY
Value:    dein-key-hier
```

---

## 3. MCP Server in Claude Code registrieren

Füge folgendes in `.claude/settings.json` ein (im Toshi Design System Repo
oder global unter `C:\Users\phili\.claude\settings.json`):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:\\02_Work\\_Repos\\Toshi Design System"
      ]
    },
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key",
        "${FIGMA_API_KEY}"
      ]
    }
  }
}
```

---

## 4. Verifizieren

Starte Claude Code neu und prüfe ob die Tools verfügbar sind:
- Im Chat: "List the files in the tokens directory"
- Wenn der Filesystem MCP aktiv ist, sollte Claude direkt antworten ohne nachzufragen

---

## Nächste Schritte

Sobald die Tools aktiv sind, kann der Token Agent:
- Die bestehende `tokens.json` lesen und analysieren
- Tokens prüfen bevor er neue erstellt
- Die Migration in die Ordnerstruktur (brand/, alias/, ...) durchführen
