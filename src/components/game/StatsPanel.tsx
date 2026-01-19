import { PlayerStats } from '@/hooks/usePlayerStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gem } from 'lucide-react';

// Import gem images
import emeraldImg from '@/assets/gems/emerald.png';
import sapphireImg from '@/assets/gems/sapphire.png';
import rubyImg from '@/assets/gems/ruby.png';
import diamondImg from '@/assets/gems/diamond.png';

interface StatsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PlayerStats;
}

export const StatsPanel = ({ open, onOpenChange, stats }: StatsPanelProps) => {
  const formatNumber = (n: number) => n.toLocaleString();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,50%,8%)] border-2 border-gold/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gold-text tracking-wider text-center">
            Statistics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Gems Collected */}
          <div className="space-y-3">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Gems Collected
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-1">
                <img src={emeraldImg} alt="Emerald" className="w-10 h-10" />
                <span className="font-display text-lg text-foreground">
                  {formatNumber(stats.totalGemsCollected.emerald)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img src={sapphireImg} alt="Sapphire" className="w-10 h-10" />
                <span className="font-display text-lg text-foreground">
                  {formatNumber(stats.totalGemsCollected.sapphire)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img src={rubyImg} alt="Ruby" className="w-10 h-10" />
                <span className="font-display text-lg text-foreground">
                  {formatNumber(stats.totalGemsCollected.ruby)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img src={diamondImg} alt="Diamond" className="w-10 h-10" />
                <span className="font-display text-lg text-foreground">
                  {formatNumber(stats.totalDiamondsEarned)}
                </span>
              </div>
            </div>
          </div>

          {/* Score Stats */}
          <div className="space-y-2">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Scores
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Best Score" value={formatNumber(stats.bestScore)} />
              <StatItem label="Total Score" value={formatNumber(stats.totalScore)} />
            </div>
          </div>

          {/* Game Stats */}
          <div className="space-y-2">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Gameplay
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Games Played" value={formatNumber(stats.gamesPlayed)} />
              <StatItem label="Total Moves" value={formatNumber(stats.totalMoves)} />
              <StatItem label="Total Merges" value={formatNumber(stats.totalMerges)} />
              <StatItem label="Highest Tile" value={`Level ${stats.highestTileReached}`} />
            </div>
          </div>

          {/* Streak Stats */}
          <div className="space-y-2">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Streaks
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Current Streak" value={`${stats.currentStreak} days`} highlight />
              <StatItem label="Longest Streak" value={`${stats.longestStreak} days`} />
            </div>
          </div>

          {/* Prestige Stats */}
          {stats.prestige.level > 0 && (
            <div className="space-y-2">
              <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                Prestige
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <StatItem label="Prestige Level" value={`${stats.prestige.level}`} highlight />
                <StatItem label="Score Multiplier" value={`${stats.prestige.multiplier.toFixed(1)}x`} />
                <StatItem label="Prestige Score" value={formatNumber(stats.prestige.totalPrestigeScore)} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={`font-display text-lg ${highlight ? 'gold-text' : 'text-foreground'}`}>
      {value}
    </span>
  </div>
);
