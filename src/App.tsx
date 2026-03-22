import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Board from './components/Board'
import Keyboard from './components/Keyboard'
import Toast from './components/Toast'
import GameModal from './components/GameModal'
import StatsModal from './components/StatsModal'
import HelpModal from './components/HelpModal'
import { useGame } from './hooks/useGame'
import { useStats } from './hooks/useStats'

type ModalState = 'none' | 'game' | 'stats' | 'help'

export default function App() {
  const game = useGame()
  const { stats, recordWin, recordLoss } = useStats()

  const [toast, setToast] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>('none')
  const [statsRecorded, setStatsRecorded] = useState(false)

  // Show game-over modal after a brief delay so the last tile reveal finishes
  useEffect(() => {
    if (game.status !== 'playing' && !statsRecorded) {
      setStatsRecorded(true)
      if (game.status === 'won') {
        recordWin(game.guesses.length, game.today)
        setToast(game.guesses.length === 1 ? 'Genius!' : 'Nice!')
      } else {
        recordLoss(game.today)
      }
      const delay = game.status === 'won' ? 1800 : 1200
      setTimeout(() => setModal('game'), delay)
    }
  }, [game.status])

  // Show help on first visit
  useEffect(() => {
    if (stats.gamesPlayed === 0 && localStorage.getItem('wudle-seen') !== '1') {
      localStorage.setItem('wudle-seen', '1')
      setTimeout(() => setModal('help'), 300)
    }
  }, [])

  const handleKey = useCallback((letter: string) => {
    game.addLetter(letter)
  }, [game])

  const handleEnter = useCallback(() => {
    const err = game.submitGuess()
    if (err) setToast(err)
  }, [game])

  const handleDelete = useCallback(() => {
    game.deleteLetter()
  }, [game])

  // Physical keyboard handler
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (modal !== 'none') return
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const key = e.key.toUpperCase()
      if (key === 'ENTER') handleEnter()
      else if (key === 'BACKSPACE') handleDelete()
      else if (/^[A-Z]$/.test(key)) handleKey(key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modal, handleEnter, handleDelete, handleKey])

  return (
    <div className="app">
      <Header
        onStatsClick={() => setModal('stats')}
        onHelpClick={() => setModal('help')}
      />

      <main className="main">
        <Board
          board={game.board}
          revealRow={game.currentRow}
          shake={game.shake}
        />
      </main>

      <footer className="footer">
        <Keyboard
          keyboardState={game.keyboardState}
          onKey={handleKey}
          onEnter={handleEnter}
          onDelete={handleDelete}
        />
      </footer>

      {toast && (
        <Toast
          message={toast}
          onDone={() => setToast(null)}
        />
      )}

      {modal === 'game' && (
        <GameModal
          status={game.status}
          answer={game.answer}
          guesses={game.guesses}
          evaluations={game.evaluations}
          today={game.today}
          onClose={() => setModal('none')}
        />
      )}

      {modal === 'stats' && (
        <StatsModal
          stats={stats}
          onClose={() => setModal('none')}
        />
      )}

      {modal === 'help' && (
        <HelpModal
          onClose={() => setModal('none')}
        />
      )}
    </div>
  )
}
