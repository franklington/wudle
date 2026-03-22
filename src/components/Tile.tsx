import type { TileData } from '../types'

interface TileProps {
  data: TileData
  delay?: number
  isRevealing?: boolean
}

const stateClasses: Record<string, string> = {
  correct: 'tile-correct',
  present: 'tile-present',
  absent:  'tile-absent',
  empty:   'tile-empty',
}

export default function Tile({ data, delay = 0, isRevealing = false }: TileProps) {
  const { letter, state } = data
  const hasLetter = letter !== ''
  const revealed = state !== 'empty' && isRevealing

  return (
    <div
      className={`tile ${stateClasses[state]} ${hasLetter && state === 'empty' ? 'tile-filled' : ''} ${revealed ? 'tile-reveal' : ''}`}
      style={revealed ? { animationDelay: `${delay}ms` } : undefined}
    >
      {letter}
    </div>
  )
}
