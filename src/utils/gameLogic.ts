import type { LetterState } from "../types"

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent")
  const answerArr = answer.split("")
  const guessArr = guess.split("")
  const remaining: (string | null)[] = [...answerArr]
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct"
      remaining[i] = null
    }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue
    const idx = remaining.indexOf(guessArr[i])
    if (idx !== -1) {
      result[i] = "present"
      remaining[idx] = null
    }
  }
  return result
}

export function getKeyboardState(
  guesses: string[],
  evaluations: LetterState[][]
): Record<string, LetterState> {
  const state: Record<string, LetterState> = {}
  const priority: Record<LetterState, number> = { correct: 3, present: 2, absent: 1, empty: 0 }
  guesses.forEach((guess, ri) => {
    guess.split("").forEach((letter, ci) => {
      const newState = evaluations[ri][ci]
      const existing = state[letter]
      if (!existing || priority[newState] > priority[existing]) {
        state[letter] = newState
      }
    })
  })
  return state
}
