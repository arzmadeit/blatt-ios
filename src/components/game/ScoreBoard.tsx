import diamondImg from '@/assets/gems/diamond.png';
import { Crown } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  totalDiamonds?: number;
  prestigeLevel?: number;
  multiplier?: number;
}

export const ScoreBoard = ({ 
  score, 
  highScore, 
  totalDiamonds = 0,
  prestigeLevel = 0,
  multiplier = 1
}: ScoreBoardProps) => {
  return (
    <div className="flex gap-4 mb-6 items-end">
      {/* Diamond Counter */}
      <div 
        className="flex flex-col items-center justify-center px-3 py-3 rounded-lg bg-secondary gold-border-glow"
        style={{ border: '1.5px solid hsl(43 70% 45% / 0.6)' }}
      >
        <img src={diamondImg} alt="Diamonds" className="w-6 h-6" />
        <span className="text-lg font-display font-semibold gold-text">
          {totalDiamonds}
        </span>
      </div>

      {/* Score */}
      <div 
        className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary gold-border-glow"
        style={{ border: '1.5px solid hsl(43 70% 45% / 0.6)' }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display flex items-center gap-1">
          Score
          {multiplier > 1 && (
            <span className="text-gold text-[10px]">({multiplier.toFixed(1)}x)</span>
          )}
        </span>
        <span className="text-2xl font-display font-semibold gold-text">
          {score.toLocaleString()}
        </span>
      </div>

      {/* Best */}
      <div 
        className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary gold-border-glow relative"
        style={{ border: '1.5px solid hsl(43 70% 45% / 0.6)' }}
      >
        {prestigeLevel > 0 && (
          <Crown className="absolute -top-2 -right-2 w-5 h-5 text-gold" />
        )}
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
          Best
        </span>
        <span className="text-2xl font-display font-semibold gold-text">
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
