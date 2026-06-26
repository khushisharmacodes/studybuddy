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
      const { timeLeft, isRunning } = get();
      if (isRunning && timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
        persistState(get());
      } else if (isRunning && timeLeft === 0) {
        get().completePhase();
      }
    },

    startTimer: () => {
      set({ isRunning: true });
      persistState(get());
    },
    pauseTimer: () => {
      set({ isRunning: false });
      persistState(get());
    },

    startSession: async () => {
      const { duration, category } = get();
      try {
        const { data } = await pomodoroService.startSession({ category, duration });
        set({ sessionId: data.session._id, timeLeft: duration * 60, isRunning: true, isBreak: false });
        persistState(get());
      } catch (error) {
        console.error('Failed to start session', error);
        set({ isRunning: true });
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
      set({ timeLeft: isBreak ? breakDuration * 60 : duration * 60, isRunning: false, sessionId: null });
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
