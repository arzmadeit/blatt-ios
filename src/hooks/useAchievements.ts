import { useState, useCallback, useEffect } from 'react';
import { PlayerStats } from './usePlayerStats';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  category: 'gems' | 'score' | 'prestige' | 'skill';
}

const STORAGE_KEY = 'blatt-achievements';

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Gem achievements
  { id: 'first_emerald', name: 'Green With Envy', description: 'Create your first Emerald', icon: '💚', category: 'gems' },
  { id: 'first_sapphire', name: 'Sapphire Seeker', description: 'Create your first Sapphire', icon: '💙', category: 'gems' },
  { id: 'first_ruby', name: 'Ruby Collector', description: 'Create your first Ruby', icon: '❤️', category: 'gems' },
  { id: 'first_diamond', name: 'Diamond Miner', description: 'Create your first Diamond', icon: '💎', category: 'gems' },
  { id: 'double_diamond', name: 'Twin Gems', description: 'Have 2 Diamonds on the board at once', icon: '💎💎', category: 'gems' },
  { id: 'triple_diamond', name: 'Diamond Dynasty', description: 'Have 3 Diamonds on the board at once', icon: '👑', category: 'gems' },
  { id: 'diamonds_10', name: 'Diamond Collector', description: 'Collect 10 lifetime Diamonds', icon: '🏆', category: 'gems', progress: 0, target: 10 },
  { id: 'diamonds_50', name: 'Diamond Baron', description: 'Collect 50 lifetime Diamonds', icon: '🎖️', category: 'gems', progress: 0, target: 50 },
  { id: 'diamonds_100', name: 'Diamond Emperor', description: 'Collect 100 lifetime Diamonds', icon: '👸', category: 'gems', progress: 0, target: 100 },
  
  // Score achievements
  { id: 'score_10k', name: 'Treasure Hunter', description: 'Reach 10,000 points in a single game', icon: '🪙', category: 'score', target: 10000 },
  { id: 'score_50k', name: 'Royal Fortune', description: 'Reach 50,000 points in a single game', icon: '💰', category: 'score', target: 50000 },
  { id: 'score_100k', name: 'Legendary Hoard', description: 'Reach 100,000 points in a single game', icon: '🏰', category: 'score', target: 100000 },
  { id: 'score_250k', name: 'Mythical Wealth', description: 'Reach 250,000 points in a single game', icon: '🐉', category: 'score', target: 250000 },
  
  // Skill achievements
  { id: 'games_10', name: 'Dedicated Player', description: 'Play 10 games', icon: '🎮', category: 'skill', progress: 0, target: 10 },
  { id: 'games_50', name: 'Blatt Enthusiast', description: 'Play 50 games', icon: '🎯', category: 'skill', progress: 0, target: 50 },
  { id: 'games_100', name: 'Blatt Master', description: 'Play 100 games', icon: '⭐', category: 'skill', progress: 0, target: 100 },
  { id: 'streak_7', name: 'Weekly Warrior', description: 'Maintain a 7-day play streak', icon: '🔥', category: 'skill', progress: 0, target: 7 },
  { id: 'streak_30', name: 'Monthly Champion', description: 'Maintain a 30-day play streak', icon: '🌟', category: 'skill', progress: 0, target: 30 },
  { id: 'merges_1000', name: 'Merge Master', description: 'Perform 1,000 merges', icon: '🔄', category: 'skill', progress: 0, target: 1000 },
  { id: 'transcendent', name: 'Transcendent', description: 'Create a Super Diamond (merge two Diamonds)', icon: '✨', category: 'skill' },
  
  // Prestige achievements  
  { id: 'prestige_1', name: 'Ascended', description: 'Complete your first Prestige', icon: '🌀', category: 'prestige' },
  { id: 'prestige_5', name: 'Enlightened', description: 'Reach Prestige level 5', icon: '🌈', category: 'prestige' },
  { id: 'prestige_10', name: 'Transcendant Master', description: 'Reach Prestige level 10', icon: '🌌', category: 'prestige' },
];

const loadAchievements = (): Achievement[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedAchievements = JSON.parse(saved) as Achievement[];
      // Merge with definitions to handle new achievements
      return achievementDefinitions.map(def => {
        const saved = savedAchievements.find(a => a.id === def.id);
        return saved ? { ...def, ...saved } : { ...def, unlocked: false };
      });
    }
  } catch (e) {
    console.error('Failed to load achievements:', e);
  }
  return achievementDefinitions.map(def => ({ ...def, unlocked: false }));
};

const saveAchievements = (achievements: Achievement[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements:', e);
  }
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  // Persist achievements on change
  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  // Unlock an achievement
  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const updated = prev.map(a => 
        a.id === id 
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      );
      
      // Set newly unlocked for toast
      const unlockedAchievement = updated.find(a => a.id === id);
      if (unlockedAchievement) {
        setNewlyUnlocked(unlockedAchievement);
      }
      
      return updated;
    });
  }, []);

  // Update progress for a progressive achievement
  const updateProgress = useCallback((id: string, progress: number) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (!achievement || achievement.unlocked) return prev;

      const shouldUnlock = achievement.target && progress >= achievement.target;
      
      const updated = prev.map(a => 
        a.id === id 
          ? { 
              ...a, 
              progress, 
              unlocked: shouldUnlock || a.unlocked,
              unlockedAt: shouldUnlock ? new Date().toISOString() : a.unlockedAt
            }
          : a
      );

      if (shouldUnlock) {
        const unlockedAchievement = updated.find(a => a.id === id);
        if (unlockedAchievement) {
          setNewlyUnlocked(unlockedAchievement);
        }
      }

      return updated;
    });
  }, []);

  // Clear the newly unlocked achievement (after showing toast)
  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  // Check achievements based on player stats
  const checkAchievements = useCallback((stats: PlayerStats, currentScore: number, diamondsOnBoard: number) => {
    // Gem collection achievements
    if (stats.totalGemsCollected.emerald >= 1) unlockAchievement('first_emerald');
    if (stats.totalGemsCollected.sapphire >= 1) unlockAchievement('first_sapphire');
    if (stats.totalGemsCollected.ruby >= 1) unlockAchievement('first_ruby');
    if (stats.totalGemsCollected.diamond >= 1) unlockAchievement('first_diamond');
    
    // Multiple diamonds on board
    if (diamondsOnBoard >= 2) unlockAchievement('double_diamond');
    if (diamondsOnBoard >= 3) unlockAchievement('triple_diamond');
    
    // Diamond count achievements
    updateProgress('diamonds_10', stats.totalDiamondsEarned);
    updateProgress('diamonds_50', stats.totalDiamondsEarned);
    updateProgress('diamonds_100', stats.totalDiamondsEarned);
    
    // Score achievements
    if (currentScore >= 10000) unlockAchievement('score_10k');
    if (currentScore >= 50000) unlockAchievement('score_50k');
    if (currentScore >= 100000) unlockAchievement('score_100k');
    if (currentScore >= 250000) unlockAchievement('score_250k');
    
    // Games played achievements
    updateProgress('games_10', stats.gamesPlayed);
    updateProgress('games_50', stats.gamesPlayed);
    updateProgress('games_100', stats.gamesPlayed);
    
    // Streak achievements
    updateProgress('streak_7', stats.currentStreak);
    updateProgress('streak_30', stats.currentStreak);
    
    // Merge achievements
    updateProgress('merges_1000', stats.totalMerges);
    
    // Prestige achievements
    if (stats.prestige.level >= 1) unlockAchievement('prestige_1');
    if (stats.prestige.level >= 5) unlockAchievement('prestige_5');
    if (stats.prestige.level >= 10) unlockAchievement('prestige_10');
    
    // Transcendent (super diamond) - checked via tile value > 11
    if (stats.highestTileReached > 11) unlockAchievement('transcendent');
  }, [unlockAchievement, updateProgress]);

  // Get achievements by category
  const getByCategory = useCallback((category: Achievement['category']) => {
    return achievements.filter(a => a.category === category);
  }, [achievements]);

  // Get unlocked count
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    unlockAchievement,
    updateProgress,
    checkAchievements,
    getByCategory,
    unlockedCount,
    totalCount,
  };
};
