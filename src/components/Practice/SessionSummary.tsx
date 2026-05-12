import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTimerStore } from '../../store/useTimerStore';
import { countWords } from '../../utils/wordCount';
import { getAIFeedback } from '../../utils/gemini';
import AIFeedbackPanel from '../AI/AIFeedback';
import type { AIFeedback, PracticeHistory } from '../../types';

export default function SessionSummary() {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const writingText = useAppStore((state) => state.writingText);
  const currentQuestion = useAppStore((state) => state.currentQuestion);
  const currentTask = useAppStore((state) => state.currentTask);
  const settings = useAppStore((state) => state.settings);
  const resetSession = useAppStore((state) => state.resetSession);
  const addToHistory = useAppStore((state) => state.addToHistory);
  const duration = useTimerStore((state) => state.duration);
  const timeRemaining = useTimerStore((state) => state.timeRemaining);

  const wordCount = countWords(writingText);
  const timeUsed = duration - timeRemaining;
  const minutes = Math.floor(timeUsed / 60);
  const seconds = timeUsed % 60;
  const formattedTime = `${minutes}m ${seconds}s`;

  const handleGetFeedback = async () => {
    if (!currentQuestion || !settings.apiKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAIFeedback(settings, currentQuestion, writingText);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!currentQuestion || !currentTask) return;
    const entry: PracticeHistory = {
      session: {
        id: Date.now().toString(),
        taskType: currentTask,
        question: currentQuestion,
        text: writingText,
        wordCount,
        startTime: Date.now() - timeUsed * 1000,
        endTime: Date.now(),
        timeUsed,
        submitted: true,
      },
      feedback: feedback || undefined,
      date: new Date().toLocaleDateString(),
    };
    addToHistory(entry);
    setSaved(true);
  };

  const handleNewPractice = () => {
    resetSession();
  };

  return (
    <section className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Session Complete
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Word Count</p>
            <p className="text-2xl font-bold text-celpip-blue dark:text-celpip-accent">
              {wordCount}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Time Used</p>
            <p className="text-2xl font-bold text-celpip-blue dark:text-celpip-accent">
              {formattedTime}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Task Type</p>
            <p className="text-2xl font-bold text-celpip-blue dark:text-celpip-accent">
              {currentTask === 'task1' ? 'Email' : 'Survey'}
            </p>
          </div>
        </div>

        {/* Writing text (read-only) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Your Response
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {writingText}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGetFeedback}
            disabled={!settings.apiKey || isLoading}
            className="flex-1 py-3 px-6 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Getting Feedback...
              </span>
            ) : (
              'Get AI Feedback'
            )}
          </button>
          {!settings.apiKey && (
            <p className="text-xs text-orange-500 dark:text-orange-400 self-center">
              Set your API key in Settings to get AI feedback
            </p>
          )}
          <button
            onClick={handleSaveToHistory}
            disabled={saved}
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {saved ? 'Saved!' : 'Save to History'}
          </button>
          <button
            onClick={handleNewPractice}
            className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
          >
            New Practice
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* AI Feedback */}
      {feedback && <AIFeedbackPanel feedback={feedback} />}
    </section>
  );
}
