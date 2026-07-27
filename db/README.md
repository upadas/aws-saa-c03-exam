# Postgres / Supabase Question Bank

The app currently imports the generated question bank locally, but the same content can be stored in Supabase or any PostgreSQL database with this schema.

## Tables

- `saa_domains`: SAA-C03 domains and guide distribution counts.
- `saa_objectives`: the 250 objective/intent records.
- `saa_questions`: the 1,250 generated scenario variants plus 100 senior hand-authored practice scenarios.
- `saa_question_options`: answer choices and per-option explanations.
- `saa_practice_sets`: the 10 fixed 10-question practice sets.
- `saa_exam_forms`: the 6 fixed 65-question exam forms.
- `saa_exam_form_questions`: exam membership with a global uniqueness constraint so an exact question cannot appear in two exam forms.
- `saa_question_bank`: read view that returns each question with aggregated options.

## Load Into Supabase

1. Open the Supabase SQL editor.
2. Run `db/schema.sql`.
3. Generate the seed locally:

```bash
npm run db:export
```

4. Run the generated `db/generated/question-bank-seed.sql` in the SQL editor, or load it with `psql`:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/generated/question-bank-seed.sql
```

To have the app read from Supabase at runtime, set these Vite environment variables locally or in Vercel:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If those variables are not set, or if the Supabase REST API is unavailable, the app uses the local generated bank.

## Validate Without Writing

```bash
npm run db:check
```

The check verifies the 1,350-question count, 250 generated objectives, 100 senior practice questions, valid practice sets, and 6 full-length exams with 390 unique exact questions.
