import { Tile } from './Tile';
import type { Tile as TileType } from '@/hooks/useGameLogic';

interface GridProps {
  tiles: TileType[];
}

const GRID_SIZE = 4;
const CELL_SIZE = 80;
const GAP = 8;

export const Grid = ({ tiles }: GridProps) => {
  const gridSize = GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * GAP;

  return (
    <div 
      className="relative rounded-xl"
      style={{
        width: gridSize,
        height: gridSize,
        background: 'hsl(var(--grid-bg))',
        border: '3px solid transparent',
        borderImage: 'linear-gradient(135deg, hsl(43 85% 55%), hsl(45 95% 70%), hsl(43 85% 55%), hsl(40 75% 40%)) 1',
        boxShadow: '0 0 15px hsl(43 85% 55% / 0.25), inset 0 0 10px hsl(43 85% 55% / 0.1)',
      }}
    >
      {/* Background cells with subtle golden tint */}
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const x = col * (CELL_SIZE + GAP) + GAP;
        const y = row * (CELL_SIZE + GAP) + GAP;

        return (
          <div
            key={`cell-${row}-${col}`}
            className="absolute rounded-lg"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              transform: `translate(${x}px, ${y}px)`,
              background: 'hsl(var(--cell-bg))',
              border: '1px solid hsl(43 70% 45% / 0.12)',
              boxShadow: 'inset 0 0 8px hsl(43 85% 55% / 0.05)',
            }}
          />
        );
      })}

      {/* Tiles */}
      {tiles.map((tile) => (
        <Tile
          key={tile.id}
          value={tile.value}
          row={tile.row}
          col={tile.col}
          isNew={tile.isNew}
          isMerged={tile.isMerged}
        />
      ))}
    </div>
  );
};
