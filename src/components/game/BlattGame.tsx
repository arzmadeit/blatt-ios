import { useEffect, useCallback, useRef, useState } from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { GameOver } from './GameOver';
import { GemCelebration } from './GemCelebration';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import blattLogo from '@/assets/blatt-logo.png';

export const BlattGame = () => {
  const { 
    tiles, 
    score, 
    highScore, 
    gameOver, 
    move, 
    resetGame,
    newGemAchieved,
    clearGemCelebration,
  } = useGameLogic();
  const [debugGem, setDebugGem] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || newGemAchieved) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        move('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        move('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        move('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        move('right');
        break;
    }
  }, [move, gameOver, newGemAchieved]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || gameOver || newGemAchieved) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }

    touchStartRef.current = null;
  }, [move, gameOver, newGemAchieved]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div 
      className="flex flex-col items-center select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[360px] mb-6">
        <img 
          src={blattLogo} 
          alt="BLATT" 
          className="h-28 w-auto -ml-10" 
        />
        <Button
          onClick={resetGame}
          variant="outline"
          size="icon"
          className="border-primary/50 text-primary hover:bg-primary/10"
          title="New Game"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <ScoreBoard score={score} highScore={highScore} />

      {/* Game Grid Container */}
      <div className="relative">
        <Grid tiles={tiles} />
        {gameOver && <GameOver score={score} onRetry={resetGame} />}
      </div>

      {/* Instructions */}
      <p className="mt-6 text-sm text-muted-foreground text-center font-body">
        Use arrow keys or swipe to move tiles
      </p>

      {/* Debug Panel */}
      <div className="mt-4">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground"
        >
          {showDebug ? 'Hide' : 'Preview'} Gem Animations
        </button>
        {showDebug && (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setDebugGem(8)} 
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-500"
            >
              Emerald
            </button>
            <button 
              onClick={() => setDebugGem(9)} 
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Sapphire
            </button>
            <button 
              onClick={() => setDebugGem(10)} 
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
            >
              Ruby
            </button>
            <button 
              onClick={() => setDebugGem(11)} 
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-500"
            >
              Diamond
            </button>
          </div>
        )}
      </div>

      {/* Gem Celebration Overlay */}
      <GemCelebration 
        gemValue={debugGem || newGemAchieved} 
        onComplete={() => {
          setDebugGem(null);
          clearGemCelebration();
        }} 
      />
    </div>
  );
};
