import { useState } from 'react';

interface InstructionsPanelProps {
  taskType: 'task1' | 'task2';
}

export default function InstructionsPanel({ taskType }: InstructionsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-celpip-accent hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-celpip-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Writing Tips & Scoring Criteria
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {taskType === 'task1' ? (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Task 1 - Email Writing Tips
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Use an appropriate greeting and closing based on the required tone</li>
                  <li>Address ALL bullet points provided in the prompt</li>
                  <li>Match the tone (formal, informal, or semi-formal) throughout</li>
                  <li>Use clear paragraph structure with a logical flow</li>
                  <li>Aim for 150-200 words to fully develop your ideas</li>
                  <li>Use transition words to connect your ideas smoothly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Email Format Guide
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Formal: "Dear Mr./Ms. [Name]," - "Sincerely,"</li>
                  <li>Semi-formal: "Dear [First Name]," - "Best regards,"</li>
                  <li>Informal: "Hi [Name]," - "Cheers," or "Talk soon,"</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Task 2 - Survey Response Tips
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Clearly state your opinion or preference in the opening</li>
                  <li>Provide at least two supporting reasons with examples</li>
                  <li>Consider and address the alternative viewpoints</li>
                  <li>Use specific examples from personal experience or general knowledge</li>
                  <li>Aim for 150-200 words to fully develop your argument</li>
                  <li>End with a concluding statement that reinforces your position</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Response Structure
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Opening: State your opinion clearly</li>
                  <li>Body: Give 2-3 reasons with specific examples</li>
                  <li>Closing: Summarize your position</li>
                </ul>
              </div>
            </>
          )}

          {/* Scoring Criteria */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              CELPIP Scoring Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Task Response</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">How well you address the prompt</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Coherence</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Organization and logical flow</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Vocabulary</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Range and accuracy of word choice</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Grammar</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sentence structure and accuracy</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 sm:col-span-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">Spelling & Punctuation</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy in spelling and proper punctuation use</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
