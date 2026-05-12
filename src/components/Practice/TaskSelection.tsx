import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import questions from '../../data/questions.json';
import type { Task1Question, Task2Question } from '../../types';

interface TaskSelectionProps {
  onTaskSelected?: () => void;
  preselectedTask?: 'task1' | 'task2' | null;
}

export default function TaskSelection({ onTaskSelected, preselectedTask }: TaskSelectionProps) {
  const startSession = useAppStore((state) => state.startSession);
  const hasAutoStarted = useRef(false);
  const lastPreselectedTask = useRef<'task1' | 'task2' | null | undefined>(null);

  const handleSelectTask = (taskType: 'task1' | 'task2') => {
    const taskQuestions = taskType === 'task1' ? questions.task1 : questions.task2;
    const randomIndex = Math.floor(Math.random() * taskQuestions.length);
    const question = taskQuestions[randomIndex] as Task1Question | Task2Question;
    startSession(taskType, question);
    onTaskSelected?.();
  };

  // Reset hasAutoStarted when preselectedTask changes to a different value
  useEffect(() => {
    if (preselectedTask !== lastPreselectedTask.current) {
      lastPreselectedTask.current = preselectedTask;
      if (preselectedTask) {
        hasAutoStarted.current = false;
      }
    }
  }, [preselectedTask]);

  // If a preselected task was passed, start it immediately via useEffect
  useEffect(() => {
    if (preselectedTask && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      handleSelectTask(preselectedTask);
    }
  }, [preselectedTask]);

  if (preselectedTask && hasAutoStarted.current) {
    return null;
  }

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Choose Your Task
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Select a writing task to begin your timed practice session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task 1 Card */}
        <button
          onClick={() => handleSelectTask('task1')}
          className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-celpip-accent focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">✉️</span>
            <h2 className="text-xl font-bold text-celpip-blue dark:text-celpip-accent">
              Task 1 - Email Writing
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-celpip-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration: 27 minutes
            </p>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-celpip-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recommended: 150-200 words
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Write an email based on a given situation. You will need to address specific points using an appropriate tone.
            </p>
          </div>
        </button>

        {/* Task 2 Card */}
        <button
          onClick={() => handleSelectTask('task2')}
          className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-celpip-accent focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">📊</span>
            <h2 className="text-xl font-bold text-celpip-blue dark:text-celpip-accent">
              Task 2 - Survey Response
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-celpip-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration: 26 minutes
            </p>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-celpip-lightblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recommended: 150-200 words
            </p>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Respond to a survey question by stating your opinion and supporting it with reasons and examples.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
