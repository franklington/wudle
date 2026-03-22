import type { LetterState } from '../types'

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL'],
]

const keyClass: Record<LetterState, string> = {
  correct: 'key-correct',
  present: 'key-present',
  absent:  'key-absent',
  empty:   '',
}

interface KeyboardProps {
  keyboardState: Record<string, LetterState>
  onKey: (key: string) => void
  onEnter: () => void
  onDelete: () => void
}

export default function Keyboard({ keyboardState, onKey, onEnter, onDelete }: KeyboardProps) {
  function handleKey(k: string) {
    if (k === 'ENTER') onEnter()
    else if (k === 'DEL') onDelete()
    else onKey(k)
  }

  return (
    <div className="keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="keyboard-row">
          {row.map(k => {
            const state = keyboardState[k.toLowerCase()]
            const extraClass = state ? keyClass[state] : ''
            const isWide = k === 'ENTER' || k === 'DEL'
            return (
              <button
                key={k}
                className={`key ${isWide ? 'key-wide' : ''} ${extraClass}`}
                onPointerDown={(e) => { e.preventDefault(); handleKey(k) }}
                aria-label={k}
              >
                {k}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
