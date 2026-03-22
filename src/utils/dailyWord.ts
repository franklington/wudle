import { ANSWER_WORDS } from "../data/wordList"

const EPOCH_START = new Date("2024-01-01").getTime()
const MS_PER_DAY = 86_400_000

export function getDayIndex(): number {
  return Math.floor((Date.now() - EPOCH_START) / MS_PER_DAY)
}

export function getDailyWord(): string {
  const idx = getDayIndex() % ANSWER_WORDS.length
  return ANSWER_WORDS[idx]
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}
