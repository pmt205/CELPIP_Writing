import { useEffect, useRef, useState } from 'react';
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
  const [customExpanded, setCustomExpanded] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customTaskType, setCustomTaskType] = useState<'task1' | 'task2'>('task1');

  const handleSelectTask = (taskType: 'task1' | 'task2') => {
    const taskQuestions = taskType === 'task1' ? questions.task1 : questions.task2;
    const randomIndex = Math.floor(Math.random() * taskQuestions.length);
    const question = taskQuestions[randomIndex] as Task1Question | Task2Question;
    startSession(taskType, question);
    onTaskSelected?.();
  };

  const handleStartCustom = () => {
    if (!customText.trim()) return;

    const id = 'custom-' + Date.now();
    const userText = customText.trim();

    if (customTaskType === 'task1') {
      const question: Task1Question = {
        id,
        type: 'task1',
        title: 'Custom Question',
        prompt: userText,
        situation: userText,
        bulletPoints: ['Address all points in the prompt'],
        tone: 'formal' as const,
      };
      startSession('task1', question);
    } else {
      const question: Task2Question = {
        id,
        type: 'task2',
        title: 'Custom Question',
        prompt: userText,
        topic: 'Custom Topic',
        instructions: userText,
        viewpoints: ['Consider multiple perspectives'],
      };
      startSession('task2', question);
    }
    onTaskSelected?.();
  };

  // If a preselected task was passed, start it immediately
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

      {/* Custom Question Section */}
      <div className="mt-6">
        <button
          onClick={() => setCustomExpanded(!customExpanded)}
          className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-celpip-accent dark:hover:border-celpip-accent transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✏️</span>
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Or paste your own question
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${customExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {customExpanded && (
          <div className="mt-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-task-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Type
                </label>
                <select
                  id="custom-task-type"
                  value={customTaskType}
                  onChange={(e) => setCustomTaskType(e.target.value as 'task1' | 'task2')}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                >
                  <option value="task1">Task 1 - Email Writing</option>
                  <option value="task2">Task 2 - Survey Response</option>
                </select>
              </div>

              <div>
                <label htmlFor="custom-question-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Question / Prompt
                </label>
                <textarea
                  id="custom-question-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste your custom writing question or prompt here..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-celpip-accent resize-y"
                />
              </div>

              <button
                onClick={handleStartCustom}
                disabled={!customText.trim()}
                className="w-full sm:w-auto py-3 px-6 bg-celpip-blue hover:bg-celpip-lightblue disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
              >
                Start Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
