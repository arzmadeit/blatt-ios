import { useState, useCallback, useEffect } from 'react';

export interface GemCounts {
  emerald: number;
  sapphire: number;
  ruby: number;
  diamond: number;
}

export interface PrestigeData {
  level: number;
  multiplier: number;
  totalPrestigeScore: number;
  lastPrestigeDate?: string;
}

export interface ScoreEntry {
  score: number;
  date: string;
}

export interface PlayerStats {
  totalDiamondsEarned: number;
  totalGemsCollected: GemCounts;
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  top10Scores: ScoreEntry[];
  highestTileReached: number;
  currentStreak: number;
  longestStreak: number;
  totalMoves: number;
  totalMerges: number;
  prestige: PrestigeData;
  lastPlayDate?: string;
}

const STORAGE_KEY = 'blatt-player-stats';

const defaultStats: PlayerStats = {
  totalDiamondsEarned: 0,
  totalGemsCollected: { emerald: 0, sapphire: 0, ruby: 0, diamond: 0 },
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  top10Scores: [],
  highestTileReached: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalMoves: 0,
  totalMerges: 0,
  prestige: {
    level: 0,
    multiplier: 1.0,
    totalPrestigeScore: 0,
  },
};

const loadStats = (): PlayerStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultStats, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load player stats:', e);
  }
  return { ...defaultStats };
};

const saveStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats:', e);
  }
};

// Map gem values to gem names
const gemValueToName = (value: number): keyof GemCounts | null => {
  switch (value) {
    case 8: return 'emerald';
    case 9: return 'sapphire';
    case 10: return 'ruby';
    case 11: return 'diamond';
    default: return null;
  }
};

export const usePlayerStats = () => {
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  // Persist stats on every change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Check and update play streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastPlay = stats.lastPlayDate;
    
    if (!lastPlay) {
      // First time playing
      setStats(prev => ({
        ...prev,
        currentStreak: 1,
        longestStreak: Math.max(1, prev.longestStreak),
        lastPlayDate: today,
      }));
      return;
    }

    const lastDate = new Date(lastPlay);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, no change
      return;
    } else if (diffDays === 1) {
      // Consecutive day
      setStats(prev => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.currentStreak + 1, prev.longestStreak),
        lastPlayDate: today,
      }));
    } else {
      // Streak broken
      setStats(prev => ({
        ...prev,
        currentStreak: 1,
        lastPlayDate: today,
      }));
    }
  }, [stats.lastPlayDate]);

  // Record a gem collection
  const recordGemCollected = useCallback((gemValue: number) => {
    const gemName = gemValueToName(gemValue);
    if (!gemName) return;

    setStats(prev => ({
      ...prev,
      totalGemsCollected: {
        ...prev.totalGemsCollected,
        [gemName]: prev.totalGemsCollected[gemName] + 1,
      },
      totalDiamondsEarned: gemName === 'diamond' 
        ? prev.totalDiamondsEarned + 1 
        : prev.totalDiamondsEarned,
    }));
  }, []);

  // Record a move
  const recordMove = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalMoves: prev.totalMoves + 1,
    }));
  }, []);

  // Record a merge
  const recordMerge = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalMerges: prev.totalMerges + 1,
    }));
  }, []);

  // Update highest tile reached
  const updateHighestTile = useCallback((tileValue: number) => {
    setStats(prev => ({
      ...prev,
      highestTileReached: Math.max(prev.highestTileReached, tileValue),
    }));
  }, []);

  // Record game end - returns the rank of this score (1-10) or null if not in top 10
  const recordGameEnd = useCallback((finalScore: number): number | null => {
    const multipliedScore = Math.floor(finalScore * stats.prestige.multiplier);
    const today = new Date().toISOString();
    
    // Find where this score would rank
    const newEntry: ScoreEntry = { score: multipliedScore, date: today };
    let newTop10 = [...stats.top10Scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    const rank = newTop10.findIndex(e => e.score === multipliedScore && e.date === today) + 1;
    const isInTop10 = rank > 0 && rank <= 10;

    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + multipliedScore,
      bestScore: Math.max(prev.bestScore, multipliedScore),
      top10Scores: newTop10,
      prestige: {
        ...prev.prestige,
        totalPrestigeScore: prev.prestige.totalPrestigeScore + multipliedScore,
      },
    }));

    return isInTop10 ? rank : null;
  }, [stats.prestige.multiplier, stats.top10Scores]);

  // Prestige - reset progress but keep achievements and lifetime stats
  const performPrestige = useCallback(() => {
    const newLevel = stats.prestige.level + 1;
    const newMultiplier = Math.min(2.0, 1.0 + (newLevel * 0.1)); // Cap at 2x

    setStats(prev => ({
      ...prev,
      bestScore: 0, // Reset best score
      top10Scores: [], // Reset leaderboard
      prestige: {
        level: newLevel,
        multiplier: newMultiplier,
        totalPrestigeScore: prev.prestige.totalPrestigeScore,
        lastPrestigeDate: new Date().toISOString(),
      },
    }));
  }, [stats.prestige.level]);

  // Check if player can prestige (must have earned at least one diamond)
  const canPrestige = stats.totalDiamondsEarned > 0;

  // Get score multiplier text
  const getMultiplierText = () => {
    if (stats.prestige.multiplier === 1) return null;
    return `${stats.prestige.multiplier.toFixed(1)}x`;
  };

  return {
    stats,
    recordGemCollected,
    recordMove,
    recordMerge,
    updateHighestTile,
    recordGameEnd,
    updateStreak,
    performPrestige,
    canPrestige,
    getMultiplierText,
  };
};
