import { useEffect, useCallback, useRef } from 'react';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { GameOver } from './GameOver';
import { GemCelebration } from './GemCelebration';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Star } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import blattLogo from '@/assets/blatt-logo.png';

// Ornate 8-pointed star SVG component
const OrnateStarIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(43, 74%, 66%)" />
        <stop offset="50%" stopColor="hsl(43, 74%, 79%)" />
        <stop offset="100%" stopColor="hsl(43, 74%, 66%)" />
      </linearGradient>
    </defs>
    <path 
      d="M12 0L13.5 8.5L20.5 3.5L15.5 10.5L24 12L15.5 13.5L20.5 20.5L13.5 15.5L12 24L10.5 15.5L3.5 20.5L8.5 13.5L0 12L8.5 10.5L3.5 3.5L10.5 8.5L12 0Z"
      fill="url(#goldGradient)"
      stroke="hsl(43, 74%, 49%)"
      strokeWidth="0.5"
    />
  </svg>
);

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
          className="h-28 w-auto -ml-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" 
        />
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="menu-star w-12 h-12 flex items-center justify-center rounded-full bg-transparent hover:drop-shadow-[0_0_12px_hsl(43,74%,49%)] transition-all duration-300"
              aria-label="Open menu"
            >
              <OrnateStarIcon className="w-8 h-8" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[280px] bg-[hsl(222,47%,11%)] border-l-2 border-gold/50"
          >
            <SheetHeader className="border-b border-gold/30 pb-4">
              <SheetTitle className="font-display text-2xl gold-text tracking-wider">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              <Button
                onClick={resetGame}
                variant="ghost"
                className="w-full justify-start gap-4 text-gold hover:text-gold-light hover:bg-gold/10 font-display tracking-wide text-base py-6 transition-all duration-300 hover:drop-shadow-[0_0_8px_hsl(43,74%,49%)]"
              >
                <Sparkles className="w-5 h-5" />
                New Game
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-gold hover:text-gold-light hover:bg-gold/10 font-display tracking-wide text-base py-6 transition-all duration-300 hover:drop-shadow-[0_0_8px_hsl(43,74%,49%)]"
                onClick={() => {
                  alert('Swipe or use arrow keys to move tiles. Merge matching tiles to create gems. Reach the Diamond to win!');
                }}
              >
                <BookOpen className="w-5 h-5" />
                How to Play
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-gold hover:text-gold-light hover:bg-gold/10 font-display tracking-wide text-base py-6 transition-all duration-300 hover:drop-shadow-[0_0_8px_hsl(43,74%,49%)]"
                onClick={() => {
                  window.open('https://apps.apple.com/app/id000000000', '_blank');
                }}
              >
                <Star className="w-5 h-5" />
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


      {/* Gem Celebration Overlay */}
      <GemCelebration 
        gemValue={newGemAchieved} 
        onComplete={clearGemCelebration} 
      />
    </div>
  );
};
