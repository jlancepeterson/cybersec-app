import { useEffect, useState } from 'react'
import {
  countRedFlags,
  getScenariosForLevel,
  levelInfo,
  type RedFlagLevel,
  type RedFlagScenario,
} from './redFlagData'

interface ScenarioResult {
  scenarioId: string
  score: number
  found: number
  incorrect: number
  hintsUsed: number
  revealed: number
}

const HINT_PENALTY = 15
const INCORRECT_PENALTY = 10
const LEVEL_ORDER: RedFlagLevel[] = ['beginner', 'intermediate', 'expert']

function isRedFlagElement(scenario: RedFlagScenario, id: string): boolean {
  if (id === 'sender') return scenario.senderIsRedFlag
  if (id === 'subject') return scenario.subjectIsRedFlag
  return scenario.bodyElements.find((element) => element.id === id)?.isRedFlag ?? false
}

function getExplanation(scenario: RedFlagScenario, id: string): string {
  if (id === 'sender') return scenario.senderExplanation
  if (id === 'subject') return scenario.subjectExplanation
  return scenario.bodyElements.find((element) => element.id === id)?.explanation ?? ''
}

function elementIcon(type: 'text' | 'link' | 'attachment' | 'qrcode') {
  if (type === 'link') return '🔗 '
  if (type === 'attachment') return '📎 '
  if (type === 'qrcode') return '📱 '
  return ''
}

function nextLevel(level: RedFlagLevel): RedFlagLevel | null {
  const index = LEVEL_ORDER.indexOf(level)
  return index >= 0 && index + 1 < LEVEL_ORDER.length ? LEVEL_ORDER[index + 1] : null
}

export function SpotTheRedFlags() {
  const [view, setView] = useState<'levelSelect' | 'playing' | 'levelResults'>('levelSelect')
  const [selectedLevel, setSelectedLevel] = useState<RedFlagLevel | null>(null)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [levelResults, setLevelResults] = useState<ScenarioResult[]>([])

  const [interactedIds, setInteractedIds] = useState<Set<string>>(new Set())
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [hintIndex, setHintIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [currentHint, setCurrentHint] = useState<string | null>(null)
  const [lastFeedback, setLastFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [scenarioComplete, setScenarioComplete] = useState(false)
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null)

  const scenarios = selectedLevel ? getScenariosForLevel(selectedLevel) : []
  const currentScenario = scenarios[scenarioIndex]
  const totalRedFlags = currentScenario ? countRedFlags(currentScenario) : 0
  const foundCount = currentScenario
    ? [...interactedIds].filter((id) => isRedFlagElement(currentScenario, id)).length
    : 0
  const incorrectCount = interactedIds.size - foundCount

  useEffect(() => {
    if (!currentScenario || scenarioComplete) return
    if (foundCount + revealedIds.size >= totalRedFlags) {
      setScenarioComplete(true)
    }
  }, [foundCount, revealedIds, totalRedFlags, currentScenario, scenarioComplete])

  useEffect(() => {
    if (scenarioComplete && currentScenario && !scenarioResult) {
      const raw = totalRedFlags > 0 ? (foundCount / totalRedFlags) * 100 : 100
      const score = Math.max(0, Math.round(raw - hintsUsed * HINT_PENALTY - incorrectCount * INCORRECT_PENALTY))
      setScenarioResult({
        scenarioId: currentScenario.id,
        score,
        found: foundCount,
        incorrect: incorrectCount,
        hintsUsed,
        revealed: revealedIds.size,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioComplete])

  function resetScenarioState() {
    setInteractedIds(new Set())
    setRevealedIds(new Set())
    setHintIndex(0)
    setHintsUsed(0)
    setCurrentHint(null)
    setLastFeedback(null)
    setScenarioComplete(false)
    setScenarioResult(null)
  }

  function startLevel(level: RedFlagLevel) {
    setSelectedLevel(level)
    setScenarioIndex(0)
    setLevelResults([])
    resetScenarioState()
    setView('playing')
  }

  function handleElementClick(id: string) {
    if (!currentScenario || scenarioComplete || interactedIds.has(id) || revealedIds.has(id)) return
    const flag = isRedFlagElement(currentScenario, id)
    setInteractedIds((prev) => new Set(prev).add(id))
    setLastFeedback({ correct: flag, message: getExplanation(currentScenario, id) })
  }

  function handleHint() {
    if (!currentScenario || hintIndex >= currentScenario.hints.length) return
    setCurrentHint(currentScenario.hints[hintIndex])
    setHintIndex((index) => index + 1)
    setHintsUsed((used) => used + 1)
  }

  function handleReveal() {
    if (!currentScenario || scenarioComplete) return
    const allIds = ['sender', 'subject', ...currentScenario.bodyElements.map((element) => element.id)]
    const remaining = allIds.filter((id) => isRedFlagElement(currentScenario, id) && !interactedIds.has(id))
    setRevealedIds(new Set(remaining))
  }

  function handleContinue() {
    if (scenarioResult) {
      setLevelResults((prev) => [...prev, scenarioResult])
    }
    if (scenarioIndex + 1 < scenarios.length) {
      resetScenarioState()
      setScenarioIndex((index) => index + 1)
    } else {
      setView('levelResults')
    }
  }

  function handleRetryLevel() {
    if (!selectedLevel) return
    startLevel(selectedLevel)
  }

  function handleNextLevel() {
    if (!selectedLevel) return
    const next = nextLevel(selectedLevel)
    if (next) startLevel(next)
  }

  function handleBackToLevelSelect() {
    setView('levelSelect')
    setSelectedLevel(null)
    resetScenarioState()
  }

  if (view === 'levelSelect') {
    return (
      <div className="quiz-card redflag-card">
        <div className="redflag-level-grid">
          {LEVEL_ORDER.map((level) => (
            <div className="redflag-level-card" key={level}>
              <p className="tag">{levelInfo[level].title}</p>
              <h3>{levelInfo[level].tagline}</h3>
              <p>{levelInfo[level].description}</p>
              <p className="redflag-level-count">10 scenarios</p>
              <button type="button" className="primary-link" onClick={() => startLevel(level)}>
                Play {levelInfo[level].title}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'levelResults' && selectedLevel) {
    const totalScore = levelResults.reduce((sum, result) => sum + result.score, 0)
    const maxScore = levelResults.length * 100
    const totalFound = levelResults.reduce((sum, result) => sum + result.found, 0)
    const totalIncorrect = levelResults.reduce((sum, result) => sum + result.incorrect, 0)
    const totalHints = levelResults.reduce((sum, result) => sum + result.hintsUsed, 0)
    const accuracy =
      totalFound + totalIncorrect > 0 ? Math.round((totalFound / (totalFound + totalIncorrect)) * 100) : 100
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    const message =
      percentage >= 90
        ? 'Excellent work — you consistently spotted subtle red flags with strong accuracy.'
        : percentage >= 75
          ? 'Solid performance. Review the explanations for anything you missed to sharpen further.'
          : percentage >= 50
            ? 'Good effort. Revisit the indicators you missed or needed hints for, then try again to reinforce them.'
            : 'This level highlights exactly what to practice next — review each explanation carefully and try again.'
    const upcoming = nextLevel(selectedLevel)

    return (
      <div className="quiz-card redflag-card redflag-results">
        <p className="tag">{levelInfo[selectedLevel].title} results</p>
        <p className="quiz-score">
          {totalScore} / {maxScore} ({percentage}%)
        </p>
        <div className="redflag-results-grid">
          <div className="redflag-stat">
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>
          <div className="redflag-stat">
            <strong>{totalFound}</strong>
            <span>Red flags found</span>
          </div>
          <div className="redflag-stat">
            <strong>{totalIncorrect}</strong>
            <span>Incorrect selections</span>
          </div>
          <div className="redflag-stat">
            <strong>{totalHints}</strong>
            <span>Hints used</span>
          </div>
        </div>
        <p>{message}</p>
        <div className="quiz-answers">
          <button type="button" className="secondary-link" onClick={handleRetryLevel}>
            Retry level
          </button>
          {upcoming ? (
            <button type="button" className="primary-link" onClick={handleNextLevel}>
              Continue to {levelInfo[upcoming].title}
            </button>
          ) : null}
          <button type="button" className="secondary-link" onClick={handleBackToLevelSelect}>
            Back to level select
          </button>
        </div>
      </div>
    )
  }

  if (!currentScenario || !selectedLevel) {
    return null
  }

  function elementClass(id: string) {
    if (revealedIds.has(id)) return 'redflag-field is-revealed'
    if (interactedIds.has(id)) {
      return isRedFlagElement(currentScenario!, id) ? 'redflag-field is-found' : 'redflag-field is-wrong'
    }
    return 'redflag-field'
  }

  return (
    <div className="quiz-card redflag-card">
      <div className="quiz-progress-row">
        <span className="quiz-progress">
          {levelInfo[selectedLevel].title} · Scenario {scenarioIndex + 1} of {scenarios.length}
        </span>
        <span className="quiz-progress quiz-progress-score">
          Red Flags Found: {foundCount} of {totalRedFlags}
        </span>
      </div>
      <button type="button" className="redflag-exit" onClick={handleBackToLevelSelect}>
        Exit to level select
      </button>

      <p className="redflag-instructions">
        Find {totalRedFlags} red flag{totalRedFlags === 1 ? '' : 's'} in this email. Click any part of the
        message you think is suspicious.
      </p>

      <div className="email-card sim-email">
        <div className="sim-email-header">
          <button
            type="button"
            className={elementClass('sender')}
            onClick={() => handleElementClick('sender')}
            disabled={interactedIds.has('sender') || revealedIds.has('sender')}
          >
            <strong>{currentScenario.senderName}</strong>
            <span className="sim-sender-address">{currentScenario.senderEmail}</span>
          </button>
          <span className="sim-timestamp">{currentScenario.timestamp}</span>
        </div>

        <button
          type="button"
          className={elementClass('subject')}
          onClick={() => handleElementClick('subject')}
          disabled={interactedIds.has('subject') || revealedIds.has('subject')}
        >
          <h2>{currentScenario.subject}</h2>
        </button>

        <p className="redflag-greeting">{currentScenario.greeting}</p>

        {currentScenario.bodyElements.map((element) => (
          <button
            key={element.id}
            type="button"
            className={elementClass(element.id)}
            onClick={() => handleElementClick(element.id)}
            disabled={interactedIds.has(element.id) || revealedIds.has(element.id)}
          >
            {elementIcon(element.type)}
            {element.content}
          </button>
        ))}

        <p className="redflag-closing">{currentScenario.closing}</p>
      </div>

      {lastFeedback ? (
        <div className={`quiz-feedback ${lastFeedback.correct ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect'}`}>
          <p className="quiz-feedback-result">{lastFeedback.correct ? 'Red flag found!' : 'Not necessarily suspicious.'}</p>
          <p>{lastFeedback.message}</p>
        </div>
      ) : null}

      {currentHint && !scenarioComplete ? (
        <div className="redflag-hint">
          <strong>Hint:</strong> {currentHint}
        </div>
      ) : null}

      {!scenarioComplete ? (
        <div className="redflag-controls">
          <button type="button" className="secondary-link" onClick={handleHint} disabled={hintIndex >= currentScenario.hints.length}>
            Give Me a Hint
          </button>
          <button type="button" className="secondary-link" onClick={handleReveal}>
            Reveal Remaining Red Flags
          </button>
        </div>
      ) : (
        <div className="redflag-summary">
          <h3>What You Should Have Noticed</h3>
          <p>{currentScenario.whatYouShouldHaveNoticed}</p>
          <h3>What Should You Do?</h3>
          <p>{currentScenario.whatShouldYouDo}</p>
          {scenarioResult ? (
            <p className="redflag-scenario-score">Scenario score: {scenarioResult.score} / 100</p>
          ) : null}
          <button type="button" className="primary-link" onClick={handleContinue}>
            {scenarioIndex + 1 < scenarios.length ? 'Next scenario' : 'See level results'}
          </button>
        </div>
      )}
    </div>
  )
}
