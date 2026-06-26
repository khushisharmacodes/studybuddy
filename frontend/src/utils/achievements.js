const achievements = [
  {
    id: 'first_focus',
    title: 'First Focus',
    description: 'Complete your first pomodoro session.',
    icon: '🍅',
    condition: (user, stats) => stats.sessionsCompleted >= 1,
  },
  {
    id: 'focus_10',
    title: 'Deep Diver',
    description: 'Complete 10 focus sessions.',
    icon: '🌊',
    condition: (user, stats) => stats.sessionsCompleted >= 10,
  },
  {
    id: 'focus_50',
    title: 'Focus Master',
    description: 'Complete 50 focus sessions.',
    icon: '🔥',
    condition: (user, stats) => stats.sessionsCompleted >= 50,
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintain a 3-day study streak.',
    icon: '⚡',
    condition: (user) => (user?.streak || 0) >= 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak.',
    icon: '🏆',
    condition: (user) => (user?.streak || 0) >= 7,
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Maintain a 30-day study streak.',
    icon: '📅',
    condition: (user) => (user?.streak || 0) >= 30,
  },
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach level 5.',
    icon: '⭐',
    condition: (user) => (user?.level || 1) >= 5,
  },
  {
    id: 'level_10',
    title: 'Study Legend',
    description: 'Reach level 10.',
    icon: '👑',
    condition: (user) => (user?.level || 1) >= 10,
  },
  {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Complete 10 goals.',
    icon: '🎯',
    condition: (user, stats) => (stats.completedGoals || 0) >= 10,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Study for 60 minutes before noon.',
    icon: '🐦',
    condition: () => false, // Placeholder for future time-based tracking
  },
];

const getUnlockedAchievements = (user, stats = {}) => {
  return achievements.map((achievement) => ({
    ...achievement,
    unlocked: achievement.condition(user, stats),
  }));
};

const getRecentlyUnlocked = (user, stats = {}, previousIds = []) => {
  const all = getUnlockedAchievements(user, stats);
  return all.filter((a) => a.unlocked && !previousIds.includes(a.id));
};

export { achievements, getUnlockedAchievements, getRecentlyUnlocked };
