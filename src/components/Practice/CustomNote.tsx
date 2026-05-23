import { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage, clearStorage } from '../../utils/localStorage';

interface CustomNoteProps {
  taskType?: 'task1' | 'task2';
}

export default function CustomNote({ taskType = 'task1' }: CustomNoteProps) {
  const noteKey = `celpip-custom-note-${taskType}`;
  const expandedKey = `celpip-custom-note-expanded-${taskType}`;

  const [note, setNote] = useState<string>(() => loadFromStorage<string>(noteKey, ''));
  const [isExpanded, setIsExpanded] = useState<boolean>(() => loadFromStorage<boolean>(expandedKey, false));
  const [showConfirm, setShowConfirm] = useState(false);

  // Re-load note when taskType changes
  useEffect(() => {
    setNote(loadFromStorage<string>(noteKey, ''));
    setIsExpanded(loadFromStorage<boolean>(expandedKey, false));
    setShowConfirm(false);
  }, [taskType, noteKey, expandedKey]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    saveToStorage(noteKey, value);
  };

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    saveToStorage(expandedKey, newExpanded);
  };

  const handleClear = () => {
    setNote('');
    clearStorage(noteKey);
    setShowConfirm(false);
  };

  return (
    <div className="border border-purple-300 dark:border-purple-700 rounded-lg overflow-hidden bg-purple-50 dark:bg-purple-900/20">
      {/* Clickable header */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-purple-800 dark:text-purple-200">
          <span>📝</span>
          <span>Custom Note - {taskType === 'task1' ? 'Task 1' : 'Task 2'}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-purple-600 dark:text-purple-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Save templates, phrases, or notes to reference across sessions..."
            className="w-full px-3 py-2 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y text-sm"
            style={{ minHeight: '150px' }}
          />
          <div className="flex justify-end">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!note}
                className="px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600 rounded hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">Clear all notes?</span>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
