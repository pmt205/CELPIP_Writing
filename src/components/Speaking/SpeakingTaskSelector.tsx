import { speakingTasks } from '../../data/speakingQuestions';

interface SpeakingTaskSelectorProps {
  onTaskSelect: (taskNumber: number) => void;
  onChoose?: (taskNumber: number) => void;
}

const taskEmojis: Record<number, string> = {
  1: '💡',
  2: '📖',
  3: '🖼️',
  4: '🔮',
  5: '⚖️',
  6: '🤝',
  7: '💬',
  8: '❓',
};

export default function SpeakingTaskSelector({ onTaskSelect, onChoose }: SpeakingTaskSelectorProps) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Speaking Practice
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Choose a speaking task to begin your timed practice session with AI feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {speakingTasks.map((task) => (
          <div
            key={task.task}
            role="button"
            tabIndex={0}
            onClick={() => onTaskSelect(task.task)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTaskSelect(task.task);
              }
            }}
            className="cursor-pointer text-left bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-5 border-2 border-transparent hover:border-celpip-accent focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">{taskEmojis[task.task] || '🎤'}</span>
              <span className="text-xs font-semibold text-celpip-lightblue dark:text-celpip-accent uppercase">
                Task {task.task}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {task.name}
            </h3>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-celpip-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Prep: {task.prepTime}s
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Speaking: {task.speakingTime}s
              </p>
            </div>
            {onChoose && (
              <button
                onClick={(e) => { e.stopPropagation(); onChoose(task.task); }}
                className="mt-3 w-full text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Choose
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
