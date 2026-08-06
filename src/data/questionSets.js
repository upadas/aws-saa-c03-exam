import { proPracticeQuestions } from './proPracticeBank.js'
import { examBankQuestions, examForms } from './examBank.js'
import { PRACTICE_DOMAIN_PATTERN, PRACTICE_RESPONSE_PATTERN } from '../quizLogic.js'

// The original 1,250 template-generated questions were retired: their stems stated
// the requirement verbatim and their distractors came from 59 shared pool texts,
// so format cues (option length/punctuation) revealed answers without AWS knowledge.
// The app now runs entirely on hand-authored senior-level banks:
//   - proPracticeQuestions: 100 questions in 10 fixed practice sets
//   - examBankQuestions:    390 questions dealt into 6 fixed full-length forms
// Both enforce globally unique intents; no sibling or same-intent repeats per set/form.

export const questions = [...proPracticeQuestions, ...examBankQuestions]

function practiceSetQuestions(setIndex) {
  const setNumber = setIndex + 1
  const setQuestions = proPracticeQuestions.filter(question => question.practiceSet === setNumber)
  const intents = new Set()

  return PRACTICE_DOMAIN_PATTERN.map((domain, slotIndex) => {
    const question = setQuestions[slotIndex]
    if (!question || question.domain !== domain ||
        question.correctOptionIds.length !== PRACTICE_RESPONSE_PATTERN[slotIndex]) {
      throw new Error(`Practice set ${setNumber} slot ${slotIndex + 1} does not match the blueprint pattern.`)
    }
    if (intents.has(question.intentGroup)) {
      throw new Error(`Practice set ${setNumber} repeats intent ${question.intentGroup}.`)
    }
    intents.add(question.intentGroup)
    return question
  })
}

export const questionSets = Array.from({ length: 10 }, (_, index) => {
  const setNumber = index + 1
  const questionIds = practiceSetQuestions(index).map(question => question.id)

  return {
    id: `set-${setNumber}`,
    name: `Practice Set ${setNumber}`,
    description: 'Senior-level scenarios with single-answer, choose-two, and choose-three tradeoffs. No repeated intents within the set.',
    questionIds,
  }
})

export const fullLengthExams = examForms
