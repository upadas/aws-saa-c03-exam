# Cloud Architect Lab — AWS SAA-C03 Quiz

A local-first, Vercel-ready React/Vite practice application with 1,350 original questions: 1,250 generated scenario variants across 250 SAA-C03 objectives plus 100 hand-authored senior practice scenarios.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm test
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Vercel detects Vite automatically.
4. Build command: `npm run build`
5. Output directory: `dist`

No backend or environment variables are required. Progress is stored in the browser's localStorage. If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured, the app loads the question bank from Supabase and falls back to the local bank if the API is unavailable.

## Postgres / Supabase question bank

The generated question bank can also be loaded into Supabase or any PostgreSQL database:

```bash
npm run db:check
npm run db:export
```

Apply `db/schema.sql` first, then load `db/generated/question-bank-seed.sql`. The schema stores domains, objectives, questions, options, practice sets, and six full-length exam forms.

To use Supabase as the runtime source, copy `.env.example` to `.env.local` and set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Included

- Dashboard and official-domain weighting display
- 1,350 original questions with single-answer, choose-two, and choose-three formats
- 250 objectives with five adaptive variants each
- 10 blueprint-weighted practice sets of hand-authored senior-level questions (no repeated intent within a set)
- 6 fixed full-length exams with no exact question reused across forms
- Quick practice, domain practice, and 65-question / 130-minute exam mode
- Explanations, question flags, navigation, results, and domain analytics
- Searchable question bank with domain, service, objective, difficulty, missed, and mastered filters
- Objective mastery that requires at least three correct variants
- Responsive desktop/mobile design

## Content note

These questions are independently written practice content based on public AWS SAA-C03 exam-guide domains. They are not actual AWS exam questions and are not endorsed by AWS.
