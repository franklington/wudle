import Tile from './Tile'
import type { TileData } from '../types'

interface BoardProps {
  board: TileData[][]
  revealRow: number
  shake: boolean
}

export default function Board({ board, revealRow, shake }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, ri) => (
        <div
          key={ri}
          className={`board-row ${ri === revealRow && shake ? 'shake' : ''}`}
        >
          {row.map((tile, ci) => (
            <Tile
              key={ci}
              data={tile}
              isRevealing={ri < revealRow}
              delay={ci * 100}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
