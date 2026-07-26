import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, Award, BookOpen, Check, CheckCircle2, ChevronLeft,
  ChevronRight, Cloud, Flag, LayoutDashboard, ListChecks, RotateCcw, Search,
  ShieldCheck, Sparkles, Target, Timer, XCircle,
} from 'lucide-react'
import { loadQuestionBank } from './data/questionBankSource'
import {
  DOMAIN_META,
  EXAM_DURATION_SECONDS,
  PRACTICE_DOMAIN_PATTERN,
  PRACTICE_RESPONSE_PATTERN,
  answerMatches,
  buildQuestionReview,
  buildSessionResult,
  createSessionQuestions,
  formatTime,
  getOptionRecords,
  sampleWeighted,
  selectAdaptiveQuestions,
  updateObjectiveProgress,
} from './quizLogic'
import './styles.css'

const storageSchemaVersion = 3
const questionBankVersion = 'saa-c03-1250-compound-practice-v2'
const storageKey = 'saa-c03-progress-v2'
const legacyStorageKey = 'saa-c03-progress-v1'

const defaultSaved = {
  schemaVersion: storageSchemaVersion,
  questionBankVersion,
  attempts: [],
  mastered: [],
  objectiveProgress: {},
  completedSessions: [],
  activeSession: null,
}

function allowsRepeatedObjectives(session) {
  return session?.mode === 'missed' || session?.mode === 'objective'
}

function hasRepeatedObjectives(session) {
  if (!session?.questions?.length || allowsRepeatedObjectives(session)) return false
  const seen = new Set()

  return session.questions.some(question => {
    const objectiveId = question.objectiveId || question.id
    if (seen.has(objectiveId)) return true
    seen.add(objectiveId)
    return false
  })
}

function normalizeSaved(value) {
  const isCompatible = value?.schemaVersion === storageSchemaVersion &&
    value?.questionBankVersion === questionBankVersion
  const activeSession = isCompatible && !hasRepeatedObjectives(value?.activeSession)
    ? value?.activeSession || null
    : null

  return {
    ...defaultSaved,
    ...(value || {}),
    schemaVersion: storageSchemaVersion,
    questionBankVersion,
    attempts: Array.isArray(value?.attempts) ? value.attempts : [],
    mastered: Array.isArray(value?.mastered) ? value.mastered : [],
    objectiveProgress: value?.objectiveProgress || {},
    completedSessions: Array.isArray(value?.completedSessions) ? value.completedSessions : [],
    activeSession,
  }
}

function loadSaved() {
  try {
    const current = localStorage.getItem(storageKey)
    if (current) return normalizeSaved(JSON.parse(current))
    const legacy = localStorage.getItem(legacyStorageKey)
    if (legacy) return normalizeSaved(JSON.parse(legacy))
  } catch {
    return defaultSaved
  }
  return defaultSaved
}

function App() {
  const [initialSaved] = useState(loadSaved)
  const [bank, setBank] = useState(null)
  const [bankStatus, setBankStatus] = useState('loading')
  const [view, setView] = useState(() => (
    initialSaved.activeSession?.result ? 'result' : initialSaved.activeSession ? 'quiz' : 'dashboard'
  ))
  const [bankQuery, setBankQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [objectiveFilter, setObjectiveFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [progressFilter, setProgressFilter] = useState('All')
  const [session, setSession] = useState(() => initialSaved.activeSession)
  const [saved, setSaved] = useState(() => initialSaved)
  const questions = bank?.questions || []
  const questionSets = bank?.questionSets || []
  const fullLengthExams = bank?.fullLengthExams || []

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ ...saved, activeSession: session }))
  }, [saved, session])

  useEffect(() => {
    let cancelled = false

    loadQuestionBank().then(loadedBank => {
      if (cancelled) return
      setBank(loadedBank)
      setBankStatus(loadedBank.source)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const questionById = useMemo(() => new Map(questions.map(question => [question.id, question])), [questions])
  const objectiveCount = useMemo(() => new Set(questions.map(question => question.objectiveId)).size, [questions])
  const mastered = new Set(saved.mastered)
  const objectiveProgress = saved.objectiveProgress || {}
  const progressList = Object.values(objectiveProgress)
  const latest = saved.attempts[0]
  const avg = saved.attempts.length
    ? Math.round(saved.attempts.reduce((sum, attempt) => sum + attempt.correct / attempt.total * 100, 0) / saved.attempts.length)
    : 0
  const weakObjectives = progressList
    .filter(item => item.attempts && (item.needsDrill || item.lastResult === 'incorrect' || item.mastery < 0.65))
    .sort((a, b) => (a.mastery || 0) - (b.mastery || 0))
    .slice(0, 4)
  const masteredObjectives = progressList.filter(item => item.mastery >= 0.85).length

  const startQuiz = (mode, count = 10, domain = 'All', questionList = null, options = {}) => {
    let list = questionList

    if (!list && mode === 'exam') {
      list = sampleWeighted(questions, Math.min(count, questions.length))
    } else if (!list && mode === 'missed') {
      list = selectAdaptiveQuestions(questions, objectiveProgress, count, { missedOnly: true, allowRepeatedObjectives: true })
    } else if (!list && mode === 'objective') {
      list = selectAdaptiveQuestions(questions, objectiveProgress, count, { objectiveIds: options.objectiveIds || [], allowRepeatedObjectives: true })
    } else if (!list) {
      list = selectAdaptiveQuestions(questions, objectiveProgress, count, {
        domain,
        domainPattern: domain === 'All' && count === PRACTICE_DOMAIN_PATTERN.length ? PRACTICE_DOMAIN_PATTERN : null,
        responsePattern: count === PRACTICE_RESPONSE_PATTERN.length ? PRACTICE_RESPONSE_PATTERN : null,
      })
    }

    const sessionQuestions = createSessionQuestions(list)
    setSession({
      id: `session-${Date.now()}`,
      mode,
      title: options.title || modeTitle(mode, domain),
      setId: options.setId || null,
      domain,
      questions: sessionQuestions,
      questionIds: sessionQuestions.map(question => question.id),
      optionOrders: Object.fromEntries(sessionQuestions.map(question => [question.id, question.optionOrder])),
      index: 0,
      answers: {},
      flagged: [],
      checked: {},
      startedAt: Date.now(),
      duration: mode === 'exam' ? EXAM_DURATION_SECONDS : null,
      result: null,
    })
    setView('quiz')
  }

  const startQuestionSet = set => {
    const list = set.questionIds.map(id => questionById.get(id)).filter(Boolean)
    startQuiz('set', list.length, 'All', list, { setId: set.id, title: set.name })
  }

  const startExamForm = exam => {
    const list = exam.questionIds.map(id => questionById.get(id)).filter(Boolean)
    startQuiz('exam', list.length, 'All', list, { setId: exam.id, title: exam.name })
  }

  const finishQuiz = () => {
    if (!session || session.result) return
    const result = buildSessionResult(session)
    setSaved(prev => ({
      ...prev,
      attempts: [result, ...prev.attempts].slice(0, 30),
      completedSessions: [
        { ...result, questionIds: session.questionIds, title: session.title },
        ...prev.completedSessions,
      ].slice(0, 30),
      objectiveProgress: updateObjectiveProgress(prev.objectiveProgress, session.questions, session.answers, result.date),
    }))
    setSession({ ...session, result, completedAt: result.date })
    setView('result')
  }

  if (!bank) {
    return <div className="app-shell">
      <Header view={view} setView={setView} questionCount={0} bankStatus={bankStatus} />
      <main><LoadingBank /></main>
    </div>
  }

  return <div className="app-shell">
    <Header view={view} setView={setView} questionCount={questions.length} bankStatus={bankStatus} />
    <main>
      {view === 'dashboard' && <Dashboard
        questions={questions}
        questionSets={questionSets}
        fullLengthExams={fullLengthExams}
        avg={avg}
        latest={latest}
        attempts={saved.attempts.length}
        masteredQuestions={mastered.size}
        masteredObjectives={masteredObjectives}
        objectiveCount={objectiveCount}
        weakObjectives={weakObjectives}
        startQuiz={startQuiz}
        startQuestionSet={startQuestionSet}
        startExamForm={startExamForm}
      />}
      {view === 'bank' && <QuestionBank
        questions={questions}
        query={bankQuery}
        setQuery={setBankQuery}
        domain={domainFilter}
        setDomain={setDomainFilter}
        service={serviceFilter}
        setService={setServiceFilter}
        objective={objectiveFilter}
        setObjective={setObjectiveFilter}
        difficulty={difficultyFilter}
        setDifficulty={setDifficultyFilter}
        progressFilter={progressFilter}
        setProgressFilter={setProgressFilter}
        mastered={mastered}
        objectiveProgress={objectiveProgress}
        setSaved={setSaved}
        startQuiz={startQuiz}
      />}
      {view === 'quiz' && session && <Quiz session={session} setSession={setSession} finishQuiz={finishQuiz} />}
      {view === 'result' && session?.result && <Results session={session} setView={setView} startQuiz={startQuiz} />}
      {view === 'review' && session?.result && <Review session={session} setView={setView} startQuiz={startQuiz} />}
    </main>
  </div>
}

function modeTitle(mode, domain) {
  if (mode === 'exam') return '65-question exam simulation'
  if (mode === 'missed') return 'Missed concepts'
  if (mode === 'objective') return 'Objective drill'
  if (domain && domain !== 'All') return `${DOMAIN_META[domain]?.short || domain} drill`
  return 'Quick adaptive practice'
}

function Header({ view, setView, questionCount, bankStatus }) {
  const sourceLabel = bankStatus === 'supabase' ? 'Supabase' : bankStatus === 'local' ? 'Local bank' : 'Loading'

  return <header className="topbar">
    <button className="brand" onClick={() => setView('dashboard')}>
      <span className="brand-mark"><Cloud size={23}/></span>
      <span><strong>Cloud Architect</strong><small>LAB / SAA-C03</small></span>
    </button>
    <nav>
      <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><LayoutDashboard size={17}/> Dashboard</button>
      <button className={view === 'bank' ? 'active' : ''} onClick={() => setView('bank')}><BookOpen size={17}/> Question bank</button>
    </nav>
    <div className="exam-pill"><span></span> {questionCount || '...'} original questions / {sourceLabel}</div>
  </header>
}

function LoadingBank() {
  return <div className="page loading-page">
    <div className="loading-panel">
      <span className="loading-mark"><Cloud size={28}/></span>
      <strong>Loading question bank</strong>
      <p>Preparing the SAA-C03 practice cockpit.</p>
    </div>
  </div>
}

function Dashboard({
  questions,
  questionSets,
  fullLengthExams,
  avg,
  latest,
  attempts,
  masteredQuestions,
  masteredObjectives,
  objectiveCount,
  weakObjectives,
  startQuiz,
  startQuestionSet,
  startExamForm,
}) {
  const latestPct = latest ? Math.round(latest.correct / latest.total * 100) : null
  const readiness = attempts ? Math.min(avg, 100) : Math.round(masteredObjectives / Math.max(objectiveCount, 1) * 100)

  return <div className="page dashboard cockpit-page">
    <section className="cockpit-shell">
      <aside className="study-rail">
        <div className="rail-label">Study plan</div>
        <div className="plan-card">
          <strong>65-question exam readiness</strong>
          <div className="meter"><span style={{ width: `${Math.max(readiness, attempts ? 0 : 8)}%` }}></span></div>
          <small>{attempts ? `${avg}% average across ${attempts} attempt${attempts > 1 ? 's' : ''}` : 'Complete a session to calibrate'}</small>
        </div>
        <div className="rail-list">
          <button onClick={() => startExamForm(fullLengthExams[0])}><Timer size={16}/><span>Exam Form 1</span><b>130m</b></button>
          <button onClick={() => startQuiz('practice', 10)}><Target size={16}/><span>Quick practice</span><b>10q</b></button>
          <button onClick={() => startQuiz('missed', 10)}><ListChecks size={16}/><span>Missed concepts</span><b>10q</b></button>
          <button onClick={() => startQuiz('practice', 10, 'Resilient Architectures')}><ShieldCheck size={16}/><span>Resilience drill</span><b>10q</b></button>
          <button onClick={() => startQuiz('practice', 10, 'Cost-Optimized Architectures')}><Award size={16}/><span>Cost drill</span><b>10q</b></button>
        </div>
      </aside>

      <section className="cockpit-main">
        <div className="cockpit-hero">
          <div>
            <div className="eyebrow"><Sparkles size={15}/> AWS CERTIFIED SOLUTIONS ARCHITECT - ASSOCIATE</div>
            <h1>Study cockpit for scenario practice.</h1>
            <p>{questions.length} original SAA-C03-style questions mapped to {objectiveCount} objectives, with adaptive variants and a 65-question exam simulation.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => startQuestionSet(questionSets[0])}><Target size={19}/> Start Set 1 <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => startExamForm(fullLengthExams[0])}><Timer size={19}/> Exam Form 1</button>
            </div>
          </div>
          <div className="score-tile">
            <span>Average score</span>
            <strong>{attempts ? `${avg}%` : '--'}</strong>
            <small>{latest ? `Latest ${latestPct}% (${latest.correct}/${latest.total})` : `${masteredObjectives}/${objectiveCount} objectives mastered`}</small>
          </div>
        </div>

        <section className="domain-strip">
          {Object.entries(DOMAIN_META).map(([name, meta]) =>
            <button className="domain-mini" key={name} onClick={() => startQuiz('practice', Math.min(10, questions.filter(q => q.domain === name).length), name)}>
              <span>{meta.short}</span>
              <strong>{meta.weight}%</strong>
              <small>{questions.filter(q => q.domain === name).length} questions</small>
              <div className="meter"><i style={{ width: `${meta.weight}%` }}></i></div>
            </button>
          )}
        </section>

        <section className="set-grid">
          {questionSets.map((set, index) =>
            <article className="set-card" key={set.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{set.name}</h3><p>{set.description}</p></div>
              <button onClick={() => startQuestionSet(set)}>Start set <ChevronRight size={16}/></button>
            </article>
          )}
        </section>

        <section className="set-grid">
          {fullLengthExams.map((exam, index) =>
            <article className="set-card" key={exam.id}>
              <span>E{index + 1}</span>
              <div><h3>{exam.name}</h3><p>{exam.description}</p></div>
              <button onClick={() => startExamForm(exam)}>Start exam <ChevronRight size={16}/></button>
            </article>
          )}
        </section>
      </section>

      <aside className="coach-panel">
        <div className="rail-label">Coach notes</div>
        <div className="coach-box">
          <h3>Adaptive engine</h3>
          <p>Missed objectives get boosted, and the next attempt prefers a different variant before repeating exact wording.</p>
        </div>
        <div className="coach-box">
          <h3>Progress</h3>
          <p>{masteredQuestions} questions marked mastered. Objective mastery now requires three correct variants and is tracked separately from manual overrides.</p>
        </div>
        <div className="coach-box">
          <h3>Weak objectives</h3>
          {weakObjectives.length ? weakObjectives.map(item =>
            <button className="weak-objective" key={item.objectiveId} onClick={() => startQuiz('objective', 10, 'All', null, { objectiveIds: [item.objectiveId], title: item.objectiveName })}>
              <span>{item.objectiveName}</span><b>{Math.round((item.mastery || 0) * 100)}%</b>
            </button>
          ) : <p>No weak objectives yet. Complete a practice session to unlock targeted drills.</p>}
        </div>
      </aside>
    </section>
  </div>
}

function QuestionBank({
  questions,
  query,
  setQuery,
  domain,
  setDomain,
  service,
  setService,
  objective,
  setObjective,
  difficulty,
  setDifficulty,
  progressFilter,
  setProgressFilter,
  mastered,
  objectiveProgress,
  setSaved,
  startQuiz,
}) {
  const [expandedIds, setExpandedIds] = useState([])
  const serviceOptions = useMemo(() => (
    [...new Set(questions.flatMap(question => question.services || []))].sort()
  ), [questions])
  const objectiveOptions = useMemo(() => (
    [...questions.reduce((map, question) => {
      if (!map.has(question.objectiveId)) {
        map.set(question.objectiveId, {
          objectiveId: question.objectiveId,
          objectiveName: question.objectiveName,
          domain: question.domain,
          service: question.services[0],
        })
      }
      return map
    }, new Map()).values()]
      .sort((a, b) => a.objectiveId.localeCompare(b.objectiveId))
  ), [questions])
  const filtered = questions.filter(question => {
    const state = objectiveProgress[question.objectiveId] || {}
    const isMastered = mastered.has(question.id) || (state.mastery || 0) >= 0.85
    const progressMatch = progressFilter === 'All' ||
      (progressFilter === 'Missed' && state.lastResult === 'incorrect') ||
      (progressFilter === 'Mastered' && isMastered) ||
      (progressFilter === 'Unseen' && !state.attempts)
    const haystack = `${question.question} ${question.objectiveName} ${question.services.join(' ')} ${question.tags.join(' ')}`.toLowerCase()
    return (domain === 'All' || question.domain === domain) &&
      (service === 'All' || question.services.includes(service)) &&
      (objective === 'All' || question.objectiveId === objective) &&
      (difficulty === 'All' || question.difficulty === difficulty) &&
      progressMatch &&
      haystack.includes(query.toLowerCase())
  })
  const startFilteredPractice = () => {
    const count = Math.min(10, filtered.length)
    const list = selectAdaptiveQuestions(filtered, objectiveProgress, count, {
      domainPattern: domain === 'All' && count === PRACTICE_DOMAIN_PATTERN.length ? PRACTICE_DOMAIN_PATTERN : null,
      responsePattern: count === PRACTICE_RESPONSE_PATTERN.length ? PRACTICE_RESPONSE_PATTERN : null,
    })
    if (list.length) startQuiz('practice', list.length, domain, list, { title: 'Filtered adaptive practice' })
  }
  const toggleMastered = id => setSaved(prev => ({
    ...prev,
    mastered: prev.mastered.includes(id) ? prev.mastered.filter(item => item !== id) : [...prev.mastered, id],
  }))
  const toggleExpanded = id => setExpandedIds(prev => (
    prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  ))

  return <div className="page bank-page">
    <div className="bank-header">
      <div><span>QUESTION LIBRARY</span><h1>{filtered.length} architecture scenarios</h1><p>Search by objective, service, tag, or scenario and browse explanations.</p></div>
      <button className="primary" disabled={!filtered.length} onClick={startFilteredPractice}><Target size={18}/> Practice filtered</button>
    </div>
    <div className="bank-controls">
      <label className="search"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search S3, VPC, resilience..."/></label>
      <select value={domain} onChange={event => setDomain(event.target.value)}>
        <option>All</option>{Object.keys(DOMAIN_META).map(item => <option key={item}>{item}</option>)}
      </select>
      <select value={service} onChange={event => setService(event.target.value)}>
        <option>All</option>{serviceOptions.map(item => <option key={item}>{item}</option>)}
      </select>
      <select value={objective} onChange={event => setObjective(event.target.value)}>
        <option>All</option>{objectiveOptions.map(item => <option key={item} value={item.objectiveId}>{item.objectiveId} - {item.service}</option>)}
      </select>
      <select value={difficulty} onChange={event => setDifficulty(event.target.value)}>
        <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <select value={progressFilter} onChange={event => setProgressFilter(event.target.value)}>
        <option>All</option><option>Missed</option><option>Mastered</option><option>Unseen</option>
      </select>
    </div>
    <div className="bank-list">
      {filtered.map(question => {
        const expanded = expandedIds.includes(question.id)
        const correctAnswer = buildQuestionReview(question, question.answers).correctLabels.join('; ')
        return <article className="bank-item" key={question.id}>
          <div className="q-index">{String(question.id).padStart(2, '0')}</div>
          <div className="bank-main">
            <div className="tags"><span>{DOMAIN_META[question.domain].short}</span><span>{question.difficulty}</span><span>{question.type === 'multiple' ? `Choose ${question.answers.length}` : 'Single answer'}</span></div>
            <button className="bank-question" onClick={() => toggleExpanded(question.id)}>{question.question}</button>
            <div className="objective-name">{question.objectiveName}</div>
            <div className="service-list">{question.services.map(service => <span key={service}>{service}</span>)}</div>
            {expanded && <div className="bank-answer"><strong>Answer</strong><p>{correctAnswer}</p><p>{question.explanation}</p></div>}
          </div>
          <button title="Mark mastered" className={`master ${mastered.has(question.id) ? 'on' : ''}`} onClick={() => toggleMastered(question.id)}><Check size={19}/></button>
        </article>
      })}
    </div>
  </div>
}

function Quiz({ session, setSession, finishQuiz }) {
  const [now, setNow] = useState(Date.now())
  const question = session.questions[session.index]
  const options = getOptionRecords(question)
  const selected = session.answers[question.id] || []
  const checked = session.checked[question.id] || session.result
  const remaining = session.duration
    ? Math.max(0, session.duration - Math.floor((now - session.startedAt) / 1000))
    : null

  useEffect(() => {
    if (!session.duration || session.result) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [session.duration, session.startedAt, session.result])

  useEffect(() => {
    if (remaining === 0 && !session.result) finishQuiz()
  }, [remaining, session.result, finishQuiz])

  const choose = optionId => {
    if (checked) return
    const next = question.type === 'single'
      ? [optionId]
      : selected.includes(optionId)
        ? selected.filter(item => item !== optionId)
        : [...selected, optionId]
    setSession({ ...session, answers: { ...session.answers, [question.id]: next } })
  }
  const check = () => setSession({ ...session, checked: { ...session.checked, [question.id]: true } })
  const flag = () => setSession({
    ...session,
    flagged: session.flagged.includes(question.id)
      ? session.flagged.filter(item => item !== question.id)
      : [...session.flagged, question.id],
  })
  const go = index => setSession({ ...session, index })
  const answered = Object.keys(session.answers).filter(id => session.answers[id]?.length).length
  const navigationStatus = item => {
    const selectedAnswers = session.answers[item.id] || []
    if (!session.checked[item.id] && !session.result) return ''
    if (!selectedAnswers.length) return ''
    return answerMatches(item, selectedAnswers) ? 'correct' : 'incorrect'
  }

  return <div className="quiz-layout">
    <aside className="quiz-side">
      <div className="side-title"><Cloud/><div><strong>SAA-C03</strong><span>{session.title}</span></div></div>
      {remaining !== null && <div className="timer-box"><span>Time remaining</span><strong>{formatTime(remaining)}</strong></div>}
      <div className="progress-copy"><span>Progress</span><strong>{answered}/{session.questions.length}</strong></div>
      <div className="progress"><span style={{ width: `${answered / session.questions.length * 100}%` }}></span></div>
      <div className="navigator">
        {session.questions.map((item, index) => <button key={item.id} onClick={() => go(index)} className={`${index === session.index ? 'current' : ''} ${session.answers[item.id]?.length ? 'answered' : ''} ${navigationStatus(item)} ${session.flagged.includes(item.id) ? 'flagged' : ''}`}>{index + 1}</button>)}
      </div>
      <div className="legend"><span><i className="dot correct"></i>Correct</span><span><i className="dot incorrect"></i>Incorrect</span><span><i className="dot flagged"></i>Flagged</span></div>
      <button className="end-btn" onClick={finishQuiz}>Finish session</button>
    </aside>
    <section className="question-panel">
      <div className="question-top">
        <div><span>QUESTION {session.index + 1} OF {session.questions.length}</span><div className="tags"><span>{DOMAIN_META[question.domain].short}</span><span>{question.difficulty}</span><span>{question.objectiveName}</span></div></div>
        <button className={session.flagged.includes(question.id) ? 'flag-active' : ''} onClick={flag}><Flag size={17}/>{session.flagged.includes(question.id) ? 'Flagged' : 'Flag for review'}</button>
      </div>
      <div className="question-body">
        {question.type === 'multiple' && <div className="multi-note">Select {question.answers.length} answers.</div>}
        <h1>{question.question}</h1>
        <div className="options">
          {options.map((option, index) => {
            const chosen = selected.includes(option.id)
            const right = checked && option.correct
            const wrong = checked && chosen && !option.correct
            return <button key={option.id} onClick={() => choose(option.id)} className={`${chosen ? 'selected' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`}>
              <span className="letter">{String.fromCharCode(65 + index)}</span><span>{option.text}</span>{right && <CheckCircle2/>}{wrong && <XCircle/>}
            </button>
          })}
        </div>
        {checked && session.mode !== 'exam' && <div className={`explanation ${answerMatches(question, selected) ? 'correct' : 'incorrect'}`}>
          <div>{answerMatches(question, selected) ? <CheckCircle2/> : <XCircle/>}<strong>{answerMatches(question, selected) ? 'Correct' : 'Not quite'}</strong></div>
          <p>{question.explanation}</p>
        </div>}
      </div>
      <div className="question-footer">
        <button className="secondary" disabled={session.index === 0} onClick={() => go(session.index - 1)}><ChevronLeft/> Previous</button>
        <div>
          {!checked && session.mode !== 'exam' && <button className="check-btn" disabled={!selected.length} onClick={check}>Check answer</button>}
          {session.index < session.questions.length - 1
            ? <button className="primary" onClick={() => go(session.index + 1)}>Next <ChevronRight/></button>
            : <button className="primary" onClick={finishQuiz}>Finish <Check/></button>}
        </div>
      </div>
    </section>
  </div>
}

function Results({ session, setView, startQuiz }) {
  const result = session.result
  const pct = Math.round(result.correct / result.total * 100)
  const missedObjectives = result.objectives.filter(objective => objective.correct < objective.total)

  return <div className="page results">
    <div className="result-hero">
      <div className="score-ring" style={{ '--score': `${pct * 3.6}deg` }}><div><strong>{pct}%</strong><span>{result.correct}/{result.total}</span></div></div>
      <span>SESSION COMPLETE - {session.title}</span><h1>{pct >= 80 ? 'Architecture instincts: strong.' : pct >= 60 ? 'Solid foundation, a few gaps to close.' : 'Good start - more reps ahead.'}</h1>
      <p>Review the domain breakdown and drill the objectives that need another variant.</p>
      <div>
        <button className="primary" onClick={() => setView('review')}><ListChecks/> Review questions</button>
        <button className="secondary" onClick={() => startQuiz('missed', 10)}><Target/> Drill missed concepts</button>
        <button className="secondary" onClick={() => startQuiz('practice', 10)}><RotateCcw/> New practice</button>
      </div>
    </div>
    <section className="breakdown">
      <h2>Domain performance</h2>
      {result.domains.filter(domain => domain.total).map(domain => {
        const p = Math.round(domain.correct / domain.total * 100)
        return <div className="break-row" key={domain.domain}><div><strong>{domain.domain}</strong><span>{domain.correct} of {domain.total} correct</span></div><div className="bar"><span style={{ width: `${p}%` }}></span></div><b>{p}%</b></div>
      })}
    </section>
    <section className="breakdown objective-breakdown">
      <h2>Objective misses</h2>
      {missedObjectives.length ? missedObjectives.map(objective =>
        <div className="objective-row" key={objective.objectiveId}>
          <div><strong>{objective.objectiveName}</strong><span>{objective.domain}</span></div>
          <button onClick={() => startQuiz('objective', 10, 'All', null, { objectiveIds: [objective.objectiveId], title: objective.objectiveName })}>Drill variants <ChevronRight size={15}/></button>
        </div>
      ) : <p className="empty-copy">No objective misses in this session.</p>}
    </section>
  </div>
}

function Review({ session, setView, startQuiz }) {
  const [reviewSelected, setReviewSelected] = useState(() => Object.fromEntries(
    session.questions.map(question => [question.id, (session.answers[question.id] || [])[0] || null]),
  ))
  const reviews = session.questions.map((question, index) => ({
    question,
    index,
    ...buildQuestionReview(question, session.answers[question.id] || []),
  }))
  const correct = reviews.filter(item => item.isCorrect).length
  const unanswered = reviews.filter(item => !item.isAnswered).length

  return <div className="page review-page">
    <div className="review-header">
      <div>
        <span>{session.title} - REVIEW</span>
        <h1>Select an answer to see why it is right or not.</h1>
        <p>{correct} of {reviews.length} correct{unanswered ? `, ${unanswered} unanswered` : ''}.</p>
      </div>
      <div>
        <button className="secondary" onClick={() => setView('result')}><ChevronLeft/> Results</button>
        <button className="primary" onClick={() => startQuiz('practice', 10)}><RotateCcw/> New practice</button>
      </div>
    </div>
    <section className="review-list">
      {reviews.map(item => <article className={`review-card ${item.isCorrect ? 'correct' : 'missed'}`} key={item.id}>
        <header>
          <div>
            <span>QUESTION {item.index + 1}</span>
            <div className="tags"><span>{DOMAIN_META[item.question.domain].short}</span><span>{item.question.difficulty}</span><span>{item.question.objectiveName}</span></div>
          </div>
          <strong>{item.isCorrect ? 'Correct' : item.isAnswered ? 'Missed last time' : 'Unanswered'}</strong>
        </header>
        <h2>{item.question.question}</h2>
        <div className="review-options">
          {item.options.map((option, index) => {
            const inspected = reviewSelected[item.question.id] === option.id
            const state = `${option.isSelected ? 'selected' : ''} ${option.isCorrect ? 'right' : ''} ${inspected && !option.isCorrect ? 'wrong' : ''}`
            return <div className="review-option-wrap" key={option.id}>
              <button className={state} onClick={() => setReviewSelected(prev => ({ ...prev, [item.question.id]: option.id }))}>
                <span className="letter">{String.fromCharCode(65 + index)}</span>
                <span>{option.label}</span>
                <small>{option.isSelected && 'Your answer'}{option.isSelected && option.isCorrect && ' - '}{option.isCorrect && 'Correct answer'}</small>
              </button>
              {inspected && <div className={`option-explanation ${option.isCorrect ? 'correct' : 'incorrect'}`}>
                <strong>{option.isCorrect ? 'Correct - ' : 'Not quite - '}</strong>{option.explanation || item.question.explanation}
              </div>}
            </div>
          })}
        </div>
      </article>)}
    </section>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
