import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getAIFeedback } from '../../utils/gemini';
import AIFeedbackPanel from '../AI/AIFeedback';
import type { PracticeHistory, AIFeedback } from '../../types';

interface HistoryDetailProps {
  entry: PracticeHistory;
}

export default function HistoryDetail({ entry }: HistoryDetailProps) {
  const [feedback, setFeedback] = useState<AIFeedback | null>(entry.feedback || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = useAppStore((state) => state.settings);

  const timeMinutes = Math.floor(entry.session.timeUsed / 60);
  const timeSeconds = entry.session.timeUsed % 60;

  const handleGetFeedback = async () => {
    if (!settings.apiKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAIFeedback(settings, entry.session.question, entry.session.text);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Question prompt */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Question Prompt
        </h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {entry.session.question.prompt}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Words: <span className="font-medium text-gray-900 dark:text-white">{entry.session.wordCount}</span>
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Time: <span className="font-medium text-gray-900 dark:text-white">{timeMinutes}m {timeSeconds}s</span>
        </span>
      </div>

      {/* Writing text */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Your Response
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
            {entry.session.text}
          </p>
        </div>
      </div>

      {/* AI Feedback or Get Feedback button */}
      {feedback ? (
        <AIFeedbackPanel feedback={feedback} />
      ) : (
        <div>
          <button
            onClick={handleGetFeedback}
            disabled={!settings.apiKey || isLoading}
            className="px-4 py-2 text-sm bg-celpip-blue hover:bg-celpip-lightblue text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
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
            <p className="mt-1 text-xs text-orange-500 dark:text-orange-400">
              Set your API key in Settings to get AI feedback
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
