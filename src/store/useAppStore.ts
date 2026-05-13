import { create } from 'zustand';
import type { AppState, Settings, Task1Question, Task2Question, PracticeHistory } from '../types';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';

const STORAGE_KEY = 'celpip-app-state';

const defaultSettings: Settings = {
  apiKey: '',
  model: 'gemma-4-31b-it',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are a CELPIP writing examiner. Evaluate the following writing response according to CELPIP scoring criteria.',
  cloudDataUrl: '',
};

interface PersistedState {
  settings: Settings;
  history: PracticeHistory[];
  darkMode: boolean;
  adminMode: boolean;
}

function loadPersistedState(): PersistedState {
  return loadFromStorage<PersistedState>(STORAGE_KEY, {
    settings: defaultSettings,
    history: [],
    darkMode: false,
    adminMode: false,
  });
}

export const useAppStore = create<AppState>((set, get) => {
  const persisted = loadPersistedState();

  return {
    // Settings slice
    settings: persisted.settings,
    setSettings: (newSettings: Partial<Settings>) => {
      const updated = { ...get().settings, ...newSettings };
      set({ settings: updated });
      persistState(get());
    },

    // Session slice
    currentTask: null,
    currentQuestion: null,
    writingText: '',
    isActive: false,
    isSubmitted: false,
    startSession: (taskType: 'task1' | 'task2', question: Task1Question | Task2Question) => {
      set({
        currentTask: taskType,
        currentQuestion: question,
        writingText: '',
        isActive: true,
        isSubmitted: false,
      });
    },
    updateText: (text: string) => {
      set({ writingText: text });
    },
    submitSession: () => {
      set({ isSubmitted: true, isActive: false });
    },
    resetSession: () => {
      set({
        currentTask: null,
        currentQuestion: null,
        writingText: '',
        isActive: false,
        isSubmitted: false,
      });
    },

    // History slice
    history: persisted.history,
    addToHistory: (entry: PracticeHistory) => {
      const updated = [entry, ...get().history];
      set({ history: updated });
      persistState(get());
    },
    importHistory: (entries: PracticeHistory[]) => {
      const existing = get().history;
      const existingIds = new Set(existing.map(h => h.session.id));
      const newEntries = entries.filter(e => !existingIds.has(e.session.id));
      const updated = [...newEntries, ...existing];
      set({ history: updated });
      persistState(get());
    },
    clearHistory: () => {
      set({ history: [] });
      persistState(get());
    },

    // UI slice
    darkMode: persisted.darkMode,
    adminMode: persisted.adminMode,
    showInstructions: true,
    toggleDarkMode: () => {
      const newValue = !get().darkMode;
      set({ darkMode: newValue });
      persistState(get());
    },
    toggleAdminMode: () => {
      const newValue = !get().adminMode;
      set({ adminMode: newValue });
      persistState(get());
    },
    setShowInstructions: (show: boolean) => {
      set({ showInstructions: show });
    },
  };
});

function persistState(state: AppState): void {
  const toPersist: PersistedState = {
    settings: state.settings,
    history: state.history,
    darkMode: state.darkMode,
    adminMode: state.adminMode,
  };
  saveToStorage(STORAGE_KEY, toPersist);
}
