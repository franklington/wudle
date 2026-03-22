import type { Stats } from '../types'

interface StatsModalProps {
  stats: Stats
  onClose: () => void
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0

  const maxDist = Math.max(...stats.distribution, 1)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="modal-title">Statistics</h2>

        <div className="stats-row">
          <div className="stat-item"><div className="stat-val">{stats.gamesPlayed}</div><div className="stat-label">Played</div></div>
          <div className="stat-item"><div className="stat-val">{winPct}%</div><div className="stat-label">Win %</div></div>
          <div className="stat-item"><div className="stat-val">{stats.currentStreak}</div><div className="stat-label">Streak</div></div>
          <div className="stat-item"><div className="stat-val">{stats.maxStreak}</div><div className="stat-label">Best</div></div>
        </div>

        <h3 className="dist-title">Guess Distribution</h3>
        <div className="distribution">
          {stats.distribution.map((count, i) => (
            <div key={i} className="dist-row">
              <div className="dist-num">{i + 1}</div>
              <div className="dist-bar-wrap">
                <div
                  className="dist-bar"
                  style={{ width: `${Math.round((count / maxDist) * 100)}%` }}
                >
                  {count > 0 && <span>{count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
