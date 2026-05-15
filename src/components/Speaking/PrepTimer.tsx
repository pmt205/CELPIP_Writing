import { useState, useEffect, useRef } from 'react';

interface PrepTimerProps {
  prepSeconds: number;
  taskName: string;
  taskNumber: number;
  questionText: string;
  onComplete: () => void;
  notes: string;
  onNotesChange: (value: string) => void;
  imageSrc?: string;
}

export default function PrepTimer({ prepSeconds, taskName, taskNumber, questionText, onComplete, notes, onNotesChange, imageSrc }: PrepTimerProps) {
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
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-celpip-accent bg-celpip-accent/10 dark:bg-celpip-accent/20 rounded-full mb-2">
          Preparation Time
        </span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Task {taskNumber} - {taskName}
        </h2>
      </div>

      {/* 50|50 Split Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column: Question + Timer */}
        <div className="w-full lg:w-1/2 space-y-4">
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
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
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {timeLeft}s
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Read the question and prepare your response
            </p>
          </div>

          {/* Question display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Question
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
              {questionText}
            </p>
          </div>

          {/* Scene image */}
          {imageSrc && (
            <div className="flex justify-center">
              <img src={imageSrc} alt="Scene" className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-md max-h-[300px] object-cover" />
            </div>
          )}

          {/* Progress bar */}
          <div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-celpip-accent rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right column: Notepad */}
        <div className="w-full lg:w-1/2">
          <div className="bg-amber-50 dark:bg-gray-800/80 rounded-xl shadow-sm p-4 border border-amber-200 dark:border-gray-600 h-full flex flex-col">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Notepad
              </h3>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
              Use this space to organize your thoughts
            </p>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Jot down key points here..."
              className="w-full flex-1 min-h-[200px] lg:min-h-[320px] resize-none rounded-lg border border-amber-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm p-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
