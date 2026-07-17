import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DOMAIN_META,
  EXAM_DURATION_SECONDS,
  answerMatches,
  buildQuestionReview,
  formatTime,
  sampleWeighted,
  validateQuestionSets,
} from './quizLogic.js'

const makeQuestion = (id, domain) => ({
  id,
  domain,
  answers: [0],
})

test('answerMatches treats multiple-response answers as order independent', () => {
  const question = { answers: [3, 1] }

  assert.equal(answerMatches(question, [1, 3]), true)
  assert.equal(answerMatches(question, [3, 1]), true)
  assert.equal(answerMatches(question, [1]), false)
  assert.equal(answerMatches(question, [1, 2]), false)
})

test('buildQuestionReview summarizes selected and correct answers', () => {
  const question = {
    id: 42,
    answers: [0, 2],
    options: ['Use an ALB', 'Use one instance', 'Span two AZs', 'Disable health checks'],
  }

  assert.deepEqual(buildQuestionReview(question, [2, 0]), {
    id: 42,
    isCorrect: true,
    isAnswered: true,
    selectedLabels: ['Span two AZs', 'Use an ALB'],
    correctLabels: ['Use an ALB', 'Span two AZs'],
    options: [
      { label: 'Use an ALB', isSelected: true, isCorrect: true },
      { label: 'Use one instance', isSelected: false, isCorrect: false },
      { label: 'Span two AZs', isSelected: true, isCorrect: true },
      { label: 'Disable health checks', isSelected: false, isCorrect: false },
    ],
  })

  assert.equal(buildQuestionReview(question, []).isAnswered, false)
  assert.equal(buildQuestionReview(question, []).isCorrect, false)
})

test('formatTime renders the SAA-C03 exam duration as 130:00', () => {
  assert.equal(EXAM_DURATION_SECONDS, 130 * 60)
  assert.equal(formatTime(EXAM_DURATION_SECONDS), '130:00')
  assert.equal(formatTime(59), '0:59')
})

test('sampleWeighted returns a 65-question blueprint-weighted exam when enough questions exist', () => {
  const domains = Object.keys(DOMAIN_META)
  const questions = domains.flatMap((domain, domainIndex) =>
    Array.from({ length: 30 }, (_, index) => makeQuestion(domainIndex * 100 + index, domain)),
  )

  const sample = sampleWeighted(questions, 65)
  const counts = Object.fromEntries(domains.map(domain => [
    domain,
    sample.filter(question => question.domain === domain).length,
  ]))

  assert.equal(sample.length, 65)
  assert.deepEqual(counts, {
    'Secure Architectures': 20,
    'Resilient Architectures': 17,
    'High-Performing Architectures': 16,
    'Cost-Optimized Architectures': 12,
  })
})

test('validateQuestionSets requires 10 blueprint-aligned sets of 10 questions', () => {
  const questions = [
    ...Array.from({ length: 3 }, (_, index) => makeQuestion(index + 1, 'Secure Architectures')),
    ...Array.from({ length: 3 }, (_, index) => makeQuestion(index + 4, 'Resilient Architectures')),
    ...Array.from({ length: 2 }, (_, index) => makeQuestion(index + 7, 'High-Performing Architectures')),
    ...Array.from({ length: 2 }, (_, index) => makeQuestion(index + 9, 'Cost-Optimized Architectures')),
  ]
  const questionSets = Array.from({ length: 10 }, (_, index) => ({
    id: `set-${index + 1}`,
    name: `Set ${index + 1}`,
    questionIds: questions.map(question => question.id),
  }))

  assert.deepEqual(validateQuestionSets(questionSets, questions), [])
})
