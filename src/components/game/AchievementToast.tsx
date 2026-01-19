import { useEffect } from 'react';
import { Achievement } from '@/hooks/useAchievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

export const AchievementToast = ({ achievement, onComplete }: AchievementToastProps) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-achievement-slide-in">
      <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[hsl(222,50%,8%)] border-2 border-gold/60 gold-glow-intense shadow-2xl">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gold/20 text-3xl animate-achievement-icon-pulse">
          {achievement.icon}
        </div>
        
        {/* Content */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gold/80 font-display">
            Achievement Unlocked
          </span>
          <span className="font-display text-lg gold-text">
            {achievement.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {achievement.description}
          </span>
        </div>
      </div>
    </div>
  );
};
