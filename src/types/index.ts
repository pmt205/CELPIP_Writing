export interface Question {
  id: string;
  type: 'task1' | 'task2';
  title: string;
  prompt: string;
}

export interface Task1Question extends Question {
  type: 'task1';
  situation: string;
  bulletPoints: string[];
  tone: 'formal' | 'informal' | 'semi-formal';
}

export interface Task2Question extends Question {
  type: 'task2';
  topic: string;
  instructions: string;
  viewpoints: string[];
}

export interface WritingSession {
  id: string;
  taskType: 'task1' | 'task2';
  question: Task1Question | Task2Question;
  text: string;
  wordCount: number;
  startTime: number;
  endTime: number | null;
  timeUsed: number;
  submitted: boolean;
}

/** Official CELPIP Writing scoring category names */
export type CELPIPScoringCategory = 'Content/Coherence' | 'Vocabulary' | 'Readability' | 'Task Fulfillment';

export interface AIFeedback {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  suggestions: string[];
  rawResponse: string;
}

export interface PracticeHistory {
  session: WritingSession;
  feedback?: AIFeedback;
  date: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  cloudDataUrl: string;
}

export interface AppState {
  // Settings slice
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;

  // Session slice
  currentTask: 'task1' | 'task2' | null;
  currentQuestion: Task1Question | Task2Question | null;
  writingText: string;
  isActive: boolean;
  isSubmitted: boolean;
  startSession: (taskType: 'task1' | 'task2', question: Task1Question | Task2Question) => void;
  updateText: (text: string) => void;
  submitSession: () => void;
  resetSession: () => void;

  // History slice
  history: PracticeHistory[];
  addToHistory: (entry: PracticeHistory) => void;
  importHistory: (entries: PracticeHistory[]) => void;
  clearHistory: () => void;

  // UI slice
  darkMode: boolean;
  adminMode: boolean;
  showInstructions: boolean;
  toggleDarkMode: () => void;
  toggleAdminMode: () => void;
  setShowInstructions: (show: boolean) => void;
}
