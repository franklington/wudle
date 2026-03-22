import { useState, useCallback } from 'react'
import type { Stats } from '../types'

const STORAGE_KEY = 'wudle-stats'

function defaultStats(): Stats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: '',
    lastWonDate: '',
  }
}

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStats()
    return { ...defaultStats(), ...JSON.parse(raw) }
  } catch {
    return defaultStats()
  }
}

function saveStats(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(loadStats)

  const recordWin = useCallback((attemptNumber: number, today: string) => {
    setStats(prev => {
      const isConsecutive =
        prev.lastWonDate
          ? Math.abs(new Date(today).getTime() - new Date(prev.lastWonDate).getTime()) <= 86_400_000 * 1.5
          : true
      const currentStreak = isConsecutive ? prev.currentStreak + 1 : 1
      const distribution = [...prev.distribution]
      distribution[attemptNumber - 1] = (distribution[attemptNumber - 1] ?? 0) + 1
      const next: Stats = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak,
        maxStreak: Math.max(prev.maxStreak, currentStreak),
        distribution,
        lastPlayedDate: today,
        lastWonDate: today,
      }
      saveStats(next)
      return next
    })
  }, [])

  const recordLoss = useCallback((today: string) => {
    setStats(prev => {
      const next: Stats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        currentStreak: 0,
        lastPlayedDate: today,
      }
      saveStats(next)
      return next
    })
  }, [])

  return { stats, recordWin, recordLoss }
}
