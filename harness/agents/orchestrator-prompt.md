# Orchestrator-Prompt

Das ist der Prompt den du nutzt um eine Produktionslinie anzustossen.
Kopiere das passende Template, fülle die Platzhalter aus, und schicke es ab.

---

## Pipeline A — Neue Komponente

```
Neue Komponente: [Name]

[optional] Figma-Link: [URL]
[optional] Beschreibung: [Was soll die Komponente tun?]

Starte Pipeline A:
Token Agent → Reviewer → Component Agent → Reviewer → Docs Agent → Context Agent

Benötigte Tokens (falls bekannt):
- [Token-Name oder "unbekannt, Token Agent soll prüfen"]

Besondere Anforderungen:
- [z.B. "muss Dark Mode unterstützen" oder "keine"]
```

---

## Pipeline B — Neuer Token

```
Neuer Token benötigt: [Beschreibung oder Token-Name]

[optional] Figma-Link: [URL]
[optional] Kontext: [Wofür wird dieser Token gebraucht?]

Starte Pipeline B:
Token Agent → Reviewer → Context Agent
```

---

## Pipeline C — Neue Variante

```
Neue Variante für: [bestehende Komponente]
Variante: [Name der neuen Variante, z.B. "Secondary", "Ghost", "Destructive"]

[optional] Figma-Link: [URL]

Starte Pipeline C:
Component Agent → Reviewer → Docs Agent → Context Agent

Neue Tokens nötig: Nein
(Falls doch Token fehlen, stoppt der Component Agent und meldet sich)
```

---

## Pipeline D — Tokenwert ändern

```
Token ändern: [Token-Name]
Aktueller Wert: [aktueller Wert]
Neuer Wert: [neuer Wert oder Beschreibung]

Grund: [Warum wird der Wert geändert?]

Starte Pipeline D:
Token Agent → Reviewer → Context Agent

Hinweis: Token Agent zeigt zuerst alle betroffenen Komponenten bevor er ändert.
```

---

## Pipeline E — Bug Fix

```
Bug-Beschreibung: [Was funktioniert nicht?]

[optional] Screenshot oder Figma-Link: [URL]
[optional] Betroffene Komponente: [Name]
[optional] Betroffener Token: [Name]

Starte mit Diagnose — bestimme welche Pipeline greift, dann starte sie.
```

---

## Allgemeine Regeln für alle Prompts

- Immer explizit die Pipeline nennen — der Harness startet sonst nicht automatisch
- Figma-Links immer vollständig (inkl. node-id wenn bekannt)
- Wenn du dir nicht sicher bist welche Pipeline — Pipeline E nutzen, Diagnose läuft zuerst
- Max. 2 Wiederholungsversuche pro Agent bei FAIL — danach eingreifen
