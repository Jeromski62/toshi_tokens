# Tool Descriptions

Diese Datei beschreibt alle verfügbaren Tools — was sie tun, wann ein Agent sie nutzen soll, und was sie zurückgeben.

---

## Filesystem Tools

Alle Filesystem-Tools operieren innerhalb von `D:\02_Work\_Repos\Toshi Design System`.

---

### `read_file`

**Was es tut:** Liest den Inhalt einer Datei als Text.

**Wann nutzen:**
- Vor dem Erstellen eines neuen Tokens — um zu prüfen ob ein ähnlicher Token bereits existiert
- Vor dem Bauen einer Komponente — um zu prüfen ob eine ähnliche Komponente bereits existiert
- Zum Lesen der TOKEN-CONVENTIONS.md vor jeder Token-Operation

**Beispiel-Inputs:**
```
tokens/alias/color.json
tokens/brand/brandA/color.json
docs/TOKEN-CONVENTIONS.md
```

**Gibt zurück:** Den vollständigen Inhalt der Datei als String.

**Genutzt von:** Token Agent, Component Agent, Reviewer Agent, Context Agent

---

### `write_file`

**Was es tut:** Schreibt oder überschreibt den Inhalt einer Datei.

**Wann nutzen:**
- Nach einer vollständigen Token-Kaskade (brand → alias) — um alle geänderten Dateien zu schreiben
- Nach dem Fertigstellen einer Komponente — um den Code zu speichern
- Nach dem Fertigstellen von Dokumentation — um Markdown-Files zu speichern

**Wichtig:** Immer `read_file` vorher aufrufen um den aktuellen Stand zu kennen. Nie blind überschreiben.

**Genutzt von:** Token Agent, Component Agent, Docs Agent, Context Agent

---

### `list_directory`

**Was es tut:** Listet alle Dateien und Ordner in einem Verzeichnis.

**Wann nutzen:**
- Um zu verstehen welche Token-Layer bereits existieren
- Um zu prüfen welche Komponenten bereits gebaut wurden
- Um den aktuellen Stand des Systems zu inventarisieren

**Beispiel-Inputs:**
```
tokens/
components/
```

**Gibt zurück:** Liste aller Dateien und Unterordner.

**Genutzt von:** Alle Agents, besonders Context Agent

---

### `search_files`

**Was es tut:** Sucht nach einem Begriff oder Muster in allen Dateien eines Verzeichnisses.

**Wann nutzen:**
- Um zu prüfen ob ein Token-Name bereits irgendwo existiert
- Um alle Stellen zu finden wo ein Token referenziert wird (vor dem Umbenennen)
- Um Duplikate zu finden

**Beispiel:**
```
Suche nach: "alias.color.button.primary"
In: tokens/
```

**Genutzt von:** Token Agent (Check vor Erstellung), Reviewer Agent (Referenz-Validierung)

---

## Figma Tools

Erfordern einen gültigen `FIGMA_API_KEY` als Environment Variable.

---

### `get_figma_file`

**Was es tut:** Liest die vollständige Struktur eines Figma-Files.

**Wann nutzen:** Selten — nur wenn du den gesamten Kontext eines Files brauchst. Bevorzuge `get_figma_node` für spezifische Frames.

**Genutzt von:** Token Agent (selten), Component Agent (selten)

---

### `get_figma_node`

**Was es tut:** Liest einen spezifischen Frame, eine Komponente oder ein Element aus Figma anhand seiner Node-ID.

**Wann nutzen:**
- Wenn ein Nutzer einen Figma-Link teilt — extrahiere die Node-ID aus dem Link
- Um die genauen Farbwerte, Abstände oder Typografie eines Designs zu lesen
- Um zu verstehen welche Tokens ein Design verwendet (oder verwenden sollte)

**Beispiel-Input:**
```
File Key:  ABC123XYZ
Node ID:   45:892
```

**Gibt zurück:** Vollständige Figma-Daten des Nodes inkl. aller visuellen Properties.

**Genutzt von:** Token Agent, Component Agent

---

### `get_figma_styles`

**Was es tut:** Liest alle definierten Styles (Farben, Typografie, Effekte) aus einem Figma-File.

**Wann nutzen:**
- Um zu prüfen welche Styles in der Figma Library definiert sind
- Um Abweichungen zwischen Figma-Styles und Token-Werten zu erkennen

**Genutzt von:** Reviewer Agent, Context Agent

---

## Wichtige Regeln für Tool-Nutzung

1. **Read before write** — Immer lesen bevor du schreibst. Nie blind überschreiben.
2. **Minimal scope** — Lies nur die Datei die du brauchst, nicht das gesamte Repository.
3. **Check before create** — Vor jedem neuen Token oder jeder neuen Komponente: search_files ausführen.
4. **Figma is read-only** — Der Harness schreibt nie nach Figma. Figma ist Input, kein Output.
