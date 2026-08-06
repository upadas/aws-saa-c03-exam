import test from 'node:test'
import assert from 'node:assert/strict'
import { fullLengthExams, questions, questionSets } from './questionSets.js'
import { proPracticeQuestions } from './proPracticeBank.js'
import { examBankQuestions } from './examBank.js'
import {
  DOMAIN_META,
  EXAM_DOMAIN_COUNTS,
  PRACTICE_DOMAIN_PATTERN,
  PRACTICE_RESPONSE_PATTERN,
  answerMatches,
  createSessionQuestion,
  validateFullLengthExams,
  validateQuestionSets,
} from '../quizLogic.js'

const expectedOptionCount = { 1: 4, 2: 5, 3: 6 }

function assertWellFormed(question, idPattern) {
  assert.match(question.id, idPattern)
  assert.ok(Object.hasOwn(DOMAIN_META, question.domain), `${question.id} has unsupported domain`)
  assert.match(question.difficulty, /^(Hard|Medium)$/, `${question.id} must be senior-level difficulty`)
  assert.ok(question.question.length > 200, `${question.id} should be a concrete scenario stem`)
  assert.ok(question.intentGroup.length > 3, `${question.id} needs an intent group`)
  assert.equal(question.options.length, expectedOptionCount[question.correctOptionIds.length])
  assert.equal(question.type, question.correctOptionIds.length > 1 ? 'multiple' : 'single')
  assert.deepEqual(question.answers, question.correctOptionIds)
  assert.deepEqual(
    question.options.filter(option => option.correct).map(option => option.id),
    question.correctOptionIds,
  )
  question.options.forEach(option => {
    assert.ok(option.text.length > 20, `${question.id} option ${option.id} should be a substantive choice`)
    assert.ok(option.explanation.length > 20, `${question.id} option ${option.id} needs an explanation`)
  })
  assert.ok(question.explanation.length > 40, `${question.id} needs a question-level explanation`)
  assert.equal(answerMatches(question, question.correctOptionIds), true)
  assert.equal(answerMatches(question, []), false)
}

test('the app bank is the hand-authored corpus only (generated bank retired)', () => {
  assert.equal(proPracticeQuestions.length, 100)
  assert.equal(examBankQuestions.length, 390)
  assert.equal(questions.length, 490)
  assert.equal(new Set(questions.map(question => question.id)).size, 490)
  assert.ok(questions.every(question => /^(PRO|EX)-/.test(question.id)), 'no generated questions should remain')
})

test('pro practice bank questions are well-formed', () => {
  proPracticeQuestions.forEach(question => assertWellFormed(question, /^PRO-\d{3}$/))
  const hardCount = proPracticeQuestions.filter(question => question.difficulty === 'Hard').length
  assert.ok(hardCount >= 60, 'practice bank should stay predominantly Hard')
})

test('exam bank questions are well-formed', () => {
  examBankQuestions.forEach(question => assertWellFormed(question, /^EX-[SRPC]\d-\d{2}$/))
  const hardCount = examBankQuestions.filter(question => question.difficulty === 'Hard').length
  assert.ok(hardCount >= 234, 'exam bank should stay predominantly Hard')
})

test('intents are unique across the entire corpus — no sibling or same-intent questions', () => {
  const intents = questions.map(question => question.intentGroup)
  assert.equal(new Set(intents).size, questions.length)
})

test('practice sets follow the blueprint pattern with unique intents and services per set', () => {
  assert.deepEqual(validateQuestionSets(questionSets, questions), [])
  const byId = new Map(questions.map(question => [question.id, question]))

  questionSets.forEach((set, setIndex) => {
    const setQuestions = set.questionIds.map(id => byId.get(id))
    const intents = new Set()
    const services = new Set()

    setQuestions.forEach((question, slotIndex) => {
      assert.match(question.id, /^PRO-\d{3}$/, `${set.name} should draw from the pro bank`)
      assert.equal(question.practiceSet, setIndex + 1)
      assert.equal(question.domain, PRACTICE_DOMAIN_PATTERN[slotIndex])
      assert.equal(question.correctOptionIds.length, PRACTICE_RESPONSE_PATTERN[slotIndex])
      assert.ok(!intents.has(question.intentGroup), `${set.name} repeats intent ${question.intentGroup}`)
      intents.add(question.intentGroup)
      services.add(question.service)
    })
    assert.equal(services.size, setQuestions.length, `${set.name} should spread services`)
  })
})

test('full-length exam forms follow the exam guide distribution without reuse', () => {
  assert.deepEqual(validateFullLengthExams(fullLengthExams, questions), [])
  const byId = new Map(questions.map(question => [question.id, question]))
  const allIds = fullLengthExams.flatMap(exam => exam.questionIds)
  assert.equal(allIds.length, 390)
  assert.equal(new Set(allIds).size, 390, 'no question may repeat across forms')

  fullLengthExams.forEach(exam => {
    const examQuestions = exam.questionIds.map(id => byId.get(id))
    const domainCounts = examQuestions.reduce((counts, question) => ({
      ...counts,
      [question.domain]: (counts[question.domain] || 0) + 1,
    }), {})
    assert.deepEqual(domainCounts, EXAM_DOMAIN_COUNTS)
    assert.ok(examQuestions.every(question => /^EX-/.test(question.id)), `${exam.name} should draw from the exam bank`)
    assert.ok(examQuestions.some(question => question.correctOptionIds.length === 2))
    assert.ok(examQuestions.some(question => question.correctOptionIds.length === 3))
    const intents = examQuestions.map(question => question.intentGroup)
    assert.equal(new Set(intents).size, intents.length, `${exam.name} repeats an intent`)
  })
})

test('answer-format tells cannot game the bank', () => {
  const singles = questions.filter(question => question.correctOptionIds.length === 1)
  let longestWins = 0
  let shortestWins = 0
  let mixedPunctuation = 0

  questions.forEach(question => {
    const punctuation = new Set(question.options.map(option => option.text.trim().endsWith('.')))
    if (punctuation.size > 1) mixedPunctuation += 1
  })
  singles.forEach(question => {
    const sorted = [...question.options].sort((a, b) => b.text.length - a.text.length)
    if (sorted[0].correct) longestWins += 1
    if (sorted[sorted.length - 1].correct) shortestWins += 1
  })

  assert.ok(longestWins / singles.length < 0.45, `"pick the longest" scores ${(100 * longestWins / singles.length).toFixed(1)}%`)
  assert.ok(shortestWins / singles.length < 0.45, `"pick the shortest" scores ${(100 * shortestWins / singles.length).toFixed(1)}%`)
  assert.equal(mixedPunctuation, 0, 'options within a question must share one punctuation convention')
})

test('session shuffling keeps correct option ids answerable', () => {
  const sessionQuestion = createSessionQuestion(questions[0], () => 0.42)
  assert.equal(sessionQuestion.options.length, 4)
  assert.equal(answerMatches(sessionQuestion, sessionQuestion.answers), true)
  assert.equal(new Set(sessionQuestion.options.map(option => option.id)).size, 4)
})
