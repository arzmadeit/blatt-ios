import diamondImg from '@/assets/gems/diamond.png';
import crown1 from '@/assets/crowns/crown1.png';
import crown2 from '@/assets/crowns/crown2.png';
import crown3 from '@/assets/crowns/crown3.png';
import crown4 from '@/assets/crowns/crown4.png';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  totalDiamonds?: number;
  prestigeLevel?: number;
  multiplier?: number;
}

const getCrownImage = (prestigeLevel: number) => {
  if (prestigeLevel === 0) return null;
  if (prestigeLevel <= 2) return crown1;
  if (prestigeLevel <= 5) return crown2;
  if (prestigeLevel <= 9) return crown3;
  return crown4; // Level 10 (max)
};

export const ScoreBoard = ({ 
  score, 
  highScore, 
  totalDiamonds = 0,
  prestigeLevel = 0,
  multiplier = 1
}: ScoreBoardProps) => {
  const crownImage = getCrownImage(prestigeLevel);

  return (
    <div className="flex gap-4 mb-6 items-stretch">
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
        {crownImage && (
          <img 
            src={crownImage} 
            alt="Prestige Crown" 
            className="absolute -top-3 -right-3 w-7 h-7 object-contain"
          />
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
