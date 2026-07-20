import { generatedQuestions } from '../../aws-saa-c03-phase1-4/phase4_question_bank_1250.js'

const generatedDomainToAppDomain = {
  Security: 'Secure Architectures',
  Resilience: 'Resilient Architectures',
  Performance: 'High-Performing Architectures',
  Cost: 'Cost-Optimized Architectures',
}

const domainSetCounts = {
  'Secure Architectures': 3,
  'Resilient Architectures': 3,
  'High-Performing Architectures': 2,
  'Cost-Optimized Architectures': 2,
}

function normalizeQuestion(item) {
  const domain = generatedDomainToAppDomain[item.domain] || item.domain
  const correctOptionIds = item.correctOptionIds || item.options
    .filter(option => option.correct)
    .map(option => option.id)

  return {
    id: item.id,
    objectiveId: item.objectiveId,
    objectiveName: `${item.service}: ${item.trigger}`,
    variant: item.variant,
    domain,
    sourceDomain: item.domain,
    service: item.service,
    difficulty: item.difficulty,
    type: item.type === 'multiple-answer' ? 'multiple' : 'single',
    question: item.text,
    options: item.options.map((option, index) => ({
      id: option.id,
      text: option.text,
      originalIndex: index,
      correct: Boolean(option.correct),
      explanation: option.explanation,
    })),
    answers: correctOptionIds,
    correctOptionIds,
    answerSummary: item.answerSummary,
    explanation: item.explanation,
    trigger: item.trigger,
    adaptive: item.adaptive,
    services: [item.service],
    tags: [
      item.domain,
      item.service,
      item.difficulty,
      item.objectiveId,
      `variant-${item.variant}`,
      item.trigger,
      item.sourceType,
    ].filter(Boolean),
  }
}

export const questions = generatedQuestions.map(normalizeQuestion)

const questionsByDomain = Object.fromEntries(
  Object.keys(domainSetCounts).map(domain => [
    domain,
    questions.filter(question => question.domain === domain),
  ]),
)

export const questionSets = Array.from({ length: 10 }, (_, index) => {
  const setNumber = index + 1
  const questionIds = Object.entries(domainSetCounts).flatMap(([domain, count]) => (
    questionsByDomain[domain]
      .slice(index * count, index * count + count)
      .map(question => question.id)
  ))

  return {
    id: `set-${setNumber}`,
    name: `Practice Set ${setNumber}`,
    description: '10 original scenario variants weighted close to the SAA-C03 blueprint.',
    questionIds,
  }
})
