import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  ArrowRight, Award, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight,
  Clock3, Cloud, Flag, LayoutDashboard, ListChecks, RotateCcw, Search, ShieldCheck,
  Sparkles, Target, Timer, XCircle
} from 'lucide-react'
import { questions, questionSets } from './data/questionSets'
import {
  DOMAIN_META,
  EXAM_DURATION_SECONDS,
  EXAM_QUESTION_COUNT,
  answerMatches,
  buildQuestionReview,
  formatTime,
  sampleWeighted,
  shuffle,
} from './quizLogic'
import './styles.css'

const storageKey = 'saa-c03-progress-v1'

function App() {
  const [view, setView] = useState('dashboard')
  const [bankQuery, setBankQuery] = useState('')
  const [domainFilter, setDomainFilter] = useState('All')
  const [session, setSession] = useState(null)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || { attempts: [], mastered: [] } }
    catch { return { attempts: [], mastered: [] } }
  })

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(saved)), [saved])

  const questionById = useMemo(() => new Map(questions.map(q => [q.id, q])), [])

  const startQuiz = (mode, count = 10, domain = 'All', questionList = null) => {
    let pool = domain === 'All' ? questions : questions.filter(q => q.domain === domain)
    let list = questionList || (mode === 'exam'
      ? sampleWeighted(questions, Math.min(count, questions.length))
      : shuffle(pool).slice(0, count))
    setSession({
      mode, questions: list, index: 0, answers: {}, flagged: [], checked: {}, startedAt: Date.now(),
      duration: mode === 'exam' ? EXAM_DURATION_SECONDS : null
    })
    setView('quiz')
  }

  const startQuestionSet = set => {
    const list = set.questionIds.map(id => questionById.get(id)).filter(Boolean)
    startQuiz('set', list.length, 'All', list)
  }

  const finishQuiz = () => {
    const correct = session.questions.filter(q => answerMatches(q, session.answers[q.id])).length
    const result = {
      date: new Date().toISOString(), correct, total: session.questions.length,
      domains: Object.keys(DOMAIN_META).map(domain => {
        const qs = session.questions.filter(q => q.domain === domain)
        return { domain, correct: qs.filter(q => answerMatches(q, session.answers[q.id])).length, total: qs.length }
      })
    }
    setSaved(prev => ({ ...prev, attempts: [result, ...prev.attempts].slice(0, 20) }))
    setSession({ ...session, result })
    setView('result')
  }

  const mastered = new Set(saved.mastered)
  const latest = saved.attempts[0]
  const avg = saved.attempts.length
    ? Math.round(saved.attempts.reduce((s,a) => s + a.correct / a.total * 100, 0) / saved.attempts.length)
    : 0

  return <div className="app-shell">
    <Header view={view} setView={setView} />
    <main>
      {view === 'dashboard' && <Dashboard startQuiz={startQuiz} startQuestionSet={startQuestionSet} latest={latest} avg={avg} attempts={saved.attempts.length} mastered={mastered.size} />}
      {view === 'bank' && <QuestionBank query={bankQuery} setQuery={setBankQuery} domain={domainFilter} setDomain={setDomainFilter} mastered={mastered} setSaved={setSaved} startQuiz={startQuiz} />}
      {view === 'quiz' && session && <Quiz session={session} setSession={setSession} finishQuiz={finishQuiz} />}
      {view === 'result' && session?.result && <Results session={session} setView={setView} startQuiz={startQuiz} />}
      {view === 'review' && session?.result && <Review session={session} setView={setView} startQuiz={startQuiz} />}
    </main>
  </div>
}

function Header({ view, setView }) {
  return <header className="topbar">
    <button className="brand" onClick={() => setView('dashboard')}>
      <span className="brand-mark"><Cloud size={23}/></span>
      <span><strong>Cloud Architect</strong><small>LAB / SAA-C03</small></span>
    </button>
    <nav>
      <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><LayoutDashboard size={17}/> Dashboard</button>
      <button className={view === 'bank' ? 'active' : ''} onClick={() => setView('bank')}><BookOpen size={17}/> Question bank</button>
    </nav>
    <div className="exam-pill"><span></span> 100 original questions</div>
  </header>
}

function Dashboard({ startQuiz, startQuestionSet, latest, avg, attempts, mastered }) {
  const latestPct = latest ? Math.round(latest.correct / latest.total * 100) : null
  return <div className="page dashboard cockpit-page">
    <section className="cockpit-shell">
      <aside className="study-rail">
        <div className="rail-label">Study plan</div>
        <div className="plan-card">
          <strong>65-question exam readiness</strong>
          <div className="meter"><span style={{ width: `${attempts ? Math.min(avg, 100) : 12}%` }}></span></div>
          <small>{attempts ? `${avg}% average across ${attempts} attempt${attempts > 1 ? 's' : ''}` : 'Complete a set to calibrate'}</small>
        </div>
        <div className="rail-list">
          <button onClick={() => startQuiz('exam', EXAM_QUESTION_COUNT)}><Timer size={16}/><span>Full exam</span><b>130m</b></button>
          <button onClick={() => startQuiz('practice', 10)}><Target size={16}/><span>Quick practice</span><b>10q</b></button>
          <button onClick={() => startQuiz('practice', 10, 'Resilient Architectures')}><ShieldCheck size={16}/><span>Resilience drill</span><b>10q</b></button>
          <button onClick={() => startQuiz('practice', 10, 'Cost-Optimized Architectures')}><Award size={16}/><span>Cost drill</span><b>10q</b></button>
        </div>
      </aside>

      <section className="cockpit-main">
        <div className="cockpit-hero">
          <div>
            <div className="eyebrow"><Sparkles size={15}/> AWS CERTIFIED SOLUTIONS ARCHITECT — ASSOCIATE</div>
            <h1>Study cockpit for scenario practice.</h1>
            <p>100 original SAA-C03-style questions organized into 10 blueprint-weighted sets, plus a 65-question exam simulation.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => startQuestionSet(questionSets[0])}><Target size={19}/> Start Set 1 <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => startQuiz('exam', EXAM_QUESTION_COUNT)}><Timer size={19}/> 65-question exam</button>
            </div>
          </div>
          <div className="score-tile">
            <span>Average score</span>
            <strong>{attempts ? `${avg}%` : '—'}</strong>
            <small>{latest ? `Latest ${latestPct}% (${latest.correct}/${latest.total})` : 'No attempts yet'}</small>
          </div>
        </div>

        <section className="domain-strip">
          {Object.entries(DOMAIN_META).map(([name, meta]) =>
            <button className="domain-mini" key={name} onClick={() => startQuiz('practice', Math.min(10, questions.filter(q=>q.domain===name).length), name)}>
              <span>{meta.short}</span>
              <strong>{meta.weight}%</strong>
              <small>{questions.filter(q=>q.domain===name).length} questions</small>
              <div className="meter"><i style={{width:`${meta.weight}%`}}></i></div>
            </button>
          )}
        </section>

        <section className="set-grid">
          {questionSets.map((set, index) =>
            <article className="set-card" key={set.id}>
              <div><span>SET {String(index + 1).padStart(2, '0')}</span><h3>{set.name}</h3><p>{set.description}</p></div>
              <button onClick={() => startQuestionSet(set)}>Start set <ChevronRight size={16}/></button>
            </article>
          )}
        </section>
      </section>

      <aside className="coach-panel">
        <div className="rail-label">Coach notes</div>
        <div className="coach-box">
          <h3>Readiness target</h3>
          <p>Aim for 80%+ across several sets before relying on a full exam simulation.</p>
        </div>
        <div className="coach-box">
          <h3>Progress</h3>
          <p>{mastered} of {questions.length} questions marked mastered. Use the bank to mark concepts that feel automatic.</p>
        </div>
        <div className="coach-box">
          <h3>Question style</h3>
          <p>Questions are original practice content based on AWS blueprint domains, not real exam questions.</p>
        </div>
      </aside>
    </section>
  </div>
}

function Stat({ icon, label, value, note }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>
}

function QuestionBank({ query, setQuery, domain, setDomain, mastered, setSaved, startQuiz }) {
  const filtered = questions.filter(q =>
    (domain === 'All' || q.domain === domain) &&
    (`${q.question} ${q.services.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  )
  const toggleMastered = id => setSaved(prev => ({
    ...prev, mastered: prev.mastered.includes(id) ? prev.mastered.filter(x=>x!==id) : [...prev.mastered,id]
  }))
  return <div className="page bank-page">
    <div className="bank-header"><div><span>QUESTION LIBRARY</span><h1>{questions.length} architecture scenarios</h1><p>Search by service, filter by domain, and mark concepts as mastered.</p></div><button className="primary" onClick={() => startQuiz('practice', 10)}><Target size={18}/> Random 10</button></div>
    <div className="bank-controls">
      <label className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search S3, VPC, resilience..."/></label>
      <select value={domain} onChange={e=>setDomain(e.target.value)}>
        <option>All</option>{Object.keys(DOMAIN_META).map(d=><option key={d}>{d}</option>)}
      </select>
    </div>
    <div className="bank-list">
      {filtered.map(q => <article className="bank-item" key={q.id}>
        <div className="q-index">{String(q.id).padStart(2,'0')}</div>
        <div className="bank-main">
          <div className="tags"><span>{DOMAIN_META[q.domain].short}</span><span>{q.difficulty}</span><span>{q.type === 'multiple' ? 'Choose 2' : 'Single answer'}</span></div>
          <h3>{q.question}</h3>
          <div className="service-list">{q.services.map(s=><span key={s}>{s}</span>)}</div>
        </div>
        <button title="Mark mastered" className={`master ${mastered.has(q.id)?'on':''}`} onClick={()=>toggleMastered(q.id)}><Check size={19}/></button>
      </article>)}
    </div>
  </div>
}

function Quiz({ session, setSession, finishQuiz }) {
  const [now, setNow] = useState(Date.now())
  const q = session.questions[session.index]
  const selected = session.answers[q.id] || []
  const checked = session.checked[q.id]
  const remaining = session.duration
    ? Math.max(0, session.duration - Math.floor((now - session.startedAt) / 1000))
    : null

  useEffect(() => {
    if (!session.duration) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [session.duration, session.startedAt])

  useEffect(() => {
    if (remaining === 0) finishQuiz()
  }, [remaining, finishQuiz])

  const choose = idx => {
    if (checked) return
    let next = q.type === 'single' ? [idx] : selected.includes(idx) ? selected.filter(x=>x!==idx) : [...selected,idx]
    setSession({...session, answers:{...session.answers,[q.id]:next}})
  }
  const check = () => setSession({...session, checked:{...session.checked,[q.id]:true}})
  const flag = () => setSession({...session, flagged:session.flagged.includes(q.id)?session.flagged.filter(x=>x!==q.id):[...session.flagged,q.id]})
  const go = i => setSession({...session,index:i})
  const answered = Object.keys(session.answers).filter(id => session.answers[id]?.length).length

  return <div className="quiz-layout">
    <aside className="quiz-side">
      <div className="side-title"><Cloud/><div><strong>SAA-C03</strong><span>{session.mode === 'exam' ? '65-question exam simulation' : session.mode === 'set' ? 'Practice set' : 'Practice session'}</span></div></div>
      {remaining !== null && <div className="timer-box"><span>Time remaining</span><strong>{formatTime(remaining)}</strong></div>}
      <div className="progress-copy"><span>Progress</span><strong>{answered}/{session.questions.length}</strong></div>
      <div className="progress"><span style={{width:`${answered/session.questions.length*100}%`}}></span></div>
      <div className="navigator">
        {session.questions.map((item,i)=><button key={item.id} onClick={()=>go(i)} className={`${i===session.index?'current':''} ${session.answers[item.id]?.length?'answered':''} ${session.flagged.includes(item.id)?'flagged':''}`}>{i+1}</button>)}
      </div>
      <div className="legend"><span><i className="dot answered"></i>Answered</span><span><i className="dot flagged"></i>Flagged</span></div>
      <button className="end-btn" onClick={finishQuiz}>Finish session</button>
    </aside>
    <section className="question-panel">
      <div className="question-top">
        <div><span>QUESTION {session.index+1} OF {session.questions.length}</span><div className="tags"><span>{DOMAIN_META[q.domain].short}</span><span>{q.difficulty}</span></div></div>
        <button className={session.flagged.includes(q.id)?'flag-active':''} onClick={flag}><Flag size={17}/>{session.flagged.includes(q.id)?'Flagged':'Flag for review'}</button>
      </div>
      <div className="question-body">
        {q.type === 'multiple' && <div className="multi-note">Select TWO answers.</div>}
        <h1>{q.question}</h1>
        <div className="options">
          {q.options.map((opt,i)=>{
            const chosen=selected.includes(i), right=checked&&q.answers.includes(i), wrong=checked&&chosen&&!q.answers.includes(i)
            return <button key={opt} onClick={()=>choose(i)} className={`${chosen?'selected':''} ${right?'right':''} ${wrong?'wrong':''}`}>
              <span className="letter">{String.fromCharCode(65+i)}</span><span>{opt}</span>{right&&<CheckCircle2/>}{wrong&&<XCircle/>}
            </button>
          })}
        </div>
        {checked && <div className={`explanation ${answerMatches(q,selected)?'correct':'incorrect'}`}>
          <div>{answerMatches(q,selected)?<CheckCircle2/>:<XCircle/>}<strong>{answerMatches(q,selected)?'Correct':'Not quite'}</strong></div>
          <p>{q.explanation}</p>
        </div>}
      </div>
      <div className="question-footer">
        <button className="secondary" disabled={session.index===0} onClick={()=>go(session.index-1)}><ChevronLeft/> Previous</button>
        <div>
          {!checked && session.mode !== 'exam' && <button className="check-btn" disabled={!selected.length} onClick={check}>Check answer</button>}
          {session.index < session.questions.length-1
            ? <button className="primary" onClick={()=>go(session.index+1)}>Next <ChevronRight/></button>
            : <button className="primary" onClick={finishQuiz}>Finish <Check/></button>}
        </div>
      </div>
    </section>
  </div>
}

function Results({ session, setView, startQuiz }) {
  const r=session.result, pct=Math.round(r.correct/r.total*100)
  return <div className="page results">
    <div className="result-hero">
      <div className="score-ring" style={{'--score':`${pct*3.6}deg`}}><div><strong>{pct}%</strong><span>{r.correct}/{r.total}</span></div></div>
      <span>SESSION COMPLETE</span><h1>{pct>=80?'Architecture instincts: strong.':pct>=65?'You’re building momentum.':'Time to reinforce the foundations.'}</h1>
      <p>Review your domain breakdown, then focus the next session on your lowest-scoring area.</p>
      <div><button className="primary" onClick={()=>setView('review')}><ListChecks/> Review answers</button><button className="secondary" onClick={()=>startQuiz('practice',10)}><RotateCcw/> New practice</button><button className="secondary" onClick={()=>setView('bank')}><BookOpen/> Browse questions</button></div>
    </div>
    <section className="breakdown">
      <h2>Domain performance</h2>
      {r.domains.filter(d=>d.total).map(d=>{
        const p=Math.round(d.correct/d.total*100)
        return <div className="break-row" key={d.domain}><div><strong>{d.domain}</strong><span>{d.correct} of {d.total} correct</span></div><div className="bar"><span style={{width:`${p}%`}}></span></div><b>{p}%</b></div>
      })}
    </section>
  </div>
}

function Review({ session, setView, startQuiz }) {
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
        <span>SESSION REVIEW</span>
        <h1>Review the set you just answered.</h1>
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
            <div className="tags"><span>{DOMAIN_META[item.question.domain].short}</span><span>{item.question.difficulty}</span><span>{item.question.type === 'multiple' ? 'Choose 2' : 'Single answer'}</span></div>
          </div>
          <strong>{item.isCorrect ? 'Correct' : item.isAnswered ? 'Review' : 'Unanswered'}</strong>
        </header>
        <h2>{item.question.question}</h2>
        <div className="review-options">
          {item.options.map((option, index) => {
            const state = `${option.isSelected ? 'selected' : ''} ${option.isCorrect ? 'right' : ''} ${option.isSelected && !option.isCorrect ? 'wrong' : ''}`
            return <div className={state} key={option.label}>
              <span className="letter">{String.fromCharCode(65 + index)}</span>
              <span>{option.label}</span>
              <small>{option.isSelected && 'Your answer'}{option.isSelected && option.isCorrect && ' · '}{option.isCorrect && 'Correct answer'}</small>
            </div>
          })}
        </div>
        <div className={`answer-summary ${item.isCorrect ? 'correct' : 'incorrect'}`}>
          <div>{item.isCorrect ? <CheckCircle2/> : <XCircle/>}<strong>{item.isCorrect ? 'You chose the correct answer.' : 'Correct answer'}</strong></div>
          {!item.isCorrect && <p>{item.correctLabels.join('; ')}</p>}
          {item.isAnswered && !item.isCorrect && <p><b>Your answer:</b> {item.selectedLabels.join('; ')}</p>}
          {!item.isAnswered && <p><b>Your answer:</b> No answer selected</p>}
          <p>{item.question.explanation}</p>
        </div>
      </article>)}
    </section>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
