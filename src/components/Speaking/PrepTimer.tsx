import { useState, useEffect, useRef } from 'react';

interface PrepTimerProps {
  prepSeconds: number;
  taskName: string;
  taskNumber: number;
  questionText: string;
  onComplete: () => void;
}

export default function PrepTimer({ prepSeconds, taskName, taskNumber, questionText, onComplete }: PrepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(prepSeconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (timeLeft <= 0) {
      onCompleteRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const progress = ((prepSeconds - timeLeft) / prepSeconds) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-celpip-accent bg-celpip-accent/10 dark:bg-celpip-accent/20 rounded-full mb-2">
          Preparation Time
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Task {taskNumber} - {taskName}
        </h2>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="text-celpip-accent transition-all duration-1000"
            />
          </svg>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {timeLeft}s
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Read the question and prepare your response
        </p>
      </div>

      {/* Question display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Question
        </h3>
        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
          {questionText}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-celpip-accent rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
