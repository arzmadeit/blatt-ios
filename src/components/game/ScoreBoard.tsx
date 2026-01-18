interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export const ScoreBoard = ({ score, highScore }: ScoreBoardProps) => {
  return (
    <div className="flex gap-6 mb-6">
      <div className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary border border-primary/30">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
          Score
        </span>
        <span className="text-2xl font-display text-primary font-semibold">
          {score.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col items-center px-6 py-3 rounded-lg bg-secondary border border-primary/30">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
          Best
        </span>
        <span className="text-2xl font-display text-primary font-semibold">
          {highScore.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
