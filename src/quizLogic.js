export const DOMAIN_META = {
  'Secure Architectures': { short: 'Security', weight: 30 },
  'Resilient Architectures': { short: 'Resilience', weight: 26 },
  'High-Performing Architectures': { short: 'Performance', weight: 24 },
  'Cost-Optimized Architectures': { short: 'Cost', weight: 20 },
}

export const EXAM_QUESTION_COUNT = 65
export const EXAM_DURATION_SECONDS = 130 * 60

const SET_DOMAIN_COUNTS = {
  'Secure Architectures': 3,
  'Resilient Architectures': 3,
  'High-Performing Architectures': 2,
  'Cost-Optimized Architectures': 2,
}

export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function answerMatches(question, selected = []) {
  if (selected.length !== question.answers.length) return false
  const expected = [...question.answers].sort((a, b) => a - b)
  const actual = [...selected].sort((a, b) => a - b)
  return actual.every((value, index) => value === expected[index])
}

export function sampleWeighted(questions, count) {
  const domains = Object.keys(DOMAIN_META)
  const chosen = []

  domains.forEach((domain, index) => {
    const quota = index === domains.length - 1
      ? count - chosen.length
      : Math.round(count * DOMAIN_META[domain].weight / 100)
    const pool = shuffle(questions.filter(question => question.domain === domain))
    chosen.push(...pool.slice(0, Math.min(quota, pool.length)))
  })

  if (chosen.length < count) {
    const ids = new Set(chosen.map(question => question.id))
    chosen.push(...shuffle(questions.filter(question => !ids.has(question.id))).slice(0, count - chosen.length))
  }

  return shuffle(chosen).slice(0, count)
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
    set.questionIds.forEach(id => {
      const question = questionById.get(id)
      if (!question) {
        issues.push(`${set.name} references missing question ${id}.`)
        return
      }
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
