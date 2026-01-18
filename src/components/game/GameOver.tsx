import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  onRetry: () => void;
}

export const GameOver = ({ score, onRetry }: GameOverProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 rounded-xl overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 p-8 rounded-xl bg-card border-2 border-primary/50 gold-glow">
        <h2 className="text-3xl font-display text-primary font-semibold tracking-wide">
          Game Over
        </h2>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-1">Final Score</p>
          <p className="text-4xl font-display text-foreground font-semibold">
            {score.toLocaleString()}
          </p>
        </div>

        <Button
          onClick={onRetry}
          className="px-8 py-2 font-display tracking-widest uppercase text-sm"
          variant="default"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
