import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Target, Award, Zap, Calendar } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import TeddyCompanion from '../components/teddy/TeddyCompanion.jsx';
import useDashboardStore from '../store/dashboardStore.js';
import useAuthStore from '../store/authStore.js';
import usePomodoroStore from '../store/pomodoroStore.js';
import { getUnlockedAchievements } from '../utils/achievements.js';

export default function Analytics() {
  const { user } = useAuthStore();
  const { analytics, weakSubjects, isLoading, loadDashboard } = useDashboardStore();
  const { todayStats } = usePomodoroStore();
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const achievements = useMemo(() => {
    return getUnlockedAchievements(user, {
      sessionsCompleted: analytics?.totalSessions || todayStats?.sessionsCompleted || 0,
      completedGoals: analytics?.completedGoals || 0,
    });
  }, [user, analytics, todayStats]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  useEffect(() => {
    if (user?.level > 1) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user?.level]);

  const stats = [
    { label: 'Total Focus', value: analytics?.totalFocusMinutes || 0, unit: 'min', icon: Clock, color: 'violet' },
    { label: 'Sessions', value: analytics?.totalSessions || 0, unit: '', icon: Zap, color: 'sky' },
    { label: 'Goals Done', value: analytics?.completedGoals || 0, unit: '', icon: Target, color: 'teal' },
    { label: 'Level', value: user?.level || 1, unit: '', icon: Award, color: 'amber' },
    { label: 'Streak', value: user?.streak || 0, unit: 'days', icon: TrendingUp, color: 'rose' },
    { label: 'Achievements', value: unlockedCount, unit: `/${achievements.length}`, icon: Calendar, color: 'violet' },
  ];

  const insights = analytics?.insights;

  const getHeatmapColor = (minutes) => {
    if (minutes === 0) return 'bg-stone-100';
    if (minutes < 30) return 'bg-violet-200';
    if (minutes < 60) return 'bg-violet-300';
    if (minutes < 120) return 'bg-violet-400';
    return 'bg-violet-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-stone-800">Analytics</h1>
        <p className="text-stone-500">Insights into your productivity journey.</p>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-100 p-6 flex items-center gap-4"
          >
            <TeddyCompanion state="celebrating" compact />
            <div>
              <p className="text-lg font-display font-bold text-stone-800">Level {user?.level}!</p>
              <p className="text-sm text-stone-500">You are leveling up. Keep going!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="!p-4">
            <div className={`w-9 h-9 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-stone-800">{stat.value}{stat.unit}</p>
            <p className="text-[10px] text-stone-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-6">Weekly Focus Trend</h3>
          {isLoading || !analytics ? (
            <Skeleton className="h-56" />
          ) : (
            <div className="h-56 flex items-end gap-3">
              {analytics.focusData.map((day, idx) => {
                const max = Math.max(...analytics.focusData.map((d) => d.minutes), 1);
                const height = (day.minutes / max) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-violet-500 to-violet-300 relative"
                    >
                      {hoveredBar === idx && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                          {day.minutes}m
                        </div>
                      )}
                    </motion.div>
                    <span className="text-[10px] text-stone-500">{day.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-6">Focus by Category</h3>
          {isLoading || !analytics ? (
            <Skeleton className="h-56" />
          ) : analytics.categoryData.length === 0 ? (
            <p className="text-stone-400 text-center py-16">No focus data yet. Start a session!</p>
          ) : (
            <div className="space-y-4 h-56 overflow-y-auto pr-2">
              {analytics.categoryData.map((cat, idx) => {
                const total = analytics.categoryData.reduce((a, b) => a + b.minutes, 0);
                const pct = (cat.minutes / total) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-700 font-medium">{cat.category}</span>
                      <span className="text-stone-500">{cat.minutes}m</span>
                    </div>
                    <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-bold text-stone-800 mb-4">30-Day Focus Heatmap</h3>
        {isLoading || !analytics ? (
          <Skeleton className="h-32" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {analytics.heatmapData.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.minutes} minutes`}
                className={`w-8 h-8 rounded-lg ${getHeatmapColor(day.minutes)} transition-colors hover:scale-110`}
              />
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 mt-4 text-xs text-stone-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-stone-100" />
            <div className="w-4 h-4 rounded bg-violet-200" />
            <div className="w-4 h-4 rounded bg-violet-300" />
            <div className="w-4 h-4 rounded bg-violet-400" />
            <div className="w-4 h-4 rounded bg-violet-500" />
          </div>
          <span>More</span>
        </div>
      </Card>

      {insights && (
        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-4">Productivity Insights</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-violet-50">
              <p className="text-xs text-violet-600 mb-1">Best Day</p>
              <p className="font-bold text-violet-800">{insights.bestDay.date}</p>
              <p className="text-sm text-violet-700">{insights.bestDay.minutes} minutes</p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50">
              <p className="text-xs text-teal-600 mb-1">Active Days</p>
              <p className="font-bold text-teal-800">{insights.activeDays} / 7</p>
              <p className="text-sm text-teal-700">{insights.averageMinutes} min avg</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50">
              <p className="text-xs text-amber-600 mb-1">Total Sessions</p>
              <p className="font-bold text-amber-800">{analytics.totalSessions}</p>
              <p className="text-sm text-amber-700">This week</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-display font-bold text-stone-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl text-center transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-violet-100 to-rose-50 border border-violet-200'
                  : 'bg-stone-50 border border-stone-100 opacity-60'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className={`text-sm font-bold ${achievement.unlocked ? 'text-stone-800' : 'text-stone-400'}`}>
                {achievement.title}
              </p>
              <p className="text-[10px] text-stone-500 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {weakSubjects.length > 0 && (
        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-4">Focus Areas (Weak Subjects)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {weakSubjects.map((s) => (
              <div key={s.subject} className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="font-medium text-rose-800">{s.subject}</p>
                <p className="text-sm text-rose-600">Average: {Math.round(s.average)}%</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
