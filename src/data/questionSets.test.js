import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fullLengthExams, generatedBankQuestions, questions, questionSets } from './questionSets.js'
import { proPracticeQuestions } from './proPracticeBank.js'
import { PRACTICE_DOMAIN_PATTERN, PRACTICE_RESPONSE_PATTERN } from '../quizLogic.js'
import {
  DOMAIN_META,
  EXAM_DOMAIN_COUNTS,
  PRACTICE_RESPONSE_COUNTS,
  answerMatches,
  createSessionQuestion,
  getCorrectPositionDistribution,
  validateFullLengthExams,
  validateQuestionSets,
} from '../quizLogic.js'

const qaReport = JSON.parse(
  fs.readFileSync(new URL('../../aws-saa-c03-phase1-4/QA_REPORT.json', import.meta.url), 'utf8'),
)

test('question bank imports the complete phase 1-4 handoff bank plus the pro practice bank', () => {
  assert.equal(generatedBankQuestions.length, qaReport.variant_question_count)
  assert.equal(questions.length, qaReport.variant_question_count + proPracticeQuestions.length)
  assert.equal(new Set(generatedBankQuestions.map(question => question.objectiveId)).size, qaReport.objective_count)
  assert.equal(questionSets.length, 10)
  assert.equal(fullLengthExams.length, 6)
  assert.deepEqual(validateQuestionSets(questionSets, questions), [])
  assert.deepEqual(validateFullLengthExams(fullLengthExams, questions), [])
})

test('generated questions preserve objective, variant, adaptive, and answer metadata', () => {
  const ids = new Set()

  generatedBankQuestions.forEach(question => {
    ids.add(question.id)
    assert.ok(Object.hasOwn(DOMAIN_META, question.domain), `${question.id} has unsupported domain`)
    assert.match(question.difficulty, /^(Easy|Medium|Hard)$/)
    assert.match(question.type, /^(single|multiple)$/)
    assert.ok(question.question.length > 80, `${question.id} should be scenario-based`)
    assert.match(question.objectiveId, /^SAA-\d{3}$/)
    assert.ok(question.objectiveName.length > 10, `${question.id} should have an objective name`)
    assert.ok(question.variant >= 1 && question.variant <= 5, `${question.id} should keep its variant number`)
    assert.ok(question.options.length >= 4, `${question.id} should have at least four options`)
    assert.ok(question.correctOptionIds.length >= 1 && question.correctOptionIds.length <= 3, `${question.id} should have one to three correct options`)
    assert.deepEqual(question.answers, question.correctOptionIds)
    assert.ok(question.sourceCorrectOptionIds.length >= 1, `${question.id} should preserve source correct option ids`)
    assert.ok(question.explanation.length > 20, `${question.id} should explain the answer`)
    assert.equal(question.services.length, 1, `${question.id} should preserve the service`)
    assert.equal(question.adaptive.minimumCorrectVariantsForMastery, 3)
    assert.equal(question.adaptive.masteryWeightOnMiss, 2)
    assert.equal(question.adaptive.masteryWeightOnCorrect, 0.65)

    const optionCorrectIds = question.options
      .filter(option => option.correct)
      .map(option => option.id)

    assert.deepEqual(optionCorrectIds, question.correctOptionIds)
    question.options.forEach(option => {
      assert.ok(option.id, `${question.id} option should keep an id`)
      assert.ok(option.text.length > 5, `${question.id} option should keep text`)
      assert.ok(option.explanation.length > 20, `${question.id} option should keep an explanation`)
    })
    assert.equal(answerMatches(question, question.correctOptionIds), true)
    assert.equal(answerMatches(question, []), false)
  })

  assert.equal(ids.size, generatedBankQuestions.length)
})

test('each generated objective has exactly five variants', () => {
  const variantsByObjective = generatedBankQuestions.reduce((map, question) => {
    const variants = map.get(question.objectiveId) || new Set()
    variants.add(question.variant)
    map.set(question.objectiveId, variants)
    return map
  }, new Map())

  variantsByObjective.forEach((variants, objectiveId) => {
    assert.deepEqual([...variants].sort(), [1, 2, 3, 4, 5], `${objectiveId} should have five variants`)
  })
})

test('generated domain and difficulty distributions still match the QA report', () => {
  const domainDistribution = generatedBankQuestions.reduce((distribution, question) => {
    const shortDomain = DOMAIN_META[question.domain].short
    distribution[shortDomain] = (distribution[shortDomain] || 0) + 1
    return distribution
  }, {})
  const difficultyDistribution = generatedBankQuestions.reduce((distribution, question) => {
    distribution[question.difficulty] = (distribution[question.difficulty] || 0) + 1
    return distribution
  }, {})

  assert.deepEqual(domainDistribution, qaReport.domain_distribution)
  assert.deepEqual(difficultyDistribution, qaReport.difficulty_distribution)
  assert.equal(
    Object.values(getCorrectPositionDistribution(questions)).reduce((sum, count) => sum + count, 0),
    questions.reduce((sum, question) => sum + question.correctOptionIds.length, 0),
  )
})

test('normal practice sets do not repeat the same objective', () => {
  questionSets.forEach(set => {
    const setQuestions = set.questionIds.map(id => questions.find(question => question.id === id))
    assert.equal(new Set(setQuestions.map(question => question.objectiveId)).size, setQuestions.length)
  })
})

test('normal practice sets mix single, choose-two, and choose-three questions without clustering services', () => {
  questionSets.forEach(set => {
    const setQuestions = set.questionIds.map(id => questions.find(question => question.id === id))
    const responseCounts = setQuestions.reduce((counts, question) => ({
      ...counts,
      [question.correctOptionIds.length]: (counts[question.correctOptionIds.length] || 0) + 1,
    }), {})
    const services = new Set(setQuestions.map(question => question.service))

    assert.deepEqual(responseCounts, PRACTICE_RESPONSE_COUNTS)
    assert.equal(services.size, setQuestions.length, `${set.name} should spread services instead of repeating the same topic cluster`)
  })
})

test('generated question bank includes single, choose-two, and choose-three items', () => {
  const typeCounts = generatedBankQuestions.reduce((counts, question) => {
    const key = question.correctOptionIds.length === 3
      ? 'chooseThree'
      : question.correctOptionIds.length === 2
        ? 'chooseTwo'
        : 'single'
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})

  assert.deepEqual(typeCounts, {
    single: 750,
    chooseTwo: 250,
    chooseThree: 250,
  })
})

test('full-length exam forms follow the exam guide distribution without exact question reuse', () => {
  const allExamQuestionIds = fullLengthExams.flatMap(exam => exam.questionIds)
  assert.equal(new Set(allExamQuestionIds).size, allExamQuestionIds.length)

  fullLengthExams.forEach(exam => {
    const examQuestions = exam.questionIds.map(id => questions.find(question => question.id === id))
    const domainCounts = examQuestions.reduce((counts, question) => ({
      ...counts,
      [question.domain]: (counts[question.domain] || 0) + 1,
    }), {})

    assert.equal(examQuestions.length, 65)
    assert.equal(new Set(examQuestions.map(question => question.objectiveId)).size, examQuestions.length)
    assert.deepEqual(domainCounts, EXAM_DOMAIN_COUNTS)
    assert.ok(examQuestions.some(question => question.correctOptionIds.length === 2))
    assert.ok(examQuestions.some(question => question.correctOptionIds.length === 3))
  })
})

test('generated question bank displays exam-style compound scenarios and nuanced distractors', () => {
  const averagePromptLength = generatedBankQuestions.reduce((sum, question) => sum + question.question.length, 0) / generatedBankQuestions.length
  const multiAnswerQuestions = generatedBankQuestions.filter(question => question.correctOptionIds.length > 1)
  const hardQuestions = generatedBankQuestions.filter(question => question.difficulty === 'Hard')
  const nuancedDistractorQuestions = generatedBankQuestions.filter(question => question.options.some(option => (
    !option.correct
      && /\b(even though|assuming|without|instead of|only|bypassing|omitting|leaving|relying)\b/i.test(option.text)
  )))
  const s3EndpointQuestion = generatedBankQuestions.find(question => question.id === 'Q-SAA-031-5')
  const transferAccelerationQuestion = generatedBankQuestions.find(question => question.id === 'Q-SAA-102-5')

  assert.ok(averagePromptLength > 700, 'questions should read like scenario stems, not flashcards')
  assert.ok(
    multiAnswerQuestions.every(question => question.question.length > 650),
    'multi-answer variants should include compound scenario constraints',
  )
  assert.ok(
    hardQuestions.every(question => /proof of concept|production readiness|failure path/i.test(question.question)),
    'hard variants should include production-readiness tradeoffs',
  )
  assert.ok(
    nuancedDistractorQuestions.length > generatedBankQuestions.length * 0.75,
    'most questions should contain at least one plausible near-miss distractor',
  )
  assert.match(s3EndpointQuestion.question, /gateway endpoint and route-table update/i)
  assert.match(transferAccelerationQuestion.question, /accelerate endpoint|multipart upload/i)
})

test('session shuffling keeps generated correct option ids answerable', () => {
  const sessionQuestion = createSessionQuestion(questions[0], () => 0.42)

  assert.equal(sessionQuestion.options.length, 4)
  assert.equal(answerMatches(sessionQuestion, sessionQuestion.answers), true)
  assert.equal(new Set(sessionQuestion.options.map(option => option.id)).size, 4)
})

test('pro practice bank contains 100 well-formed senior-level questions', () => {
  assert.equal(proPracticeQuestions.length, 100)
  const ids = new Set()
  const expectedOptionCount = { 1: 4, 2: 5, 3: 6 }

  proPracticeQuestions.forEach(question => {
    ids.add(question.id)
    assert.match(question.id, /^PRO-\d{3}$/)
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
  })

  assert.equal(ids.size, 100)
  const hardCount = proPracticeQuestions.filter(question => question.difficulty === 'Hard').length
  assert.ok(hardCount >= 60, 'pro bank should stay predominantly Hard')
})

test('practice sets use the pro bank, follow the blueprint pattern, and never repeat an intent in a set', () => {
  const byId = new Map(questions.map(question => [question.id, question]))

  questionSets.forEach((set, setIndex) => {
    const setQuestions = set.questionIds.map(id => byId.get(id))
    const intents = new Set()

    setQuestions.forEach((question, slotIndex) => {
      assert.match(question.id, /^PRO-\d{3}$/, `${set.name} should draw from the pro bank`)
      assert.equal(question.practiceSet, setIndex + 1)
      assert.equal(question.domain, PRACTICE_DOMAIN_PATTERN[slotIndex])
      assert.equal(question.correctOptionIds.length, PRACTICE_RESPONSE_PATTERN[slotIndex])
      assert.ok(!intents.has(question.intentGroup), `${set.name} repeats intent ${question.intentGroup}`)
      intents.add(question.intentGroup)
    })
  })
})
