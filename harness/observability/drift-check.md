# Drift-Check — Wöchentliche Routine

Agents können sich über Zeit anders verhalten — nach Modell-Updates, nach Harness-Änderungen, nach längeren Pausen. Dieser Check erkennt Drift bevor er zum Problem wird.

---

## Wann ausführen

- Einmal pro Woche (empfohlen: Montag vor der ersten Session)
- Nach jedem Modell-Update (sofort)
- Nach größeren Änderungen an AGENTS.md oder Skill-Files (sofort)

---

## Die 4 Pflicht-Evals

Führe diese vier Evals bei jedem Drift-Check aus — sie decken die kritischsten Verhaltensweisen ab:

| Eval | Was er prüft |
|---|---|
| T-02 | Vollständige Token-Kaskade |
| C-01 | Existenz-Check vor Neubau |
| P-03 | Alias-Schutz bei Löschung |
| E-03 | Scope-Verletzung wird erkannt |

---

## Durchführung

1. Öffne `harness/evals/eval-set.md`
2. Führe die vier Pflicht-Evals durch — einen nach dem anderen
3. Trage Ergebnisse in die Drift-Check-Tabelle ein

---

## Drift-Check-Tabelle

| Datum | T-02 | C-01 | P-03 | E-03 | Auffälligkeit |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## Bei FAIL

1. Welches Skill-File oder welche Regel hat versagt?
2. Vergleiche mit der letzten PASS-Version — was hat sich geändert?
3. Anpassen und sofort erneut testen
4. Wenn unklar warum FAIL: alle 12 Evals aus `eval-set.md` durchführen

---

## Faustregel

Zwei aufeinanderfolgende FAILs beim selben Eval = systematisches Problem.
Einmaliger FAIL = kann ein Ausreißer sein, trotzdem beheben.
