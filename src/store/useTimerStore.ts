import { create } from 'zustand';

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  duration: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setDuration: (seconds: number) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeRemaining: 27 * 60, // 27 minutes default for CELPIP writing
  isRunning: false,
  duration: 27 * 60,

  startTimer: () => {
    set({ isRunning: true });
  },

  pauseTimer: () => {
    set({ isRunning: false });
  },

  resetTimer: () => {
    set({
      timeRemaining: get().duration,
      isRunning: false,
    });
  },

  tick: () => {
    const { timeRemaining, isRunning } = get();
    if (isRunning && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else if (timeRemaining <= 0) {
      set({ isRunning: false });
    }
  },

  setDuration: (seconds: number) => {
    set({
      duration: seconds,
      timeRemaining: seconds,
      isRunning: false,
    });
  },
}));
