import { useEffect, useState } from 'react'
import type { LetterState, GameStatus, UDDefinition } from '../types'
import { fetchDefinition } from '../utils/udApi'

const EMOJI: Record<LetterState, string> = {
  correct: '🟩',
  present: '🟨',
  absent:  '⬛',
  empty:   '⬜',
}

interface GameModalProps {
  status: GameStatus
  answer: string
  guesses: string[]
  evaluations: LetterState[][]
  today: string
  onClose: () => void
}

function buildShareText(guesses: string[], evaluations: LetterState[][], today: string): string {
  const header = `Wudle • ${today}\n${guesses.length}/6\n\n`
  const grid = evaluations.map(row => row.map(s => EMOJI[s]).join('')).join('\n')
  return header + grid
}

export default function GameModal({ status, answer, guesses, evaluations, today, onClose }: GameModalProps) {
  const [definition, setDefinition] = useState<UDDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchDefinition(answer).then(d => {
      setDefinition(d)
      setLoading(false)
    })
  }, [answer])

  function handleShare() {
    const text = buildShareText(guesses, evaluations, today)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const won = status === 'won'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-result">
          {won
            ? <span className="result-won">🔥 {guesses.length === 1 ? 'Genius!' : guesses.length <= 3 ? 'Impressive!' : 'Got it!'}</span>
            : <span className="result-lost">The word was</span>
          }
          <div className="result-word">{answer.toUpperCase()}</div>
        </div>

        <div className="definition-box">
          {loading
            ? <div className="def-loading">Looking up definition…</div>
            : definition
              ? <>
                  <div className="def-label">
                    {definition.source === 'wikipedia' ? '📖 Wikipedia' : '🏙️ Urban Dictionary'}
                  </div>
                  <p className="def-text">{definition.definition}</p>
                  {definition.example && (
                    <p className="def-example">"{definition.example}"</p>
                  )}
                  {definition.source !== 'wikipedia' && (
                    <div className="def-votes">
                      <span>👍 {definition.thumbsUp}</span>
                      <span>👎 {definition.thumbsDown}</span>
                    </div>
                  )}
                </>
              : <div className="def-loading">No definition found.</div>
          }
        </div>

        <button className="share-btn" onClick={handleShare}>
          {copied ? '✅ Copied!' : '📋 Share Result'}
        </button>
      </div>
    </div>
  )
}
