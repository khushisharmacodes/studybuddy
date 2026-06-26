import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Play,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import TeddyCompanion from '../components/teddy/TeddyCompanion.jsx';
import useAuthStore from '../store/authStore.js';
import useDashboardStore from '../store/dashboardStore.js';
import useGoalStore from '../store/goalStore.js';
import useTeddy from '../hooks/useTeddy.js';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { analytics, recommendations, exams, examStatus, weakSubjects, quote, isLoading, loadDashboard } = useDashboardStore();
  const { goals, fetchGoals } = useGoalStore();

  useEffect(() => {
    loadDashboard();
    fetchGoals('daily');
  }, [loadDashboard, fetchGoals]);

  const todayFocus = analytics?.totalFocusMinutes || 0;
  const dailyGoal = user?.dailyStudyGoal || 120;
  const progress = Math.min((todayFocus / dailyGoal) * 100, 100);

  const { state: teddyState, message: teddyMessage } = useTeddy('dashboard', {
    weakSubjects,
    exams,
    dailyGoal,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-stone-800">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},
            {' '}<span className="text-gradient">{user?.name?.split(' ')[0] || 'Buddy'}</span> 🧸
          </h1>
          <p className="text-stone-500 mt-1">{quote}</p>
        </div>
        <Link to="/focus">
          <Button variant="cozy" className="w-full md:w-auto">
            <Play className="w-4 h-4" />
            Start Focus
          </Button>
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500">Focus Today</p>
              <p className="text-xl font-bold text-stone-800">{todayFocus}m</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500">Streak</p>
              <p className="text-xl font-bold text-stone-800">{user?.streak || 0} days</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500">XP / Level</p>
              <p className="text-xl font-bold text-stone-800">{user?.xp || 0} / {user?.level || 1}</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500">Goals Done</p>
              <p className="text-xl font-bold text-stone-800">{analytics?.completedGoals || 0}/{analytics?.totalGoals || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Teddy + Focus Progress */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
          <TeddyCompanion state={teddyState} message={teddyMessage} className="mb-4" />
          <h3 className="font-display font-bold text-stone-800 mb-2">Daily Focus Goal</h3>
          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-violet-500 to-rose-400 rounded-full"
            />
          </div>
          <p className="text-sm text-stone-500">{todayFocus} / {dailyGoal} minutes</p>
        </Card>

        {/* Goals */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-500" /> Today&apos;s Goals
            </h3>
            <Link to="/goals" className="text-sm text-violet-600 hover:underline">View all</Link>
          </div>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No goals yet. Add your first goal!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 4).map((goal) => (
                <div key={goal._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/60">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal.isCompleted ? 'bg-violet-500 border-violet-500' : 'border-stone-300'}`}>
                    {goal.isCompleted && <Sparkles className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`flex-1 ${goal.isCompleted ? 'line-through text-stone-400' : 'text-stone-700'}`}>{goal.title}</span>
                  <Badge variant={goal.isCompleted ? 'teal' : 'stone'}>{goal.isCompleted ? 'Done' : 'Pending'}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommendations & Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Recommended For You
            </h3>
            <span className="text-xs text-stone-400">Top picks from your syllabus</span>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : (
            <div className="space-y-3 pr-1">
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recommendations yet.</p>
                  <Link to="/focus" className="text-xs text-violet-600 hover:underline mt-1 inline-block">
                    Pick a subject to get resources
                  </Link>
                </div>
              ) : (
                recommendations.slice(0, 6).map((rec, idx) => (
                  <a
                    key={idx}
                    href={rec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-2xl bg-white/60 hover:bg-violet-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-stone-800 text-sm">{rec.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{rec.reason}</p>
                      </div>
                      <Badge variant="violet">{rec.category}</Badge>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-bold text-stone-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" /> Alerts & Updates
          </h3>
          {weakSubjects.length > 0 && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <p className="text-sm font-medium text-rose-800">Weak subjects detected</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {weakSubjects.map((s) => (
                  <Badge key={s.subject} variant="rose">{s.subject} ({Math.round(s.average)}%)</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            {exams.slice(0, 3).map((exam) => (
              <div key={exam._id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/60">
                <Calendar className="w-5 h-5 text-violet-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">{exam.title}</p>
                  <p className="text-xs text-stone-500">{exam.subject}</p>
                </div>
                <Badge variant={exam.isPostponed ? 'amber' : 'sky'}>
                  {exam.isPostponed ? 'Postponed' : exam.date ? new Date(exam.date).toLocaleDateString() : 'TBA'}
                </Badge>
              </div>
            ))}
            {exams.length === 0 && (
              <p className="text-sm text-stone-500">
                {examStatus?.message || 'No exam updates right now.'}
                {examStatus?.lastCheckedAt && (
                  <span className="block text-xs text-stone-400 mt-1">
                    Last checked: {new Date(examStatus.lastCheckedAt).toLocaleString()}
                  </span>
                )}
              </p>
            )}
          </div>
        </Card>

        {recommendations.some((r) => r.type === 'channel' || r.type === 'playlist') && (
          <Card className="md:col-span-2">
            <h3 className="font-display font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-rose-500" /> YouTube Channels & Playlists
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations
                .filter((r) => r.type === 'channel' || r.type === 'playlist')
                .slice(0, 4)
                .map((rec, idx) => (
                  <a
                    key={idx}
                    href={rec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 rounded-2xl bg-white/60 hover:bg-violet-50 transition-colors"
                  >
                    <p className="font-medium text-stone-800 text-sm line-clamp-2">{rec.title}</p>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{rec.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 capitalize">
                        {rec.type}
                      </span>
                      <Badge variant="violet">{rec.category}</Badge>
                    </div>
                  </a>
                ))}
            </div>
          </Card>
        )}
      </div>

      {/* Analytics Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-stone-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500" /> Weekly Focus
          </h3>
          <Link to="/analytics" className="text-sm text-violet-600 hover:underline">See details</Link>
        </div>
        {isLoading || !analytics ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="flex items-end gap-2 h-40">
            {analytics.focusData.map((day, idx) => {
              const max = Math.max(...analytics.focusData.map((d) => d.minutes), 1);
              const height = (day.minutes / max) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }}
                    className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-violet-500 to-violet-300"
                  />
                  <span className="text-[10px] text-stone-500">{day.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
