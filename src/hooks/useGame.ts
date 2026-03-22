import { useState, useCallback } from 'react'
import type { LetterState, GameStatus, TileData } from '../types'
import { evaluateGuess, getKeyboardState } from '../utils/gameLogic'
import { getDailyWord, getTodayDateString } from '../utils/dailyWord'

const MAX_GUESSES = 6
const WORD_LENGTH = 5

export interface GameState {
  answer: string
  today: string
  board: TileData[][]
  currentRow: number
  currentInput: string
  guesses: string[]
  evaluations: LetterState[][]
  keyboardState: Record<string, LetterState>
  status: GameStatus
  shake: boolean
}

function buildEmptyBoard(): TileData[][] {
  return Array.from({ length: MAX_GUESSES }, () =>
    Array.from({ length: WORD_LENGTH }, () => ({ letter: '', state: 'empty' as LetterState }))
  )
}

function deriveBoard(
  guesses: string[],
  evaluations: LetterState[][],
  currentInput: string,
  currentRow: number
): TileData[][] {
  const board = buildEmptyBoard()
  guesses.forEach((g, ri) => {
    g.split('').forEach((ch, ci) => {
      board[ri][ci] = { letter: ch.toUpperCase(), state: evaluations[ri][ci] }
    })
  })
  if (currentRow < MAX_GUESSES) {
    currentInput.split('').forEach((ch, ci) => {
      board[currentRow][ci] = { letter: ch.toUpperCase(), state: 'empty' }
    })
  }
  return board
}

export function useGame() {
  const answer = getDailyWord()
  const today = getTodayDateString()

  const [guesses, setGuesses] = useState<string[]>([])
  const [evaluations, setEvaluations] = useState<LetterState[][]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [shake, setShake] = useState(false)

  const currentRow = guesses.length

  const keyboardState = getKeyboardState(guesses, evaluations)

  const board = deriveBoard(guesses, evaluations, currentInput, currentRow)

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }, [])

  const submitGuess = useCallback((): string | null => {
    if (status !== 'playing') return null
    if (currentInput.length < WORD_LENGTH) {
      triggerShake()
      return 'Not enough letters'
    }
    const guess = currentInput.toLowerCase()
    const eval_ = evaluateGuess(guess, answer)
    const newGuesses = [...guesses, guess]
    const newEvals = [...evaluations, eval_]
    setGuesses(newGuesses)
    setEvaluations(newEvals)
    setCurrentInput('')

    if (guess === answer) {
      setStatus('won')
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost')
    }
    return null
  }, [status, currentInput, guesses, evaluations, answer, triggerShake])

  const addLetter = useCallback((letter: string) => {
    if (status !== 'playing') return
    if (currentInput.length >= WORD_LENGTH) return
    setCurrentInput(prev => prev + letter.toLowerCase())
  }, [status, currentInput])

  const deleteLetter = useCallback(() => {
    setCurrentInput(prev => prev.slice(0, -1))
  }, [])

  return {
    answer,
    today,
    board,
    currentRow,
    currentInput,
    guesses,
    evaluations,
    keyboardState,
    status,
    shake,
    submitGuess,
    addLetter,
    deleteLetter,
  }
}
