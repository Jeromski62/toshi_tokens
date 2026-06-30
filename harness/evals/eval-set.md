# Toshi Harness — Eval Set v1

12 Evals in vier Kategorien. Ausführen nach jeder Harness-Änderung oder Modell-Update.

---

## Kategorie 1 — Token-Evals

### T-01: Ähnlicher Token existiert bereits

**Input:**
```
"Wir brauchen eine neue Farbe für Warnungen in Brand A."
```

**Expected Output:**
```
✓ Token Agent sucht nach existierenden Warning-Tokens bevor er handelt
✓ Token Agent findet alias.color.warning.default und fragt nach:
  "Token alias.color.warning.default existiert bereits. Welchen Unterschied braucht der neue Token?"
✓ Agent wartet auf Antwort — erstellt nicht automatisch einen neuen Token
```

**FAIL wenn:**
- Agent erstellt sofort einen neuen Token ohne zu fragen
- Agent ignoriert existierende Warning-Tokens

---

### T-02: Vollständige Kaskade

**Input:**
```
"Füge eine neue Akzentfarbe Coral zu Brand A hinzu. Hex: #E8603C. Zweck: Highlight-Elemente."
```

**Expected Output:**
```
✓ Token landet zuerst in brand/brandA/color (Palette-Ebene)
✓ Token kaskadiert durch source layer
✓ Token landet in alias/color.json als alias.color.highlight.default
✓ Kein Hex-Wert hardcoded in alias — Referenz via {brand.brandA.color.coral.500}
✓ Naming folgt Konvention: alias.{category}.{role}.{state}
```

**FAIL wenn:**
- Token wird direkt in alias geschrieben ohne brand-Ebene
- Hex-Wert erscheint hardcoded in alias
- Token-Name weicht von Konvention ab

---

### T-03: Keine Erfindung von Token-Namen

**Input:**
```
"Baue eine Komponente die alias.color.button.magical.glow verwendet."
```

**Expected Output:**
```
✓ Token Agent prüft ob alias.color.button.magical.glow existiert
✓ Token existiert nicht → Agent stoppt und meldet:
  "alias.color.button.magical.glow existiert nicht. Soll ich ihn erstellen?"
✓ Agent baut keine Komponente mit nicht-existierendem Token
```

**FAIL wenn:**
- Agent erfindet den Token ohne nachzufragen
- Komponente wird mit nicht-existierendem Token-Verweis geschrieben

---

### T-04: Tokenwert-Änderung mit Auswirkungsanalyse

**Input:**
```
"Ändere alias.color.primary.default von {brand.brandA.color.green.500} auf {brand.brandA.color.green.600}."
```

**Expected Output:**
```
✓ Token Agent liest context/components.json
✓ Agent listet alle Komponenten die alias.color.primary.default nutzen
✓ Agent wartet auf explizite Bestätigung bevor er ändert
✓ Nach Bestätigung: Wert wird geändert, Kaskade bleibt intakt
✓ context/changelog.json wird aktualisiert
```

**FAIL wenn:**
- Agent ändert Token ohne Auswirkungsanalyse
- Agent ändert Token ohne Bestätigung
- Changelog wird nicht aktualisiert

---

## Kategorie 2 — Component-Evals

### C-01: Existenz-Check vor Neubau

**Input:**
```
"Wir brauchen einen Button."
```

**Expected Output:**
```
✓ Component Agent prüft context/components.json
✓ Button existiert bereits → Agent fragt:
  "Button existiert bereits mit Varianten: primary, secondary. Soll ich eine neue Variante hinzufügen?"
✓ Agent baut keinen zweiten Button
```

**FAIL wenn:**
- Agent baut einen neuen Button ohne zu prüfen ob einer existiert
- Agent ignoriert bestehende Varianten

---

### C-02: Alle States vollständig

**Input:**
```
"Baue einen Badge-Komponente. Varianten: success, warning, error."
```

**Expected Output:**
```
✓ Jede Variante hat: default, hover (wenn interaktiv), focus, disabled
✓ Alle States sind implementiert — nicht nur default
✓ Docs Agent bekommt vollständige State-Liste für Storybook
```

**FAIL wenn:**
- Nur default State implementiert
- States fehlen ohne explizite Begründung

---

### C-03: Keine hardcodierten Werte in Komponenten

**Input:**
```
"Baue einen Input-Komponente mit Border-Farbe #CBD5E1."
```

**Expected Output:**
```
✓ Component Agent lehnt Hex-Wert ab
✓ Agent fragt nach dem semantischen Zweck: "Welche Rolle hat diese Farbe? Border-Default, Border-Focus, Border-Error?"
✓ Token Agent wird angestossen um den richtigen Alias-Token zu finden oder zu erstellen
✓ Komponente wird erst gebaut wenn Token existiert
```

**FAIL wenn:**
- Komponente wird mit #CBD5E1 gebaut
- Agent ersetzt Hex durch selbst erfundenen Token-Namen

---

### C-04: WCAG AA bestanden

**Input:**
```
"Baue einen Button Primary mit alias.color.button.primary.label auf alias.color.button.primary.background."
(Annahme: label = #FFFFFF, background = #51834E)
```

**Expected Output:**
```
✓ wcag-pair Kommentar wird in Komponente geschrieben
✓ WCAG-Hook läuft nach dem Schreiben
✓ Kontrast #FFFFFF auf #51834E = 5.8:1 → PASS (min. 4.5:1 für Text)
✓ Komponente wird akzeptiert
```

**FAIL wenn:**
- wcag-pair Kommentar fehlt
- WCAG-Hook gibt Fehler aber Komponente wird trotzdem akzeptiert

---

## Kategorie 3 — Pipeline-Evals

### P-01: Pipeline A läuft in korrekter Reihenfolge

**Input:**
```
Pipeline A starten: "Neue Komponente: Tag/Label. Klein, nur Text, keine Interaktion."
```

**Expected Output:**
```
✓ Schritt 1: Token Agent prüft/erstellt benötigte Tokens
✓ Schritt 2: Reviewer gibt PASS für Tokens
✓ Schritt 3: Component Agent baut Komponente
✓ Schritt 4: Reviewer gibt PASS für Komponente
✓ Schritt 5: Docs Agent schreibt Stories + Doku
✓ Schritt 6: Context Agent aktualisiert context/
✓ Kein Schritt wird übersprungen
```

**FAIL wenn:**
- Component Agent startet vor Reviewer PASS
- Context Agent wird nicht am Ende ausgeführt
- Reihenfolge der Schritte weicht ab

---

### P-02: Feedback-Schleife bei Reviewer FAIL

**Input:**
```
Token Agent produziert Token mit hardcodiertem Hex-Wert (simulierter Fehler).
```

**Expected Output:**
```
✓ Reviewer gibt FAIL mit konkretem Finding
✓ Token Agent bekommt Feedback und korrigiert
✓ Reviewer prüft erneut
✓ Nach Korrektur: PASS → Pipeline läuft weiter
✓ Component Agent startet erst nach dem zweiten PASS
```

**FAIL wenn:**
- Pipeline läuft nach Reviewer FAIL weiter
- Feedback-Schleife dreht sich mehr als 2x ohne Eskalation

---

### P-03: Pipeline D — Alias-Schutz

**Input:**
```
"Lösche alias.color.primary.default — wir brauchen ihn nicht mehr."
```

**Expected Output:**
```
✓ Alias-Migration-Check Hook blockiert sofort
✓ Agent meldet: "Alias-Token kann nicht ohne Migrationsauftrag gelöscht werden"
✓ Agent listet alle Konsumenten des Tokens
✓ Kein Token wird gelöscht
```

**FAIL wenn:**
- Token wird gelöscht ohne Migration
- Hook läuft nicht
- Agent löscht auf explizite Aufforderung ohne Widerstand

---

## Kategorie 4 — Edge-Case-Evals

### E-01: Unklarer Input

**Input:**
```
"Mach den Button schöner."
```

**Expected Output:**
```
✓ Agent fragt nach konkretem Auftrag:
  "Was soll konkret geändert werden? Farbe, Größe, Form, Schatten?"
✓ Agent startet keine Pipeline ohne klaren Auftrag
✓ Kein Token, keine Komponente wird verändert
```

**FAIL wenn:**
- Agent interpretiert "schöner" eigenständig und ändert Werte
- Agent startet eine Pipeline ohne Rückfrage

---

### E-02: Figma-Link ohne Node-ID

**Input:**
```
"Hier ist das Design: https://figma.com/file/ABC123 — bau das nach."
```

**Expected Output:**
```
✓ Agent erkennt fehlende Node-ID
✓ Agent fragt nach: "Welcher spezifische Frame oder welche Komponente soll umgesetzt werden? Bitte teile den Link mit Node-ID."
✓ Agent startet nicht ohne eindeutigen Figma-Node
```

**FAIL wenn:**
- Agent versucht das gesamte Figma-File zu laden
- Agent rät welcher Frame gemeint ist

---

### E-03: Scope-Verletzung

**Input:**
```
"Baue ein Login-Formular mit E-Mail-Feld, Passwort-Feld und Submit-Button."
```

**Expected Output:**
```
✓ Agent erkennt: Login-Formular ist ein Pattern, kein Base Component
✓ Agent meldet: "Login-Formular liegt außerhalb des Scope. Das Design System enthält nur Base Components. Das Formular wird auf Produkt-Ebene aus bestehenden Komponenten zusammengesetzt."
✓ Agent bietet an: "Soll ich prüfen ob Input und Button als Base Components bereits existieren?"
```

**FAIL wenn:**
- Agent baut das Formular
- Agent baut Teile davon ohne Scope-Hinweis

---

## Ausführung

**Wann ausführen:**
- Nach jeder Änderung an AGENTS.md, Skill-Files oder Hooks
- Nach jedem Modell-Update
- Wenn ein Agent sich unerwartet verhält — zuerst reproduzieren, dann fixen

**Format:**
Jeden Eval manuell durchführen. Output gegen Expected Output prüfen. Ergebnis eintragen:

```
T-01: ✅ PASS
T-02: ✅ PASS
T-03: ❌ FAIL — Agent hat Token ohne Rückfrage erstellt
...
```

**Bei FAIL:**
1. Welches Skill-File oder welche Regel hat versagt?
2. Regel anpassen
3. Eval erneut ausführen bis PASS
