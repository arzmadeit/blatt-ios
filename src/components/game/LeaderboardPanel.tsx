import { ScoreEntry } from '@/hooks/usePlayerStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  top10Scores: ScoreEntry[];
  currentScore?: number;
}

export const LeaderboardPanel = ({ 
  open, 
  onOpenChange, 
  top10Scores,
  currentScore 
}: LeaderboardPanelProps) => {
  // Find where current score would rank
  const getCurrentRank = () => {
    if (!currentScore) return null;
    const rank = top10Scores.filter(s => s.score > currentScore).length + 1;
    return rank <= 10 ? rank : null;
  };

  const currentRank = getCurrentRank();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-display">{rank}</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,50%,8%)] border-2 border-gold/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gold-text tracking-wider text-center">
            Leaderboard
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Your Personal Best Scores
          </p>
        </DialogHeader>
        
        <div className="py-4">
          {/* Current game preview */}
          {currentScore !== undefined && currentScore > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Current Game
              </p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl gold-text">
                  {currentScore.toLocaleString()}
                </span>
                {currentRank && (
                  <span className="text-sm text-gold">
                    Would be #{currentRank}!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {top10Scores.length > 0 ? (
            <div className="space-y-2">
              {top10Scores.map((entry, index) => (
                <div 
                  key={`${entry.score}-${entry.date}`}
                  className={`
                    flex items-center gap-4 p-3 rounded-lg transition-all
                    ${index === 0 
                      ? 'bg-gold/15 border border-gold/40' 
                      : 'bg-secondary/30 border border-transparent'
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  {/* Score */}
                  <div className="flex-1">
                    <span className={`font-display text-lg ${index === 0 ? 'gold-text' : 'text-foreground'}`}>
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No scores yet!</p>
              <p className="text-sm text-muted-foreground mt-1">Play a game to start your leaderboard</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
