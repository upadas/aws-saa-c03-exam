import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DOMAIN_META,
  EXAM_DURATION_SECONDS,
  answerMatches,
  adaptiveQuestionWeight,
  buildQuestionReview,
  createSessionQuestion,
  getCorrectPositionDistribution,
  formatTime,
  sampleWeighted,
  selectAdaptiveQuestions,
  updateObjectiveProgress,
  validateQuestionSets,
} from './quizLogic.js'

const makeQuestion = (id, domain) => ({
  id,
  domain,
  objectiveId: `${domain}-${id}`,
  objectiveName: `${domain} objective ${id}`,
  answers: [0],
  options: ['Correct option', 'Plausible distractor', 'Another distractor', 'Tradeoff distractor'],
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
    selectedLabels: ['Use an ALB', 'Span two AZs'],
    correctLabels: ['Use an ALB', 'Span two AZs'],
    options: [
      { id: '42:option-0', label: 'Use an ALB', explanation: undefined, isSelected: true, isCorrect: true },
      { id: '42:option-1', label: 'Use one instance', explanation: undefined, isSelected: false, isCorrect: false },
      { id: '42:option-2', label: 'Span two AZs', explanation: undefined, isSelected: true, isCorrect: true },
      { id: '42:option-3', label: 'Disable health checks', explanation: undefined, isSelected: false, isCorrect: false },
    ],
  })

  assert.equal(buildQuestionReview(question, []).isAnswered, false)
  assert.equal(buildQuestionReview(question, []).isCorrect, false)
})

test('createSessionQuestion shuffles options while preserving correct answer ids', () => {
  const question = {
    id: 10,
    answers: [0, 2],
    options: ['Scale across AZs', 'Use one subnet', 'Enable health checks', 'Disable failover'],
  }
  const sessionQuestion = createSessionQuestion(question, () => 0.9)
  const selected = sessionQuestion.options
    .filter(option => option.correct)
    .map(option => option.id)

  assert.equal(sessionQuestion.options.length, 4)
  assert.deepEqual([...sessionQuestion.answers].sort(), ['10:option-0', '10:option-2'])
  assert.equal(answerMatches(sessionQuestion, selected), true)
})

test('session option order stays stable when stored on the session question', () => {
  const question = {
    id: 12,
    answers: [1],
    options: ['Near miss', 'Correct', 'Also tempting', 'Wrong scope'],
  }
  const sessionQuestion = createSessionQuestion(question, () => 0.1)
  const orderBefore = [...sessionQuestion.optionOrder]
  const orderAfterNavigation = [...sessionQuestion.optionOrder]

  assert.deepEqual(orderAfterNavigation, orderBefore)
})

test('adaptive selection boosts missed objectives and avoids duplicate questions', () => {
  const questions = [
    { ...makeQuestion(1, 'Secure Architectures'), objectiveId: 's3-endpoint' },
    { ...makeQuestion(2, 'Secure Architectures'), objectiveId: 's3-endpoint' },
    { ...makeQuestion(3, 'Secure Architectures'), objectiveId: 'kms-policy' },
  ]
  const progress = {
    's3-endpoint': {
      objectiveId: 's3-endpoint',
      attempts: 1,
      correct: 0,
      consecutiveCorrect: 0,
      lastResult: 'incorrect',
      seenQuestionIds: [1],
      mastery: 0,
    },
  }
  const sample = selectAdaptiveQuestions(questions, progress, 2, {}, () => 0)

  assert.equal(new Set(sample.map(question => question.id)).size, sample.length)
  assert.equal(sample[0].objectiveId, 's3-endpoint')
  assert.ok(
    adaptiveQuestionWeight(questions[1], progress['s3-endpoint']) >
      adaptiveQuestionWeight(questions[2], undefined),
  )
})

test('adaptive drill mode can intentionally repeat an objective', () => {
  const questions = [
    { ...makeQuestion(1, 'Secure Architectures'), objectiveId: 's3-endpoint' },
    { ...makeQuestion(2, 'Secure Architectures'), objectiveId: 's3-endpoint' },
    { ...makeQuestion(3, 'Secure Architectures'), objectiveId: 'kms-policy' },
  ]
  const sample = selectAdaptiveQuestions(questions, {}, 2, { objectiveIds: ['s3-endpoint'], allowRepeatedObjectives: true }, () => 0)

  assert.equal(sample.length, 2)
  assert.deepEqual(sample.map(question => question.objectiveId), ['s3-endpoint', 's3-endpoint'])
})

test('updateObjectiveProgress requires three correct variants for mastery', () => {
  const sessionQuestions = [
    createSessionQuestion({ ...makeQuestion(1, 'Secure Architectures'), objectiveId: 's3-endpoint', variant: 1 }, () => 0),
    createSessionQuestion({ ...makeQuestion(2, 'Secure Architectures'), objectiveId: 's3-endpoint', variant: 2 }, () => 0),
    createSessionQuestion({ ...makeQuestion(3, 'Secure Architectures'), objectiveId: 's3-endpoint', variant: 3 }, () => 0),
  ]
  const firstTwoAnswers = Object.fromEntries(sessionQuestions.slice(0, 2).map(question => [question.id, question.answers]))
  const firstTwoProgress = updateObjectiveProgress({}, sessionQuestions.slice(0, 2), firstTwoAnswers, '2026-07-19T00:00:00.000Z')
  const answers = Object.fromEntries(sessionQuestions.map(question => [question.id, question.answers]))
  const progress = updateObjectiveProgress(firstTwoProgress, sessionQuestions.slice(2), answers, '2026-07-19T00:00:00.000Z')

  assert.equal(firstTwoProgress['s3-endpoint'].attempts, 2)
  assert.equal(firstTwoProgress['s3-endpoint'].correctVariantIds.length, 2)
  assert.ok(firstTwoProgress['s3-endpoint'].mastery < 0.85)
  assert.equal(progress['s3-endpoint'].attempts, 3)
  assert.equal(progress['s3-endpoint'].correct, 3)
  assert.equal(progress['s3-endpoint'].consecutiveCorrect, 3)
  assert.equal(progress['s3-endpoint'].seenQuestionIds.length, 3)
  assert.equal(progress['s3-endpoint'].correctVariantIds.length, 3)
  assert.ok(progress['s3-endpoint'].mastery >= 0.85)
})

test('missed objectives stay in drill until three variants are correct', () => {
  const sessionQuestions = [1, 2, 3, 4].map(variant =>
    createSessionQuestion({ ...makeQuestion(variant, 'Secure Architectures'), objectiveId: 's3-endpoint', variant }, () => 0),
  )
  const afterMiss = updateObjectiveProgress({}, [sessionQuestions[0]], {}, '2026-07-19T00:00:00.000Z')
  const oneCorrectAnswer = { [sessionQuestions[1].id]: sessionQuestions[1].answers }
  const afterOneCorrect = updateObjectiveProgress(afterMiss, [sessionQuestions[1]], oneCorrectAnswer, '2026-07-19T00:00:00.000Z')
  const remainingAnswers = Object.fromEntries(sessionQuestions.slice(2).map(question => [question.id, question.answers]))
  const afterThreeCorrect = updateObjectiveProgress(afterOneCorrect, sessionQuestions.slice(2), remainingAnswers, '2026-07-19T00:00:00.000Z')
  const drillSample = selectAdaptiveQuestions(sessionQuestions, afterOneCorrect, 2, { missedOnly: true, allowRepeatedObjectives: true }, () => 0)

  assert.equal(afterMiss['s3-endpoint'].lastResult, 'incorrect')
  assert.equal(afterMiss['s3-endpoint'].needsDrill, true)
  assert.equal(afterOneCorrect['s3-endpoint'].lastResult, 'correct')
  assert.equal(afterOneCorrect['s3-endpoint'].needsDrill, true)
  assert.deepEqual(drillSample.map(question => question.objectiveId), ['s3-endpoint', 's3-endpoint'])
  assert.equal(afterThreeCorrect['s3-endpoint'].correctVariantIds.length, 3)
  assert.equal(afterThreeCorrect['s3-endpoint'].needsDrill, false)
})

test('getCorrectPositionDistribution reports displayed correct positions', () => {
  const questions = [
    createSessionQuestion({ id: 1, answers: [0], options: ['A', 'B', 'C', 'D'] }, () => 0),
    createSessionQuestion({ id: 2, answers: [1], options: ['A', 'B', 'C', 'D'] }, () => 0),
  ]
  const distribution = getCorrectPositionDistribution(questions)

  assert.equal(Object.values(distribution).reduce((sum, count) => sum + count, 0), 2)
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

test('sampleWeighted does not repeat objectives when variants are available', () => {
  const questions = Object.keys(DOMAIN_META).flatMap((domain, domainIndex) =>
    Array.from({ length: 10 }, (_, objectiveIndex) =>
      Array.from({ length: 3 }, (_, variantIndex) => ({
        ...makeQuestion(domainIndex * 100 + objectiveIndex * 10 + variantIndex, domain),
        objectiveId: `${domain}-objective-${objectiveIndex}`,
        variant: variantIndex + 1,
      })),
    ).flat(),
  )

  const sample = sampleWeighted(questions, 20)

  assert.equal(sample.length, 20)
  assert.equal(new Set(sample.map(question => question.objectiveId)).size, sample.length)
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
