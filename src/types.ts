export type LetterState = 'correct' | 'present' | 'absent' | 'empty'

export interface TileData {
  letter: string
  state: LetterState
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface Stats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  distribution: number[] // index 0..5 = solved in attempt 1..6
  lastPlayedDate: string
  lastWonDate: string
}

export interface UDDefinition {
  word: string
  definition: string
  example: string
  thumbsUp: number
  thumbsDown: number
  source: 'urban-dictionary' | 'wikipedia'
}
