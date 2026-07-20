# Codex Integration Handoff

1. Work only in the existing GitHub repository connected to Vercel.
2. Import `phase4_question_bank_1250.js` into the existing question data layer.
3. Preserve `objectiveId`, `variant`, `correctOptionIds`, option explanations, and `adaptive` metadata.
4. Do not reshuffle options on every React render. Shuffle once per session, or use the pre-shuffled order.
5. Selection algorithm: prioritize missed/low-mastery objective IDs, suppress recently seen exact question IDs, then sample a different variant of the same objective.
6. Require at least two correct variants before marking an objective mastered.
7. Add filters for domain, service, objective, difficulty, missed, and mastered.
8. Add tests for answer mapping, A-D distribution, no duplicate IDs, and 1,250 total questions.
9. Build, commit on a feature branch, push to GitHub, and verify the Vercel preview before merging.
10. Surface `QA_REPORT.json` in the repository for editorial tracking.
