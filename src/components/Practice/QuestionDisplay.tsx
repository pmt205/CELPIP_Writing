import { useState } from 'react';
import type { Task1Question, Task2Question } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import questions from '../../data/questions.json';

interface QuestionDisplayProps {
  question: Task1Question | Task2Question;
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const [collapsed, setCollapsed] = useState(false);
  const startSession = useAppStore((state) => state.startSession);
  const currentTask = useAppStore((state) => state.currentTask);

  const handleLoadNewQuestion = () => {
    if (!currentTask) return;
    const taskQuestions = currentTask === 'task1' ? questions.task1 : questions.task2;
    const filtered = taskQuestions.filter((q) => q.id !== question.id);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const newQuestion = filtered[randomIndex] as Task1Question | Task2Question;
    startSession(currentTask, newQuestion);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-celpip-blue dark:bg-celpip-dark flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">
          {question.type === 'task1' ? 'Task 1 - Email Writing' : 'Task 2 - Survey Response'}
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="md:hidden text-white p-1 rounded focus:outline-none focus:ring-2 focus:ring-celpip-accent"
          aria-label={collapsed ? 'Expand question' : 'Collapse question'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              {question.title}
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              {question.prompt}
            </p>
          </div>

          {question.type === 'task1' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Situation
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {(question as Task1Question).situation}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Tone: <span className="capitalize">{(question as Task1Question).tone}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Address the following points:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {(question as Task1Question).bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {question.type === 'task2' && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Topic
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {(question as Task2Question).topic}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Instructions
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  {(question as Task2Question).instructions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Consider these viewpoints:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {(question as Task2Question).viewpoints.map((viewpoint, index) => (
                    <li key={index}>{viewpoint}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <button
            onClick={handleLoadNewQuestion}
            className="mt-4 px-4 py-2 text-sm font-medium text-celpip-blue dark:text-celpip-accent border border-celpip-blue dark:border-celpip-accent rounded-md hover:bg-celpip-blue hover:text-white dark:hover:bg-celpip-accent dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
          >
            Load New Question
          </button>
        </div>
      )}
    </section>
  );
}
