# Toshi Harness — Produktionslinie

## Übersicht

Der Harness kennt fünf Szenarien. Jedes hat eine eigene Pipeline.
Der Reviewer ist immer dabei — er bestimmt ob ein Schritt akzeptiert wird oder wiederholt werden muss.

```
A  Neue Komponente        Token Agent → Review → Component Agent → Review → Docs Agent → Context Agent
B  Neuer Token            Token Agent → Review → Context Agent
C  Neue Variante          Component Agent → Review → Docs Agent → Context Agent
D  Tokenwert ändern       Token Agent → Review → Context Agent
E  Bug Fix                Diagnose → eine der obigen Pipelines
```

---

## Pipeline A — Neue Komponente von Null

**Wann:** Eine Komponente wird erstmals gebaut. Tokens, Implementierung und Doku müssen alle neu entstehen.

```
Start: Anfrage per Chat (+ optional Figma-Link)
  ↓
Token Agent
  Input:  Anfrage + optional Figma-Node
  Tut:    Prüft ob benötigte Tokens existieren
          Erstellt fehlende Tokens (brand → source → alias)
  Output: Token-Diff (welche Dateien, welche Tokens neu/geändert)
  ↓
Reviewer
  Prüft:  Token-Diff gegen AGENTS.md
  PASS →  weiter
  FAIL →  zurück zu Token Agent (max. 2 Versuche, dann Mensch eingreifen)
  ↓
Component Agent
  Input:  Alias-Tokens + optional Figma-Node
  Tut:    Prüft ob Komponente bereits existiert
          Baut PrimeNG-Komponente mit Alias-Tokens
          Testet alle States visuell
          Führt WCAG 2 AA Kontrast-Check durch
  Output: Komponenten-Code + State-Liste + WCAG-Ergebnisse
  ↓
Reviewer
  Prüft:  Komponente + WCAG-Ergebnisse gegen AGENTS.md
  PASS →  weiter
  FAIL →  zurück zu Component Agent (max. 2 Versuche, dann Mensch eingreifen)
  ↓
Docs Agent
  Input:  Komponente + Token-Liste + WCAG-Ergebnisse
  Tut:    Schreibt Storybook Stories (ein Story pro State)
          Schreibt Komponenten-Dokumentation (Markdown)
  Output: Stories + Doku-Datei
  ↓
Context Agent
  Input:  Alle neuen Artefakte dieser Session
  Tut:    Aktualisiert context/tokens.json + context/components.json + context/changelog.json
  Output: Aktualisierter Context Layer
  ↓
Fertig
```

---

## Pipeline B — Neuer Token (ohne neue Komponente)

**Wann:** Ein neuer Token wird gebraucht — z.B. eine neue Farbrolle, ein neuer Spacing-Wert — aber keine Komponente wird neu gebaut.

```
Start: Anfrage per Chat (+ optional Figma-Link)
  ↓
Token Agent
  Input:  Anfrage + optional Figma-Node
  Tut:    Prüft ob ähnlicher Token existiert, fragt nach wenn ja
          Erstellt neuen Token (brand → source → alias)
  Output: Token-Diff
  ↓
Reviewer
  Prüft:  Token-Diff gegen AGENTS.md
  PASS →  weiter
  FAIL →  zurück zu Token Agent (max. 2 Versuche, dann Mensch eingreifen)
  ↓
Context Agent
  Tut:    Aktualisiert context/tokens.json + context/changelog.json
  ↓
Fertig
```

---

## Pipeline C — Neue Variante einer bestehenden Komponente

**Wann:** Eine Komponente existiert bereits. Es soll eine neue Variante hinzugefügt werden (z.B. Button Secondary, Button Ghost). Keine neuen Tokens nötig.

```
Start: Anfrage per Chat (+ optional Figma-Link)
  ↓
Component Agent
  Input:  Name der bestehenden Komponente + gewünschte Variante + optional Figma-Node
  Tut:    Liest bestehende Komponente
          Fügt Variante hinzu (kein Neubau)
          Testet alle States der neuen Variante visuell
          Führt WCAG 2 AA Check für neue Variante durch
  Output: Aktualisierter Komponenten-Code + WCAG-Ergebnisse
  ↓
Reviewer
  Prüft:  Neue Variante + WCAG-Ergebnisse gegen AGENTS.md
  PASS →  weiter
  FAIL →  zurück zu Component Agent (max. 2 Versuche, dann Mensch eingreifen)
  ↓
Docs Agent
  Input:  Neue Variante + Token-Liste + WCAG-Ergebnisse
  Tut:    Fügt Story für neue Variante hinzu
          Aktualisiert Komponenten-Dokumentation
  Output: Aktualisierte Stories + Doku
  ↓
Context Agent
  Tut:    Aktualisiert context/components.json + context/changelog.json
  ↓
Fertig
```

---

## Pipeline D — Bestehenden Tokenwert ändern

**Wann:** Ein Token existiert bereits, aber sein Wert muss geändert werden (z.B. Farbkorrektur, Spacing-Anpassung).

⚠️ Achtung: Wertänderungen an Alias-Tokens haben visuelle Auswirkungen auf alle Komponenten die diesen Token nutzen.

```
Start: Anfrage per Chat
  ↓
Token Agent
  Input:  Token-Name + neuer Wert (oder Beschreibung des gewünschten Werts)
  Tut:    Liest aktuellen Wert + alle Komponenten die diesen Token nutzen (aus Context Layer)
          Informiert: "Dieser Token wird von X Komponenten genutzt. Änderung hat Auswirkungen auf: [Liste]"
          Wartet auf explizite Bestätigung bevor er ändert
          Ändert Wert in source layer + cascadiert zu alias
  Output: Token-Diff + Liste betroffener Komponenten
  ↓
Reviewer
  Prüft:  Wertänderung gegen WCAG AA (wenn Farbwert)
          Prüft ob Alias-Token-Name unverändert bleibt
  PASS →  weiter
  FAIL →  zurück zu Token Agent
  ↓
Context Agent
  Tut:    Aktualisiert context/tokens.json + context/changelog.json
  ↓
Fertig

Hinweis: Wenn der neue Wert WCAG-Kontrast-Probleme verursacht → automatisch
an Component Agent übergeben für Re-Test der betroffenen Komponenten.
```

---

## Pipeline E — Bug Fix

**Wann:** Etwas funktioniert nicht wie es soll. Unklar wo das Problem liegt.

```
Start: Bug-Beschreibung per Chat
  ↓
Diagnose (du + Claude)
  Fragen:
  - Ist es ein visuelles Problem? (falsches Aussehen)       → Pipeline C oder D
  - Ist es ein Token-Problem? (falscher Wert, fehlender Token) → Pipeline B oder D
  - Ist es ein Doku-Problem? (falsche Story, fehlender State)  → Docs Agent direkt
  - Ist es ein Kontrast-Problem? (WCAG-Fehler)              → Pipeline D + Component Agent
  ↓
Weiterleitung in die passende Pipeline
```

---

## Fehlerbehandlung

| Situation | Was passiert |
|---|---|
| Reviewer gibt FAIL | Agent bekommt Feedback, korrigiert, Reviewer prüft erneut |
| 2x FAIL beim selben Agent | Pipeline stoppt, du wirst informiert |
| Fehlender Token während Component Agent läuft | Component Agent stoppt, Token Agent wird angestossen |
| Fehlende Figma-Node-ID | Agent fragt nach bevor er startet |
| Context Agent findet Inkonsistenz | Flaggt, macht keine Annahmen |
