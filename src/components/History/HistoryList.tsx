import { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { downloadJsonFile } from '../../utils/exportUtils';
import HistoryDetail from './HistoryDetail';
import type { PracticeHistory } from '../../types';

export default function HistoryList() {
  const history = useAppStore((state) => state.history);
  const clearHistory = useAppStore((state) => state.clearHistory);
  const importHistory = useAppStore((state) => state.importHistory);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirm(false);
  };

  const handleExportAll = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `celpip_history_backup_${date}.json`;
    downloadJsonFile(history, filename);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!Array.isArray(data)) {
          setImportMessage('Error: File does not contain a valid history array.');
          return;
        }
        // Validate entries have required fields
        const validEntries = data.filter(
          (item: unknown) =>
            item &&
            typeof item === 'object' &&
            'session' in (item as Record<string, unknown>) &&
            'date' in (item as Record<string, unknown>) &&
            typeof (item as Record<string, unknown>).session === 'object' &&
            (item as Record<string, unknown>).session !== null &&
            'id' in ((item as Record<string, unknown>).session as Record<string, unknown>)
        ) as PracticeHistory[];

        if (validEntries.length === 0) {
          setImportMessage('Error: No valid history entries found in file.');
          return;
        }

        const existingIds = new Set(history.map(h => h.session.id));
        const newCount = validEntries.filter(e => !existingIds.has(e.session.id)).length;

        importHistory(validEntries);
        setImportMessage(`Successfully imported ${newCount} new session${newCount !== 1 ? 's' : ''}.`);
        setTimeout(() => setImportMessage(null), 4000);
      } catch {
        setImportMessage('Error: Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <section>
      {/* Hidden file input for import - always available */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleImportFile}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Practice History
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Review your past practice sessions and feedback.
          </p>
        </div>
        {history.length > 0 && (
          <div className="relative flex items-center space-x-2">
            <button
              onClick={handleImportClick}
              className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </span>
            </button>
            <button
              onClick={handleExportAll}
              className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export All
              </span>
            </button>
            {showConfirm ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600 dark:text-red-400">Are you sure?</span>
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear History
              </button>
            )}
          </div>
        )}
      </div>

      {/* Import status message */}
      {importMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          importMessage.startsWith('Error')
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
        }`}>
          {importMessage}
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No practice sessions yet.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Complete a practice session and save it to see your history here.
          </p>
          <button
            onClick={handleImportClick}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import History
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry: PracticeHistory, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-celpip-accent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {entry.session.taskType === 'task1' ? '✉️' : '📊'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {entry.session.question.title}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.date}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          entry.session.taskType === 'task1'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                          {entry.session.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.session.wordCount} words
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {entry.feedback && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {entry.feedback.overallScore}/12
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-gray-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              {expandedIndex === index && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <HistoryDetail entry={entry} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
