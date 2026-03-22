import { ANSWER_WORDS } from '../data/wordList'
import { supabase } from '../lib/supabase'

const CACHE_KEY = 'wudle-wordlist'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry {
  words: string[]
  fetchedAt: number
}

// In-memory list, initialised synchronously from localStorage or static list
let wordList: string[] = loadFromCache() ?? ANSWER_WORDS

function loadFromCache(): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
    if (!Array.isArray(entry.words) || entry.words.length === 0) return null
    return entry.words
  } catch {
    return null
  }
}

/** Returns the current word list synchronously (static list or cached Supabase data). */
export function getWordListSync(): string[] {
  return wordList
}

/**
 * Fetches the active word list from Supabase and updates the in-memory list
 * and localStorage cache. Safe to call fire-and-forget.
 */
export async function refreshWordList(): Promise<void> {
  if (!supabase) return

  try {
    const { data, error } = await supabase
      .from('words')
      .select('word')
      .eq('active', true)

    if (error || !data) return

    const fetched = data
      .map((r: { word: string }) => r.word.toLowerCase().trim())
      .filter((w: string) => /^[a-z]{5}$/.test(w))

    if (fetched.length === 0) return

    wordList = fetched

    const entry: CacheEntry = { words: fetched, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // network failure — keep existing list
  }
}
