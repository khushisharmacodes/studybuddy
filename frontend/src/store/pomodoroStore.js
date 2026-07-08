import { create } from 'zustand';
import pomodoroService from '../services/pomodoroService.js';

const DEFAULT_FOCUS = 25;
const DEFAULT_BREAK = 5;
const DEFAULT_LONG_BREAK = 15;
const POMODOROS_UNTIL_LONG_BREAK = 4;
const STORAGE_KEY_PREFIX = 'studybuddy_pomodoro_state';

const buildInitialState = () => ({
  timeLeft: DEFAULT_FOCUS * 60,
  duration: DEFAULT_FOCUS,
  breakDuration: DEFAULT_BREAK,
  longBreakDuration: DEFAULT_LONG_BREAK,
  isRunning: false,
  isBreak: false,
  category: 'General',
  sessionId: null,
  phaseCount: 0,
  sessions: [],
  todayStats: { totalMinutes: 0, sessionsCompleted: 0 },
  timerStartedAt: null,
  timeLeftAtStart: null,
});

const getCurrentUserId = () => {
  try {
    const raw = localStorage.getItem('studybuddy_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?._id || null;
  } catch {
    return null;
  }
};

const getStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX;
};

const loadPersistedState = () => {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return null;
    const saved = JSON.parse(raw);

    // If timer was running when the page closed, compute remaining time.
    if (saved.isRunning && saved.timestamp) {
      const elapsedSeconds = Math.floor((Date.now() - saved.timestamp) / 1000);
      saved.timeLeft = Math.max(0, saved.timeLeft - elapsedSeconds);
      // Reset wall-clock tracking so the next start resumes from the recovered time.
      saved.timerStartedAt = null;
      saved.timeLeftAtStart = null;
    }
    return saved;
  } catch (error) {
    console.error('Failed to load pomodoro state', error);
    return null;
  }
};

const persistState = (state) => {
  try {
    const snapshot = {
      timeLeft: state.timeLeft,
      duration: state.duration,
      breakDuration: state.breakDuration,
      longBreakDuration: state.longBreakDuration,
      isRunning: state.isRunning,
      isBreak: state.isBreak,
      category: state.category,
      sessionId: state.sessionId,
      phaseCount: state.phaseCount,
      timestamp: Date.now(),
      timerStartedAt: state.timerStartedAt,
      timeLeftAtStart: state.timeLeftAtStart,
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(snapshot));
  } catch (error) {
    console.error('Failed to persist pomodoro state', error);
  }
};

const clearPersistedState = () => {
  try {
    localStorage.removeItem(getStorageKey());
  } catch (error) {
    console.error('Failed to clear pomodoro state', error);
  }
};

const usePomodoroStore = create((set, get) => {
  const persisted = loadPersistedState();

  const store = {
    ...buildInitialState(),
    ...(persisted || {}),

    setCategory: (category) => {
      set({ category });
      persistState(get());
    },
    setDuration: (minutes) => {
      set({ duration: minutes, timeLeft: minutes * 60 });
      persistState(get());
    },
    setBreakDuration: (minutes) => {
      set({ breakDuration: minutes });
      persistState(get());
    },
    setLongBreakDuration: (minutes) => {
      set({ longBreakDuration: minutes });
      persistState(get());
    },

    tick: () => {
      const { timeLeft, isRunning, timerStartedAt, timeLeftAtStart } = get();
      if (!isRunning) return;

      // Use wall-clock time so the timer stays accurate even when the renderer
      // is throttled in the background.
      if (timerStartedAt && timeLeftAtStart !== null) {
        const elapsedSeconds = Math.floor((Date.now() - timerStartedAt) / 1000);
        const newTimeLeft = Math.max(0, timeLeftAtStart - elapsedSeconds);
        if (newTimeLeft !== timeLeft) {
          set({ timeLeft: newTimeLeft });
          persistState(get());
        }
        if (newTimeLeft === 0) {
          get().completePhase();
        }
        return;
      }

      if (timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
        persistState(get());
      } else if (timeLeft === 0) {
        get().completePhase();
      }
    },

    startTimer: () => {
      const { timeLeft } = get();
      set({
        isRunning: true,
        timerStartedAt: Date.now(),
        timeLeftAtStart: timeLeft,
      });
      persistState(get());
    },
    pauseTimer: () => {
      set({ isRunning: false, timerStartedAt: null, timeLeftAtStart: null });
      persistState(get());
    },

    startSession: async () => {
      const { duration, category } = get();
      const startTimeLeft = duration * 60;
      try {
        const { data } = await pomodoroService.startSession({ category, duration });
        set({
          sessionId: data.session._id,
          timeLeft: startTimeLeft,
          isRunning: true,
          isBreak: false,
          timerStartedAt: Date.now(),
          timeLeftAtStart: startTimeLeft,
        });
        persistState(get());
      } catch (error) {
        console.error('Failed to start session', error);
        set({
          isRunning: true,
          timerStartedAt: Date.now(),
          timeLeftAtStart: startTimeLeft,
        });
      }
    },

    completePhase: async () => {
      const { isBreak, duration, breakDuration, longBreakDuration, sessionId, phaseCount } = get();
      if (!isBreak && sessionId) {
        try {
          await pomodoroService.completeSession(sessionId);
        } catch (error) {
          console.error('Failed to complete session', error);
        }
      }

      const nextPhaseCount = isBreak ? phaseCount : phaseCount + 1;
      const isLongBreak = !isBreak && nextPhaseCount > 0 && nextPhaseCount % POMODOROS_UNTIL_LONG_BREAK === 0;

      set({
        isBreak: !isBreak,
        timeLeft: isBreak ? duration * 60 : (isLongBreak ? longBreakDuration : breakDuration) * 60,
        isRunning: false,
        sessionId: null,
        phaseCount: nextPhaseCount,
        timerStartedAt: null,
        timeLeftAtStart: null,
      });
      persistState(get());
      get().fetchTodayStats();
      get().fetchSessions();
    },

    resetTimer: async () => {
      const { duration, breakDuration, isBreak, sessionId } = get();
      if (sessionId && !isBreak) {
        const elapsedMinutes = Math.floor((duration * 60 - get().timeLeft) / 60);
        try {
          await pomodoroService.abandonSession(sessionId, { elapsedMinutes });
        } catch (error) {
          console.error('Failed to abandon session', error);
        }
      }
      set({
        timeLeft: isBreak ? breakDuration * 60 : duration * 60,
        isRunning: false,
        sessionId: null,
        timerStartedAt: null,
        timeLeftAtStart: null,
      });
      persistState(get());
      get().fetchTodayStats();
      get().fetchSessions();
    },

    abandonSession: async () => {
      const { sessionId } = get();
      if (sessionId) {
        const elapsedMinutes = Math.floor((get().duration * 60 - get().timeLeft) / 60);
        try {
          await pomodoroService.abandonSession(sessionId, { elapsedMinutes });
        } catch (error) {
          console.error('Failed to abandon session', error);
        }
      }
      set({ ...buildInitialState(), sessions: get().sessions, todayStats: get().todayStats });
      clearPersistedState();
    },

    clearPersistedState,

    resetStore: () => {
      set(buildInitialState());
      clearPersistedState();
    },

    fetchSessions: async () => {
      try {
        const { data } = await pomodoroService.getSessions();
        set({ sessions: data.sessions });
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    },

    fetchTodayStats: async () => {
      try {
        const { data } = await pomodoroService.getTodayStats();
        set({ todayStats: data });
      } catch (error) {
        console.error('Failed to fetch today stats', error);
      }
    },
  };

  return store;
});

export default usePomodoroStore;
