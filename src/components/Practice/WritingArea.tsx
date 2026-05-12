import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { countWords, getWordCountStatus, getRecommendedRange } from '../../utils/wordCount';
import { saveToStorage } from '../../utils/localStorage';

const AUTO_SAVE_KEY = 'celpip-writing-autosave';

export default function WritingArea() {
  const writingText = useAppStore((state) => state.writingText);
  const updateText = useAppStore((state) => state.updateText);
  const isSubmitted = useAppStore((state) => state.isSubmitted);
  const currentTask = useAppStore((state) => state.currentTask);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wordCount = countWords(writingText);
  const taskType = currentTask || 'task1';
  const status = getWordCountStatus(wordCount, taskType);
  const range = getRecommendedRange(taskType);

  // Auto-save every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (writingText.length > 0) {
        saveToStorage(AUTO_SAVE_KEY, { text: writingText, timestamp: Date.now() });
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [writingText]);

  const getStatusColor = () => {
    if (wordCount === 0) return 'text-gray-400 dark:text-gray-500';
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'low':
        return wordCount >= range.min - 20
          ? 'text-orange-500 dark:text-orange-400'
          : 'text-red-500 dark:text-red-400';
      case 'high':
        return wordCount <= range.max + 20
          ? 'text-orange-500 dark:text-orange-400'
          : 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <textarea
        value={writingText}
        onChange={(e) => updateText(e.target.value)}
        disabled={isSubmitted}
        spellCheck={true}
        placeholder="Start writing your response here..."
        className="w-full min-h-[400px] md:min-h-[400px] sm:min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px',
          lineHeight: '1.75',
        }}
        aria-label="Writing area"
      />
      <div className="mt-2 flex items-center justify-between px-1">
        <p className={`text-sm font-medium ${getStatusColor()}`}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Recommended: {range.min}-{range.max} words
        </p>
      </div>
    </div>
  );
}
