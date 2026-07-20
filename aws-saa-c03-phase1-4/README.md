# AWS SAA-C03 Content Engine — Phases 1–4

## Build output

- Objectives: **250**
- Trigger mappings: **1250**
- Legacy MCQ blocks audited: **225**
- Gold questions: **250**
- Adaptive variants: **1250**
- Correct position distribution: **{'D': 331, 'B': 285, 'A': 333, 'C': 301}**

## Phase 1 — Normalize objectives and triggers

`phase1_objective_catalog.json/csv` contains the objective-first catalog. `phase1_trigger_catalog.json` contains five trigger phrasings per objective.

## Phase 2 — Audit legacy MCQs

`phase2_legacy_mcq_audit.json` inventories the supplied corpus. It flags legacy services and terminology and marks every source question for intent-only rewriting rather than direct import.

## Phase 3 — Gold questions

`phase3_gold_questions.json` contains one baseline question for each objective.

## Phase 4 — Adaptive variants

`phase4_question_bank_1250.json` and `.js` contain five variants per objective. Every option includes an explanation. Correct options are deterministically shuffled.

## Adaptive rule

- A missed objective receives a 2.0 selection weight.
- A correct response reduces selection weight to 0.65.
- An objective requires correct answers across at least two variants before mastery.
- Exact recently seen questions should be suppressed while another variant exists.

## Production warning

This is a generated first editorial version. Run expert review on gold questions and all questions flagged by future semantic or documentation checks before describing the bank as exam-accurate.
