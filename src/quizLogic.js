export const DOMAIN_META = {
  'Secure Architectures': { short: 'Security', weight: 30 },
  'Resilient Architectures': { short: 'Resilience', weight: 26 },
  'High-Performing Architectures': { short: 'Performance', weight: 24 },
  'Cost-Optimized Architectures': { short: 'Cost', weight: 20 },
}

export const EXAM_QUESTION_COUNT = 65
export const EXAM_DURATION_SECONDS = 130 * 60
export const MIN_CORRECT_VARIANTS_FOR_MASTERY = 3

const SET_DOMAIN_COUNTS = {
  'Secure Architectures': 3,
  'Resilient Architectures': 3,
  'High-Performing Architectures': 2,
  'Cost-Optimized Architectures': 2,
}

export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function shuffleWithRandom(items, random = Math.random) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const item = copy[index]
    copy[index] = copy[swapIndex]
    copy[swapIndex] = item
  }
  return copy
}

export function makeOptionId(questionId, index) {
  return `${questionId}:option-${index}`
}

function isOptionRecord(option) {
  return option && typeof option === 'object' && Object.hasOwn(option, 'id')
}

function selectedToId(question, selected) {
  return typeof selected === 'number' ? makeOptionId(question.id, selected) : selected
}

function variantKey(question) {
  return question.variant ? `${question.objectiveId || question.id}:variant-${question.variant}` : String(question.id)
}

function objectiveKey(question) {
  return question.objectiveId || `question-${question.id}`
}

export function getOptionRecords(question) {
  const answerIds = new Set(
    (question.answers || []).map(answer => selectedToId(question, answer)),
  )

  return (question.options || []).map((option, index) => {
    if (isOptionRecord(option)) {
      return {
        id: option.id,
        text: option.text,
        originalIndex: option.originalIndex ?? index,
        correct: option.correct ?? answerIds.has(option.id),
        explanation: option.explanation || question.explanation,
      }
    }

    const id = makeOptionId(question.id, index)
    return {
      id,
      text: option,
      originalIndex: index,
      correct: answerIds.has(id),
      explanation: question.explanation,
    }
  })
}

export function correctOptionIds(question) {
  if (!question.options?.length) {
    return (question.answers || []).map(answer => selectedToId(question, answer))
  }

  return getOptionRecords(question)
    .filter(option => option.correct)
    .map(option => option.id)
}

export function createSessionQuestion(question, random = Math.random) {
  const options = shuffleWithRandom(getOptionRecords(question), random)
  return {
    ...question,
    prompt: question.prompt || question.question,
    options,
    answers: options.filter(option => option.correct).map(option => option.id),
    optionOrder: options.map(option => option.originalIndex),
  }
}

export function createSessionQuestions(questions, random = Math.random) {
  return questions.map(question => createSessionQuestion(question, random))
}

export function answerMatches(question, selected = []) {
  const expected = correctOptionIds(question).sort()
  const actual = selected.map(answer => selectedToId(question, answer)).sort()
  if (actual.length !== expected.length) return false
  return actual.every((value, index) => value === expected[index])
}

export function buildQuestionReview(question, selected = []) {
  const optionRecords = getOptionRecords(question)
  const selectedSet = new Set(selected.map(answer => selectedToId(question, answer)))
  const selectedLabels = optionRecords
    .filter(option => selectedSet.has(option.id))
    .map(option => option.text)
  const correctLabels = optionRecords.filter(option => option.correct).map(option => option.text)

  return {
    id: question.id,
    isCorrect: answerMatches(question, selected),
    isAnswered: selected.length > 0,
    selectedLabels,
    correctLabels,
    options: optionRecords.map(option => ({
      id: option.id,
      label: option.text,
      explanation: option.explanation,
      isSelected: selectedSet.has(option.id),
      isCorrect: option.correct,
    })),
  }
}

export function sampleWeighted(questions, count) {
  const domains = Object.keys(DOMAIN_META)
  const chosen = []
  const selectedObjectives = new Set()

  domains.forEach((domain, index) => {
    const quota = index === domains.length - 1
      ? count - chosen.length
      : Math.round(count * DOMAIN_META[domain].weight / 100)
    const pool = shuffle(questions.filter(question => question.domain === domain))
    const picked = []

    for (const question of pool) {
      const objectiveId = objectiveKey(question)
      if (selectedObjectives.has(objectiveId)) continue
      picked.push(question)
      selectedObjectives.add(objectiveId)
      if (picked.length === quota) break
    }

    chosen.push(...picked)
  })

  if (chosen.length < count) {
    const ids = new Set(chosen.map(question => question.id))
    const fallback = []

    for (const question of shuffle(questions.filter(question => !ids.has(question.id)))) {
      const objectiveId = objectiveKey(question)
      if (selectedObjectives.has(objectiveId)) continue
      fallback.push(question)
      selectedObjectives.add(objectiveId)
      if (fallback.length === count - chosen.length) break
    }

    chosen.push(...fallback)
  }

  return shuffle(chosen).slice(0, count)
}

export function selectAdaptiveQuestions(questions, progress = {}, count = 10, filters = {}, random = Math.random) {
  const allowRepeatedObjectives = Boolean(filters.allowRepeatedObjectives)
  const eligible = questions.filter(question => {
    const domainMatch = !filters.domain || filters.domain === 'All' || question.domain === filters.domain
    const serviceMatch = !filters.service || filters.service === 'All' || question.services?.includes(filters.service) || question.service === filters.service
    const difficultyMatch = !filters.difficulty || filters.difficulty === 'All' || question.difficulty === filters.difficulty
    const objectiveMatch = !filters.objectiveIds?.length || filters.objectiveIds.includes(question.objectiveId)
    const missedMatch = !filters.missedOnly || progress[question.objectiveId]?.lastResult === 'incorrect' || progress[question.objectiveId]?.needsDrill
    const masteredMatch = !filters.masteredOnly || (progress[question.objectiveId]?.mastery || 0) >= 0.85
    return domainMatch && serviceMatch && difficultyMatch && objectiveMatch && missedMatch && masteredMatch
  })
  const remaining = [...eligible]
  const selected = []
  const selectedObjectives = new Set()

  while (selected.length < count && remaining.length) {
    const candidates = allowRepeatedObjectives
      ? remaining
      : remaining.filter(question => !selectedObjectives.has(objectiveKey(question)))

    if (!candidates.length) break

    const weighted = candidates.map(question => ({
      question,
      weight: adaptiveQuestionWeight(question, progress[question.objectiveId]),
    }))
    const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0)
    let cursor = random() * totalWeight
    let chosenIndex = 0

    for (let index = 0; index < weighted.length; index += 1) {
      cursor -= weighted[index].weight
      if (cursor <= 0) {
        chosenIndex = index
        break
      }
    }

    const chosenQuestion = weighted[chosenIndex].question
    selected.push(chosenQuestion)
    selectedObjectives.add(objectiveKey(chosenQuestion))
    remaining.splice(remaining.indexOf(chosenQuestion), 1)
  }

  if (selected.length < count && filters.missedOnly) {
    const selectedIds = new Set(selected.map(question => question.id))
    selected.push(
      ...selectAdaptiveQuestions(
        questions.filter(question => !selectedIds.has(question.id)),
        progress,
        count - selected.length,
        { ...filters, missedOnly: false },
        random,
      ),
    )
  }

  return selected
}

export function adaptiveQuestionWeight(question, objectiveProgress = {}) {
  const seenQuestionIds = new Set(objectiveProgress.seenQuestionIds || [])
  const correctVariantIds = new Set(objectiveProgress.correctVariantIds || [])
  const attempts = objectiveProgress.attempts || 0
  const mastery = objectiveProgress.mastery || 0
  const minimumCorrectVariants = question.adaptive?.minimumCorrectVariantsForMastery ||
    objectiveProgress.minimumCorrectVariantsForMastery ||
    MIN_CORRECT_VARIANTS_FOR_MASTERY
  const missWeight = question.adaptive?.masteryWeightOnMiss || 2
  const correctWeight = question.adaptive?.masteryWeightOnCorrect || 0.65
  const hasSeenExactQuestion = seenQuestionIds.has(question.id)
  const hasCorrectVariant = correctVariantIds.has(variantKey(question))
  let weight = 1

  if (!attempts) weight += 3
  if (attempts && mastery < 0.65) weight += (1 - mastery) * 3
  if (objectiveProgress.lastResult === 'incorrect') weight += missWeight * 4
  if (objectiveProgress.needsDrill && objectiveProgress.lastResult !== 'incorrect') weight += missWeight * 2
  if ((objectiveProgress.consecutiveCorrect || 0) === 1 && correctVariantIds.size < minimumCorrectVariants) weight += 2
  if (!hasSeenExactQuestion) weight += 3
  if (hasSeenExactQuestion) weight *= 0.35
  if (hasCorrectVariant) weight *= correctWeight
  if (correctVariantIds.size >= minimumCorrectVariants) weight *= 0.25
  if (objectiveProgress.lastAttemptAt) {
    const daysSinceAttempt = (Date.now() - Date.parse(objectiveProgress.lastAttemptAt)) / 86400000
    if (daysSinceAttempt > 14) weight += 1.25
  }

  return Math.max(weight, 0.2)
}

export function updateObjectiveProgress(progress = {}, sessionQuestions = [], answers = {}, timestamp = new Date().toISOString()) {
  const next = { ...progress }

  sessionQuestions.forEach(question => {
    const objectiveId = question.objectiveId || `question-${question.id}`
    const previous = next[objectiveId] || {
      objectiveId,
      objectiveName: question.objectiveName || question.services?.join(' + ') || 'Architecture objective',
      domain: question.domain,
      attempts: 0,
      correct: 0,
      consecutiveCorrect: 0,
      seenQuestionIds: [],
      correctVariantIds: [],
      misses: 0,
      needsDrill: false,
      minimumCorrectVariantsForMastery: question.adaptive?.minimumCorrectVariantsForMastery || MIN_CORRECT_VARIANTS_FOR_MASTERY,
      mastery: 0,
    }
    const isCorrect = answerMatches(question, answers[question.id] || [])
    const attempts = previous.attempts + 1
    const correct = previous.correct + (isCorrect ? 1 : 0)
    const misses = (previous.misses || 0) + (isCorrect ? 0 : 1)
    const consecutiveCorrect = isCorrect ? previous.consecutiveCorrect + 1 : 0
    const seenQuestionIds = [...new Set([...(previous.seenQuestionIds || []), question.id])]
    const correctVariantIds = [
      ...new Set([
        ...(previous.correctVariantIds || []),
        ...(isCorrect ? [variantKey(question)] : []),
      ]),
    ]
    const minimumCorrectVariantsForMastery = question.adaptive?.minimumCorrectVariantsForMastery ||
      previous.minimumCorrectVariantsForMastery ||
      MIN_CORRECT_VARIANTS_FOR_MASTERY
    const accuracy = correct / attempts
    const streakScore = Math.min(consecutiveCorrect, 3) / 3
    const variantScore = Math.min(correctVariantIds.length, minimumCorrectVariantsForMastery) / minimumCorrectVariantsForMastery
    const rawMastery = accuracy * 0.55 + streakScore * 0.2 + variantScore * 0.25
    const mastery = correctVariantIds.length >= minimumCorrectVariantsForMastery
      ? Math.min(1, rawMastery)
      : Math.min(0.84, rawMastery)
    const roundedMastery = Math.round(mastery * 100) / 100
    const needsDrill = (misses > 0 || previous.needsDrill) && roundedMastery < 0.85

    next[objectiveId] = {
      ...previous,
      objectiveId,
      objectiveName: previous.objectiveName || question.objectiveName,
      domain: previous.domain || question.domain,
      attempts,
      correct,
      misses,
      consecutiveCorrect,
      lastAttemptAt: timestamp,
      lastResult: isCorrect ? 'correct' : 'incorrect',
      seenQuestionIds,
      correctVariantIds,
      needsDrill,
      minimumCorrectVariantsForMastery,
      mastery: roundedMastery,
    }
  })

  return next
}

export function buildSessionResult(session) {
  const date = new Date().toISOString()
  const correct = session.questions.filter(question => answerMatches(question, session.answers[question.id] || [])).length
  const objectiveGroups = new Map()

  session.questions.forEach(question => {
    const objectiveId = question.objectiveId || `question-${question.id}`
    const current = objectiveGroups.get(objectiveId) || {
      objectiveId,
      objectiveName: question.objectiveName || question.services?.join(' + ') || 'Architecture objective',
      domain: question.domain,
      correct: 0,
      total: 0,
      questionIds: [],
    }
    current.total += 1
    current.questionIds.push(question.id)
    if (answerMatches(question, session.answers[question.id] || [])) current.correct += 1
    objectiveGroups.set(objectiveId, current)
  })

  return {
    id: session.id,
    date,
    mode: session.mode,
    correct,
    total: session.questions.length,
    domains: Object.keys(DOMAIN_META).map(domain => {
      const qs = session.questions.filter(question => question.domain === domain)
      return {
        domain,
        correct: qs.filter(question => answerMatches(question, session.answers[question.id] || [])).length,
        total: qs.length,
      }
    }),
    objectives: [...objectiveGroups.values()],
  }
}

export function getCorrectPositionDistribution(questions) {
  return questions.reduce((distribution, question) => {
    getOptionRecords(question).forEach((option, index) => {
      if (!option.correct) return
      const letter = String.fromCharCode(65 + index)
      distribution[letter] = (distribution[letter] || 0) + 1
    })
    return distribution
  }, {})
}

export function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

export function validateQuestionSets(questionSets, questions) {
  const questionById = new Map(questions.map(question => [question.id, question]))
  const issues = []

  if (questionSets.length !== 10) {
    issues.push(`Expected 10 question sets, found ${questionSets.length}.`)
  }

  questionSets.forEach(set => {
    if (set.questionIds.length !== 10) {
      issues.push(`${set.name} should contain 10 questions.`)
      return
    }

    const counts = Object.fromEntries(Object.keys(DOMAIN_META).map(domain => [domain, 0]))
    const objectiveIds = new Set()
    set.questionIds.forEach(id => {
      const question = questionById.get(id)
      if (!question) {
        issues.push(`${set.name} references missing question ${id}.`)
        return
      }
      const objectiveId = objectiveKey(question)
      if (objectiveIds.has(objectiveId)) {
        issues.push(`${set.name} repeats objective ${objectiveId}.`)
      }
      objectiveIds.add(objectiveId)
      counts[question.domain] += 1
    })

    Object.entries(SET_DOMAIN_COUNTS).forEach(([domain, expected]) => {
      if (counts[domain] !== expected) {
        issues.push(`${set.name} should include ${expected} ${domain} questions.`)
      }
    })
  })

  return issues
}
