import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTimerStore } from '../../store/useTimerStore';
import Timer from './Timer';
import QuestionDisplay from './QuestionDisplay';
import WritingArea from './WritingArea';
import InstructionsPanel from '../Instructions/InstructionsPanel';
import CustomNote from './CustomNote';
import questions from '../../data/questions.json';
import { parseCustomQuestion } from '../../utils/parseCustomQuestion';
import type { Task1Question, Task2Question } from '../../types';

export default function PracticeSession() {
  const currentQuestion = useAppStore((state) => state.currentQuestion);
  const currentTask = useAppStore((state) => state.currentTask);
  const isSubmitted = useAppStore((state) => state.isSubmitted);
  const submitSession = useAppStore((state) => state.submitSession);
  const resetSession = useAppStore((state) => state.resetSession);
  const startSession = useAppStore((state) => state.startSession);
  const setDuration = useTimerStore((state) => state.setDuration);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);

  const [showChooseModal, setShowChooseModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customText, setCustomText] = useState('');

  // Set timer duration and start on mount
  useEffect(() => {
    const durationSeconds = currentTask === 'task1' ? 27 * 60 : 26 * 60;
    setDuration(durationSeconds);
    startTimer();

    return () => {
      pauseTimer();
    };
  }, [currentTask, setDuration, startTimer, pauseTimer]);

  const handleSubmit = () => {
    pauseTimer();
    submitSession();
  };

  const handleBack = () => {
    pauseTimer();
    resetSession();
  };

  const handleChooseQuestion = (question: Task1Question | Task2Question) => {
    if (!currentTask) return;
    startSession(currentTask, question);
    setShowChooseModal(false);
  };

  const handleCreateCustom = () => {
    if (!customText.trim() || !currentTask) return;
    const id = 'custom-' + Date.now();
    if (currentTask === 'task1') {
      const parsed = parseCustomQuestion(customText);
      const question: Task1Question = {
        id,
        type: 'task1',
        title: parsed.title,
        prompt: customText.trim(),
        situation: parsed.situation,
        bulletPoints: parsed.bulletPoints,
        tone: parsed.tone,
        recipient: '',
      };
      startSession('task1', question);
    } else {
      const parsed = parseCustomQuestion(customText);
      const question: Task2Question = {
        id,
        type: 'task2',
        title: parsed.title,
        prompt: customText.trim(),
        topic: parsed.situation,
        instructions: parsed.situation,
        viewpoints: parsed.bulletPoints,
      };
      startSession('task2', question);
    }
    setCustomText('');
    setShowCustomModal(false);
  };

  if (!currentQuestion) return null;

  const taskQuestions = currentTask === 'task1' ? questions.task1 : questions.task2;

  return (
    <section className="space-y-4">
      {/* Timer - full width at top */}
      <Timer />

      {/* Instructions Panel */}
      <InstructionsPanel taskType={currentTask || 'task1'} />

      {/* Main content area - split on desktop */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Question panel - 40% on desktop */}
        <div className="w-full lg:w-2/5">
          <QuestionDisplay
            question={currentQuestion}
            onChooseQuestion={() => setShowChooseModal(true)}
            onCreateCustom={() => setShowCustomModal(true)}
          />
        </div>

        {/* Writing area - 60% on desktop */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <WritingArea />

          {/* Custom Note */}
          <div className="mt-4">
            <CustomNote />
          </div>

          {/* Action Buttons */}
          {!isSubmitted && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBack}
                className="w-full sm:w-auto py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Back to Task Selection
              </button>
              <button
                onClick={handleSubmit}
                className="w-full sm:flex-1 py-3 px-6 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
              >
                Submit Writing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Choose Question Modal */}
      {showChooseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose a Question</h3>
              <button
                onClick={() => setShowChooseModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {taskQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleChooseQuestion(q as Task1Question | Task2Question)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent ${
                    q.id === currentQuestion.id
                      ? 'border-celpip-accent bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-celpip-accent hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{q.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {q.type === 'task1' ? (q as Task1Question).situation : (q as Task2Question).topic}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Question Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Custom Question</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Question / Prompt
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste your custom writing question or prompt here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-celpip-accent resize-y"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustom}
                  disabled={!customText.trim()}
                  className="px-4 py-2 text-sm font-medium bg-celpip-blue hover:bg-celpip-lightblue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-celpip-accent"
                >
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
