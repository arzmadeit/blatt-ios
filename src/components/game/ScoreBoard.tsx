interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard = ({ score, highScore }: ScoreBoardProps) => {
  return (
    <div className="flex gap-6 mb-6">
      <div 
        className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary gold-border-glow"
        style={{
          border: '1.5px solid hsl(43 70% 45% / 0.6)',
        }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
          Score
        </span>
        <span 
          className="text-2xl font-display font-semibold gold-text"
        >
          {score.toLocaleString()}
        </span>
      </div>
      <div 
        className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary gold-border-glow"
        style={{
          border: '1.5px solid hsl(43 70% 45% / 0.6)',
        }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
          Best
        </span>
        <span 
          className="text-2xl font-display font-semibold gold-text"
        >
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
