import { PrestigeData } from '@/hooks/usePlayerStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface PrestigePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestige: PrestigeData;
  canPrestige: boolean;
  totalDiamonds: number;
  onPrestige: () => void;
}

export const PrestigePanel = ({ 
  open, 
  onOpenChange, 
  prestige,
  canPrestige,
  totalDiamonds,
  onPrestige
}: PrestigePanelProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const nextMultiplier = Math.min(2.0, 1.0 + ((prestige.level + 1) * 0.1));
  const isMaxPrestige = prestige.multiplier >= 2.0;

  const handlePrestige = () => {
    onPrestige();
    setShowConfirm(false);
    onOpenChange(false);
  };

  // Get crown variant based on prestige level
  const getCrownStyle = () => {
    if (prestige.level === 0) return 'text-muted-foreground';
    if (prestige.level < 5) return 'text-gold';
    if (prestige.level < 10) return 'text-gold-light animate-pulse-gold';
    return 'gold-text animate-gem-pulse';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,50%,8%)] border-2 border-gold/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gold-text tracking-wider text-center flex items-center justify-center gap-2">
            <Crown className={`w-6 h-6 ${getCrownStyle()}`} />
            Prestige
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Current Status */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
              <Crown className="w-5 h-5 text-gold" />
              <span className="font-display text-lg gold-text">
                Level {prestige.level}
              </span>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Multiplier</p>
                <p className="font-display text-xl text-foreground">{prestige.multiplier.toFixed(1)}x</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Score</p>
                <p className="font-display text-xl text-foreground">{prestige.totalPrestigeScore.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Next Level Preview */}
          {!isMaxPrestige && (
            <div className="p-4 rounded-lg bg-secondary/30 border border-gold/20 space-y-3">
              <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Next Level Rewards
              </h4>
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-gold" />
                <div>
                  <p className="font-display text-gold">
                    {nextMultiplier.toFixed(1)}x Score Multiplier
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +10% boost to all scores
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Max Prestige */}
          {isMaxPrestige && (
            <div className="p-4 rounded-lg bg-gold/10 border border-gold/40 text-center">
              <p className="font-display text-lg gold-text">Maximum Prestige Reached!</p>
              <p className="text-sm text-muted-foreground mt-1">
                You've achieved the 2x score multiplier cap
              </p>
            </div>
          )}

          {/* Prestige Button / Confirmation */}
          {!showConfirm ? (
            <div className="space-y-3">
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!canPrestige || isMaxPrestige}
                className="w-full font-display tracking-widest uppercase py-6"
                variant={canPrestige && !isMaxPrestige ? 'default' : 'secondary'}
              >
                <Crown className="w-5 h-5 mr-2" />
                {isMaxPrestige ? 'Max Prestige' : 'Prestige Now'}
              </Button>
              
              {!canPrestige && (
                <p className="text-center text-sm text-muted-foreground">
                  Earn at least one Diamond to unlock Prestige
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-destructive">Are you sure?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prestiging will reset your high score and leaderboard. 
                    Your achievements, lifetime stats, and diamond count will be kept.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePrestige}
                  variant="destructive"
                  className="flex-1 font-display"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Total Diamonds Earned: {totalDiamonds} 💎</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
