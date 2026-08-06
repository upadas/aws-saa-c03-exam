const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const pageSize = 1000

function appUrl(path, offset = 0) {
  const separator = path.includes('?') ? '&' : '?'
  return `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${path}${separator}limit=${pageSize}&offset=${offset}`
}

function headers() {
  return {
    apikey: supabaseAnonKey,
    authorization: `Bearer ${supabaseAnonKey}`,
    accept: 'application/json',
  }
}

async function fetchJson(path, rangeStart = 0) {
  const response = await fetch(appUrl(path, rangeStart), { headers: headers() })

  if (!response.ok) {
    throw new Error(`Supabase request failed for ${path}: ${response.status}`)
  }

  return response.json()
}

async function fetchAll(path) {
  const rows = []
  let offset = 0

  while (true) {
    const page = await fetchJson(path, offset)
    rows.push(...page)
    if (page.length < pageSize) return rows
    offset += pageSize
  }
}

function sortByPosition(left, right) {
  return left.position - right.position
}

function sortByNumericSuffix(left, right) {
  const leftNumber = Number(String(left.id).match(/\d+$/)?.[0] || 0)
  const rightNumber = Number(String(right.id).match(/\d+$/)?.[0] || 0)
  return leftNumber - rightNumber || String(left.id).localeCompare(String(right.id))
}

function normalizeRemoteQuestion(row) {
  const options = (row.options || []).map((option, index) => ({
    id: option.id,
    text: option.text,
    originalIndex: option.originalIndex ?? index,
    correct: Boolean(option.correct),
    explanation: option.explanation || row.explanation,
  }))
  const correctOptionIds = options.filter(option => option.correct).map(option => option.id)

  return {
    id: row.id,
    objectiveId: row.objective_id,
    objectiveName: row.objective_name,
    domain: row.domain,
    service: row.service,
    difficulty: row.difficulty,
    type: row.type,
    question: row.question,
    prompt: row.question,
    answerSummary: row.answer_summary,
    explanation: row.explanation,
    trigger: row.trigger,
    variant: row.variant,
    services: row.services || [row.service],
    tags: row.tags || [],
    sourceDomain: row.source_domain,
    sourceCorrectOptionIds: row.source_correct_option_ids || correctOptionIds,
    adaptive: row.adaptive || {},
    options,
    answers: correctOptionIds,
    correctOptionIds,
  }
}

function groupQuestionIds(rows, parentKey) {
  return rows.reduce((map, row) => {
    const list = map.get(row[parentKey]) || []
    list.push(row)
    map.set(row[parentKey], list)
    return map
  }, new Map())
}

function normalizePracticeSets(sets, memberships) {
  const idsBySet = groupQuestionIds(memberships, 'set_id')

  return sets.map(set => ({
    id: set.set_id,
    name: set.name,
    description: set.description,
    questionIds: (idsBySet.get(set.set_id) || [])
      .sort(sortByPosition)
      .map(row => row.question_id),
  })).sort(sortByNumericSuffix)
}

function normalizeFullLengthExams(exams, memberships) {
  const idsByExam = groupQuestionIds(memberships, 'exam_id')

  return exams.map(exam => ({
    id: exam.exam_id,
    name: exam.name,
    description: exam.description,
    questionIds: (idsByExam.get(exam.exam_id) || [])
      .sort(sortByPosition)
      .map(row => row.question_id),
  })).sort(sortByNumericSuffix)
}

async function loadFromSupabase() {
  const [
    questionRows,
    practiceSets,
    practiceMemberships,
    examForms,
    examMemberships,
  ] = await Promise.all([
    fetchAll('saa_question_bank?select=*&order=id.asc'),
    fetchAll('saa_practice_sets?select=*&order=set_id.asc'),
    fetchAll('saa_practice_set_questions?select=*&order=set_id.asc,position.asc'),
    fetchAll('saa_exam_forms?select=*&order=exam_id.asc'),
    fetchAll('saa_exam_form_questions?select=*&order=exam_id.asc,position.asc'),
  ])

  return {
    source: 'supabase',
    questions: questionRows.map(normalizeRemoteQuestion),
    questionSets: normalizePracticeSets(practiceSets, practiceMemberships),
    fullLengthExams: normalizeFullLengthExams(examForms, examMemberships),
  }
}

async function loadLocalBank() {
  const bank = await import('./questionSets')
  return {
    source: 'local',
    questions: bank.questions,
    questionSets: bank.questionSets,
    fullLengthExams: bank.fullLengthExams,
  }
}

export async function loadQuestionBank() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return loadLocalBank()
  }

  try {
    return await loadFromSupabase()
  } catch (error) {
    console.warn('Falling back to local question bank.', error)
    return loadLocalBank()
  }
}
