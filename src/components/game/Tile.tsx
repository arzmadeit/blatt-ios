import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Import all tile images
import tile1 from '@/assets/tiles/tile_1.png';
import tile2 from '@/assets/tiles/tile_2.png';
import tile3 from '@/assets/tiles/tile_3.png';
import tile4 from '@/assets/tiles/tile_4.png';
import tile5 from '@/assets/tiles/tile_5.png';
import tile6 from '@/assets/tiles/tile_6.png';
import tile7 from '@/assets/tiles/tile_7.png';
import tile8 from '@/assets/tiles/tile_8.png';
import tile9 from '@/assets/tiles/tile_9.png';
import tile10 from '@/assets/tiles/tile_10.png';
import tile11 from '@/assets/tiles/tile_11.png';

const tileImages: Record<number, string> = {
  1: tile1,
  2: tile2,
  3: tile3,
  4: tile4,
  5: tile5,
  6: tile6,
  7: tile7,
  8: tile8,
  9: tile9,
  10: tile10,
  11: tile11,
};

interface TileProps {
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

const CELL_SIZE = 80;
const GAP = 8;

export const Tile = ({ value, row, col, isNew, isMerged }: TileProps) => {
  const [showMergeGlow, setShowMergeGlow] = useState(false);
  const [showPopAnimation, setShowPopAnimation] = useState(false);

  useEffect(() => {
    if (isMerged) {
      setShowMergeGlow(true);
      setShowPopAnimation(true);
      
      const timer = setTimeout(() => {
        setShowMergeGlow(false);
        setShowPopAnimation(false);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [isMerged]);

  const x = col * (CELL_SIZE + GAP) + GAP;
  const y = row * (CELL_SIZE + GAP) + GAP;

  const imageUrl = tileImages[value] || tileImages[11];

  return (
    <div
      className={cn(
        "absolute rounded-lg overflow-hidden",
        "transition-all duration-150 ease-out",
        isNew && "animate-tile-appear",
        showPopAnimation && "animate-tile-pop",
        showMergeGlow && "animate-merge-glow"
      )}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <img
        src={imageUrl}
        alt={`Tile level ${value}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      {/* Gold border overlay */}
      <div 
        className={cn(
          "absolute inset-0 rounded-lg pointer-events-none",
          "border-2 border-primary/60",
          showMergeGlow && "border-primary"
        )}
      />
    </div>
  );
};
