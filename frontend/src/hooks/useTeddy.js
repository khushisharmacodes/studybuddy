import { useMemo } from 'react';
import useAuthStore from '../store/authStore.js';
import useGoalStore from '../store/goalStore.js';
import usePomodoroStore from '../store/pomodoroStore.js';

const daysSince = (isoDate) => {
  if (!isoDate) return Infinity;
  const diff = new Date() - new Date(isoDate);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const messages = {
  idle: [
    'Ready to study together?',
    'Your desk is waiting!',
    'Let us make today count.',
  ],
  studying: [
    'You are doing amazing! Stay focused.',
    'Deep work mode: ON.',
    'One pomodoro closer to your goals!',
  ],
  sleepy: [
    'Maybe take a short break?',
    'Stretch a little?',
    'A cozy nap might help recharge.',
  ],
  happy: [
    'Great work today! I am so proud.',
    'Look at you go!',
    'Productivity looks good on you.',
  ],
  excited: [
    'Wow! You are on fire!',
    'Today is YOUR day!',
    'Unstoppable focus!',
  ],
  sad: [
    'It is okay. Tomorrow is a new day.',
    'Be kind to yourself.',
    'A small step is still progress.',
  ],
  celebrating: [
    'Milestone reached! Let us celebrate!',
    'You crushed your goal!',
    'High five! Well done!',
  ],
  motivational: [
    'You have got this! One step at a time.',
    'Believe in your prep.',
    'Start small, finish strong.',
  ],
  worried: [
    'An exam is coming up — let us prep!',
    'Time to review those weak topics?',
    'A little planning now saves stress later.',
  ],
};

const pickMessage = (state, context) => {
  const list = messages[state] || messages.idle;
  if (context === 'focus' && state === 'studying') return list[1];
  if (context === 'focus' && state === 'happy') return list[2];
  return list[Math.floor(Math.random() * list.length)];
};

export default function useTeddy(context = 'dashboard', overrides = {}) {
  const { user } = useAuthStore();
  const { goals } = useGoalStore();
  const { todayStats, isRunning, isBreak } = usePomodoroStore();

  const {
    weakSubjects = [],
    exams = [],
    dailyGoal = user?.dailyStudyGoal || 120,
  } = overrides;

  return useMemo(() => {
    const todayMinutes = todayStats?.totalMinutes || 0;
    const progress = dailyGoal > 0 ? Math.min((todayMinutes / dailyGoal) * 100, 100) : 0;
    const inactiveDays = daysSince(user?.lastStudyDate);
    const hasMissedGoals = goals.some((g) => !g.isCompleted && g.type === 'daily');
    const upcomingExam = exams.find((e) => e.date && !e.isPostponed && new Date(e.date) > new Date());
    const examDaysAway = upcomingExam
      ? Math.ceil((new Date(upcomingExam.date) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    let state = 'idle';

    if (context === 'focus') {
      if (isRunning) state = 'studying';
      else if (isBreak) state = 'happy';
      else if (progress >= 100) state = 'celebrating';
      else state = 'motivational';
    } else {
      if (progress >= 100) state = 'celebrating';
      else if (progress >= 60) state = 'excited';
      else if (todayMinutes > 0) state = 'happy';
      else if (inactiveDays >= 2) state = 'sleepy';
      else if (hasMissedGoals && goals.length > 0) state = 'motivational';
      else if (weakSubjects.length > 0) state = 'motivational';
      else state = 'idle';

      if (examDaysAway !== null && examDaysAway <= 7 && state === 'idle') {
        state = 'worried';
      }
    }

    let message = pickMessage(state, context);

    if (state === 'worried' && upcomingExam) {
      message = `${upcomingExam.subject || upcomingExam.title} is in ${examDaysAway} day${examDaysAway === 1 ? '' : 's'} — want to review?`;
    }
    if (state === 'motivational' && weakSubjects.length > 0) {
      message = `You are weakest in ${weakSubjects[0].subject}. Let us strengthen it!`;
    }
    if (state === 'sleepy' && inactiveDays >= 2) {
      message = `It has been ${inactiveDays} days since we studied. Miss you!`;
    }

    return { state, message };
  }, [context, todayStats, isRunning, isBreak, user, goals, weakSubjects, exams, dailyGoal]);
}
