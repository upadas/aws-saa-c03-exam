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
    assert.ok(question.options.length >= 4, `${question.id} should have at least 4 options`)
    assert.ok(question.answers.length >= 1, `${question.id} should have answers`)
    assert.ok(question.explanation.length > 50, `${question.id} should explain the answer`)
    assert.ok(question.services.length >= 1, `${question.id} should tag services`)

    question.answers.forEach(answer => {
      assert.ok(answer >= 0 && answer < question.options.length, `${question.id} has invalid answer index`)
    })
  })

  assert.equal(ids.size, questions.length)
})
