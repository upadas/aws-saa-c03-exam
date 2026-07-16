# Codex Handoff — AWS SAA-C03 Quiz App

## Objective

Continue development of the existing local-first AWS SAA-C03 practice website and keep it deployable to Vercel.

## Current stack

- React 18
- Vite 6
- JavaScript
- CSS
- lucide-react
- Browser localStorage
- No backend
- No environment variables

## Run the project

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run preview
```

## Current capabilities

- AWS-themed responsive dashboard
- 40 original SAA-C03 scenario questions
- Single-answer and choose-two questions
- Practice by exam domain
- Random 10-question practice
- Weighted 40-question exam simulation
- Immediate explanations in practice mode
- Question navigation and flagging
- Searchable question bank
- Mastered-question tracking
- Local score history
- Domain-level result analytics

## Important files

- `src/main.jsx` — application UI and quiz logic
- `src/styles.css` — all visual styling
- `src/data/questions.js` — question bank
- `README.md` — local and Vercel instructions

## Recommended next tasks

1. Split `src/main.jsx` into components and hooks.
2. Expand the question bank from 40 to at least 200 original questions.
3. Add a full 65-question, 130-minute exam mode.
4. Add pause/resume and persisted active sessions.
5. Add review mode for incorrect and flagged questions.
6. Add question statistics and weak-service analytics.
7. Add import/export support for JSON question banks.
8. Add automated tests for scoring and multiple-response logic.
9. Add ESLint and Prettier.
10. Deploy to Vercel after local verification.

## Constraints

- Do not copy or claim to reproduce real AWS exam questions.
- Keep questions original and scenario-based.
- Preserve the four official domain categories:
  - Secure Architectures
  - Resilient Architectures
  - High-Performing Architectures
  - Cost-Optimized Architectures
- Keep the app functional without a backend unless a backend is intentionally introduced.
- Preserve Vercel compatibility.
- Run `npm run build` after changes.

## Suggested Codex prompt

Continue this existing React/Vite project. First inspect all files and run the production build. Refactor the app into maintainable components without changing behavior. Then add persisted pause/resume, incorrect-question review, flagged-question review, and a configurable 65-question exam mode with a 130-minute timer. Preserve the current visual style, localStorage support, original question content, and Vercel compatibility. Add basic tests for scoring and choose-two answer validation. Document every new command in README.md.
