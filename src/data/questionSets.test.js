import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { questions, questionSets } from './questionSets.js'
import {
  DOMAIN_META,
  answerMatches,
  createSessionQuestion,
  getCorrectPositionDistribution,
  validateQuestionSets,
} from '../quizLogic.js'

const qaReport = JSON.parse(
  fs.readFileSync(new URL('../../aws-saa-c03-phase1-4/QA_REPORT.json', import.meta.url), 'utf8'),
)

test('question bank imports the complete phase 1-4 handoff bank', () => {
  assert.equal(questions.length, qaReport.variant_question_count)
  assert.equal(new Set(questions.map(question => question.objectiveId)).size, qaReport.objective_count)
  assert.equal(questionSets.length, 10)
  assert.deepEqual(validateQuestionSets(questionSets, questions), [])
})

test('questions preserve objective, variant, adaptive, and answer metadata', () => {
  const ids = new Set()

  questions.forEach(question => {
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

  assert.equal(ids.size, questions.length)
})

test('each objective has exactly five variants', () => {
  const variantsByObjective = questions.reduce((map, question) => {
    const variants = map.get(question.objectiveId) || new Set()
    variants.add(question.variant)
    map.set(question.objectiveId, variants)
    return map
  }, new Map())

  variantsByObjective.forEach((variants, objectiveId) => {
    assert.deepEqual([...variants].sort(), [1, 2, 3, 4, 5], `${objectiveId} should have five variants`)
  })
})

test('domain and difficulty distributions still match the QA report', () => {
  const domainDistribution = questions.reduce((distribution, question) => {
    const shortDomain = DOMAIN_META[question.domain].short
    distribution[shortDomain] = (distribution[shortDomain] || 0) + 1
    return distribution
  }, {})
  const difficultyDistribution = questions.reduce((distribution, question) => {
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

test('question bank includes single, choose-two, and choose-three items', () => {
  const typeCounts = questions.reduce((counts, question) => {
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

test('session shuffling keeps generated correct option ids answerable', () => {
  const sessionQuestion = createSessionQuestion(questions[0], () => 0.42)

  assert.equal(sessionQuestion.options.length, 4)
  assert.equal(answerMatches(sessionQuestion, sessionQuestion.answers), true)
  assert.equal(new Set(sessionQuestion.options.map(option => option.id)).size, 4)
})
