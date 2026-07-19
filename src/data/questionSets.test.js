import test from 'node:test'
import assert from 'node:assert/strict'
import { questions, questionSets } from './questionSets.js'
import { DOMAIN_META, validateQuestionSets } from '../quizLogic.js'

test('question bank contains 10 complete blueprint-weighted sets', () => {
  assert.equal(questions.length, 100)
  assert.equal(questionSets.length, 10)
  assert.deepEqual(validateQuestionSets(questionSets, questions), [])
})

test('questions are original practice records with valid answer indexes', () => {
  const ids = new Set()

  questions.forEach(question => {
    ids.add(question.id)
    assert.ok(Object.hasOwn(DOMAIN_META, question.domain), `${question.id} has unsupported domain`)
    assert.match(question.difficulty, /^(Easy|Medium|Hard)$/)
    assert.match(question.type, /^(single|multiple)$/)
    assert.ok(question.question.length > 80, `${question.id} should be scenario-based`)
    assert.ok(question.objectiveId.length > 6, `${question.id} should have an objective id`)
    assert.ok(question.objectiveName.length > 10, `${question.id} should have an objective name`)
    assert.ok(question.options.length >= 4, `${question.id} should have at least 4 options`)
    assert.ok(question.answers.length >= 1, `${question.id} should have answers`)
    assert.ok(question.explanation.length > 50, `${question.id} should explain the answer`)
    assert.ok(question.services.length >= 1, `${question.id} should tag services`)
    assert.ok(question.tags.length >= question.services.length, `${question.id} should include objective tags`)

    question.answers.forEach(answer => {
      assert.ok(answer >= 0 && answer < question.options.length, `${question.id} has invalid answer index`)
    })
  })

  assert.equal(ids.size, questions.length)
})

test('answer choices avoid throwaway distractors from the draft bank', () => {
  const weakDraftPhrases = [
    'root password',
    'user data',
    'S3 static website hosting',
    'CloudFront signed cookies',
    'IAM policy character count',
    'Dedicated Host for Lambda',
    'Route 53 hosted zone size',
  ]
  const allOptions = questions.flatMap(question => question.options)

  weakDraftPhrases.forEach(phrase => {
    assert.equal(
      allOptions.some(option => option.includes(phrase)),
      false,
      `Generated options should not include weak draft phrase: ${phrase}`,
    )
  })
})
