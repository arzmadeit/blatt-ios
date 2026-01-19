import { useEffect, useCallback, useRef } from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { GameOver } from './GameOver';
import { GemCelebration } from './GemCelebration';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Button } from '@/components/ui/button';
import { Menu, RotateCcw, HelpCircle, Star } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
          className="h-28 w-auto -ml-10 drop-shadow-[0_0_40px_rgba(0,0,0,1)] drop-shadow-[0_0_20px_rgba(0,0,0,1)]" 
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background border-primary/30">
            <SheetHeader>
              <SheetTitle className="font-display text-primary">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-8">
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full justify-start gap-3 border-primary/50 text-foreground hover:bg-primary/10"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-primary/50 text-foreground hover:bg-primary/10"
                onClick={() => {
                  // Could open a dialog with instructions
                  alert('Swipe or use arrow keys to move tiles. Merge matching tiles to create gems. Reach the Diamond to win!');
                }}
              >
                <HelpCircle className="w-4 h-4" />
                How to Play
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-primary/50 text-foreground hover:bg-primary/10"
                onClick={() => {
                  // Replace with actual App Store URL
                  window.open('https://apps.apple.com/app/id000000000', '_blank');
                }}
              >
                <Star className="w-4 h-4" />
                Rate Us
              </Button>
            </div>
          </SheetContent>
        </Sheet>
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

      {/* Gem Celebration Overlay */}
      <GemCelebration 
        gemValue={newGemAchieved} 
        onComplete={clearGemCelebration} 
      />
    </div>
  );
};
