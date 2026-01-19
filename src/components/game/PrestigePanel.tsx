import { PrestigeData } from '@/hooks/usePlayerStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import crown1 from '@/assets/crowns/crown1.png';
import crown2 from '@/assets/crowns/crown2.png';
import crown3 from '@/assets/crowns/crown3.png';
import crown4 from '@/assets/crowns/crown4.png';

interface PrestigePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prestige: PrestigeData;
  canPrestige: boolean;
  totalDiamonds: number;
  onPrestige: () => void;
}

const getCrownImage = (prestigeLevel: number) => {
  if (prestigeLevel === 0) return null;
  if (prestigeLevel <= 2) return crown1;
  if (prestigeLevel <= 5) return crown2;
  if (prestigeLevel <= 9) return crown3;
  return crown4; // Level 10 (max)
};

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
  const crownImage = getCrownImage(prestige.level);
  const nextCrownImage = getCrownImage(prestige.level + 1);

  const handlePrestige = () => {
    onPrestige();
    setShowConfirm(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,50%,8%)] border-2 border-gold/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gold-text tracking-wider text-center flex items-center justify-center gap-2">
            {crownImage ? (
              <img src={crownImage} alt="Prestige Crown" className="w-7 h-7 object-contain" />
            ) : (
              <img src={crown1} alt="Prestige Crown" className="w-7 h-7 object-contain opacity-40" />
            )}
            Prestige
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Current Status */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
              {crownImage ? (
                <img src={crownImage} alt="Crown" className="w-6 h-6 object-contain" />
              ) : (
                <img src={crown1} alt="Crown" className="w-6 h-6 object-contain opacity-40" />
              )}
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
              {nextCrownImage && nextCrownImage !== crownImage && (
                <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
                  <img src={nextCrownImage} alt="Next Crown" className="w-8 h-8 object-contain" />
                  <p className="text-sm text-muted-foreground">New crown unlocked!</p>
                </div>
              )}
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
                {nextCrownImage && (
                  <img src={nextCrownImage} alt="Crown" className="w-5 h-5 mr-2 object-contain" />
                )}
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
