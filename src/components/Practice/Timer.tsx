import { useEffect, useRef } from 'react';
import { useTimerStore } from '../../store/useTimerStore';
import { useAppStore } from '../../store/useAppStore';

export default function Timer() {
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const isRunning = useTimerStore((state) => state.isRunning);
  const duration = useTimerStore((state) => state.duration);
  const tick = useTimerStore((state) => state.tick);
  const submitSession = useAppStore((state) => state.submitSession);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run the timer tick every second
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeRemaining <= 0 && duration > 0) {
      submitSession();
    }
  }, [timeRemaining, duration, submitSession]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progressPercent = duration > 0 ? (timeRemaining / duration) * 100 : 100;

  const getProgressColor = () => {
    if (progressPercent > 50) return 'bg-celpip-blue dark:bg-celpip-accent';
    if (progressPercent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (progressPercent > 50) return 'text-celpip-blue dark:text-celpip-accent';
    if (progressPercent > 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Time Remaining
        </span>
        <span className={`text-2xl font-bold font-mono ${getTextColor()}`}>
          {formattedTime}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={timeRemaining}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="Time remaining"
        />
      </div>
    </div>
  );
}
