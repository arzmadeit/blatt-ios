import { Achievement } from '@/hooks/useAchievements';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock } from 'lucide-react';

interface AchievementsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
}

export const AchievementsPanel = ({ 
  open, 
  onOpenChange, 
  achievements,
  unlockedCount,
  totalCount 
}: AchievementsPanelProps) => {
  const categories: { key: Achievement['category']; label: string }[] = [
    { key: 'gems', label: 'Gems' },
    { key: 'score', label: 'Score' },
    { key: 'skill', label: 'Skill' },
    { key: 'prestige', label: 'Prestige' },
  ];

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return achievements.filter(a => a.category === category);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,50%,8%)] border-2 border-gold/50 max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl gold-text tracking-wider text-center">
            Achievements
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            {unlockedCount} / {totalCount} Unlocked
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {categories.map(({ key, label }) => {
            const categoryAchievements = getAchievementsByCategory(key);
            if (categoryAchievements.length === 0) return null;
            
            return (
              <div key={key} className="space-y-3">
                <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground border-b border-gold/20 pb-2">
                  {label}
                </h3>
                <div className="grid gap-3">
                  {categoryAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const { unlocked, name, description, icon, progress, target, unlockedAt } = achievement;
  
  return (
    <div 
      className={`
        flex items-center gap-4 p-3 rounded-lg border transition-all
        ${unlocked 
          ? 'bg-gold/10 border-gold/40 gold-border-glow' 
          : 'bg-secondary/30 border-muted/20 opacity-60'
        }
      `}
    >
      {/* Icon */}
      <div className={`
        w-12 h-12 flex items-center justify-center rounded-full text-2xl
        ${unlocked ? 'bg-gold/20' : 'bg-muted/20'}
      `}>
        {unlocked ? icon : <Lock className="w-5 h-5 text-muted-foreground" />}
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-display text-sm truncate ${unlocked ? 'gold-text' : 'text-muted-foreground'}`}>
          {unlocked ? name : '???'}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {unlocked ? description : 'Keep playing to unlock'}
        </p>
        
        {/* Progress bar for progressive achievements */}
        {target && !unlocked && progress !== undefined && (
          <div className="mt-2">
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold/60 rounded-full transition-all"
                style={{ width: `${Math.min(100, (progress / target) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress} / {target}
            </p>
          </div>
        )}
        
        {/* Unlock date */}
        {unlocked && unlockedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
