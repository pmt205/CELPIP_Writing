import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTimerStore } from '../../store/useTimerStore';
import Timer from './Timer';
import QuestionDisplay from './QuestionDisplay';
import WritingArea from './WritingArea';
import InstructionsPanel from '../Instructions/InstructionsPanel';

export default function PracticeSession() {
  const currentQuestion = useAppStore((state) => state.currentQuestion);
  const currentTask = useAppStore((state) => state.currentTask);
  const isSubmitted = useAppStore((state) => state.isSubmitted);
  const submitSession = useAppStore((state) => state.submitSession);
  const setDuration = useTimerStore((state) => state.setDuration);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);

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

  if (!currentQuestion) return null;

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
          <QuestionDisplay question={currentQuestion} />
        </div>

        {/* Writing area - 60% on desktop */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <WritingArea />

          {/* Submit Button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="mt-4 w-full py-3 px-6 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
            >
              Submit Writing
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
