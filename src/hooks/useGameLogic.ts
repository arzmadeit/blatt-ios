import { useState, useCallback, useEffect } from 'react';

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

type Grid = (Tile | null)[][];
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;
const MAX_TILE_VALUE = 11;

// Gem tile values that trigger celebration
export const GEM_TILE_VALUES = [8, 9, 10, 11]; // emerald, sapphire, ruby, diamond

let tileIdCounter = 0;

const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

const getEmptyCells = (grid: Grid): { row: number; col: number }[] => {
  const empty: { row: number; col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
};

const addRandomTile = (grid: Grid): Grid => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = {
    id: ++tileIdCounter,
    value: 1,
    row,
    col,
    isNew: true,
  };
  return newGrid;
};

const cloneGrid = (grid: Grid): Grid => {
  return grid.map(row => row.map(tile => tile ? { ...tile, isNew: false, isMerged: false } : null));
};

export const useGameLogic = () => {
  const [grid, setGrid] = useState<Grid>(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    return newGrid;
  });

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('blatt-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [newGemAchieved, setNewGemAchieved] = useState<number | null>(null);
  // Reset achieved gems each session so celebrations always show
  const [achievedGems, setAchievedGems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('blatt-high-score', score.toString());
    }
  }, [score, highScore]);

  const canMove = useCallback((grid: Grid): boolean => {
    // Check for empty cells
    if (getEmptyCells(grid).length > 0) return true;

    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tile = grid[row][col];
        if (!tile) continue;
        
        // Check right
        if (col < GRID_SIZE - 1) {
          const right = grid[row][col + 1];
          if (right && right.value === tile.value && tile.value < MAX_TILE_VALUE) return true;
        }
        // Check down
        if (row < GRID_SIZE - 1) {
          const down = grid[row + 1][col];
          if (down && down.value === tile.value && tile.value < MAX_TILE_VALUE) return true;
        }
      }
    }
    return false;
  }, []);

  // Haptic feedback helper for iOS
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const durations = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(durations[intensity]);
    }
  }, []);

  const move = useCallback((direction: Direction) => {
    if (isMoving || gameOver) return;
    
    setIsMoving(true);
    let hasMerged = false;

    setGrid(currentGrid => {
      let newGrid = cloneGrid(currentGrid);
      let moved = false;
      let scoreGain = 0;
      const newlyCreatedGems: number[] = [];

      const processLine = (line: (Tile | null)[]): (Tile | null)[] => {
        // Remove nulls and pack tiles
        let tiles = line.filter((t): t is Tile => t !== null);
        const result: (Tile | null)[] = [];

        let i = 0;
        while (i < tiles.length) {
          if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value && tiles[i].value < MAX_TILE_VALUE) {
            // Merge tiles
            const newValue = tiles[i].value + 1;
            result.push({
              id: ++tileIdCounter,
              value: newValue,
              row: 0,
              col: 0,
              isMerged: true,
            });
            scoreGain += Math.pow(2, newValue);
            hasMerged = true;
            
            // Check if this is a new gem achievement
            if (GEM_TILE_VALUES.includes(newValue)) {
              newlyCreatedGems.push(newValue);
            }
            
            i += 2;
            moved = true;
          } else {
            result.push({ ...tiles[i] });
            i++;
          }
        }

        // Pad with nulls
        while (result.length < GRID_SIZE) {
          result.push(null);
        }

        return result;
      };

      if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < GRID_SIZE; row++) {
          let line = newGrid[row];
          if (direction === 'right') line = [...line].reverse();
          
          const originalLine = JSON.stringify(line);
          line = processLine(line);
          
          if (JSON.stringify(line) !== originalLine) moved = true;
          
          if (direction === 'right') line = line.reverse();
          
          for (let col = 0; col < GRID_SIZE; col++) {
            if (line[col]) {
              line[col]!.row = row;
              line[col]!.col = col;
            }
            newGrid[row][col] = line[col];
          }
        }
      } else {
        for (let col = 0; col < GRID_SIZE; col++) {
          let line = newGrid.map(row => row[col]);
          if (direction === 'down') line = [...line].reverse();
          
          const originalLine = JSON.stringify(line);
          line = processLine(line);
          
          if (JSON.stringify(line) !== originalLine) moved = true;
          
          if (direction === 'down') line = line.reverse();
          
          for (let row = 0; row < GRID_SIZE; row++) {
            if (line[row]) {
              line[row]!.row = row;
              line[row]!.col = col;
            }
            newGrid[row][col] = line[row];
          }
        }
      }

      if (moved) {
        newGrid = addRandomTile(newGrid);
        setScore(s => s + scoreGain);
        
        // Trigger haptic feedback on merge
        if (hasMerged) {
          triggerHaptic('light');
        }

        // Check for new gem achievements - show celebration for each gem once per session
        if (newlyCreatedGems.length > 0) {
          const uncelebratedGem = newlyCreatedGems.find(gem => !achievedGems.has(gem));
          if (uncelebratedGem) {
            console.log('Gem celebration triggered for:', uncelebratedGem);
            setNewGemAchieved(uncelebratedGem);
            setAchievedGems(prev => new Set([...prev, uncelebratedGem]));
          }
        }

        // Check game over after adding new tile
        setTimeout(() => {
          if (!canMove(newGrid)) {
            setGameOver(true);
          }
        }, 200);
      }

      setTimeout(() => setIsMoving(false), 150);

      return moved ? newGrid : currentGrid;
    });
  }, [isMoving, gameOver, canMove, achievedGems, triggerHaptic]);

  const resetGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsMoving(false);
    setNewGemAchieved(null);
  }, []);

  const clearGemCelebration = useCallback(() => {
    setNewGemAchieved(null);
  }, []);

  // Get all tiles as flat array for rendering
  const tiles = grid.flat().filter((tile): tile is Tile => tile !== null);

  return {
    grid,
    tiles,
    score,
    highScore,
    gameOver,
    move,
    resetGame,
    newGemAchieved,
    clearGemCelebration,
  };
};
