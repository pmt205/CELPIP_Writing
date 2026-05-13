interface AudioRecorderProps {
  isRecording: boolean;
  timeRemaining: number;
  audioLevel: number;
  onStop: () => void;
}

export default function AudioRecorder({ isRecording, timeRemaining, audioLevel, onStop }: AudioRecorderProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Generate bar heights based on audio level with slight random variation
  const barCount = 7;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const centerDistance = Math.abs(i - Math.floor(barCount / 2));
    const variation = 1 - centerDistance * 0.15;
    const height = isRecording ? Math.max(0.1, audioLevel * variation * (0.8 + Math.random() * 0.4)) : 0.1;
    return Math.min(1, height);
  });

  return (
    <div className="max-w-md mx-auto text-center">
      {/* Recording status */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {isRecording && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {isRecording ? 'Recording...' : 'Stopped'}
        </span>
      </div>

      {/* Timer */}
      <div className="text-5xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
        {timeDisplay}
      </div>

      {/* Waveform visualization */}
      <div className="flex items-center justify-center space-x-1.5 h-16 mb-6">
        {bars.map((height, index) => (
          <div
            key={index}
            className="w-2 rounded-full bg-celpip-accent transition-all duration-150"
            style={{ height: `${Math.max(8, height * 64)}px` }}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Speak now... Recording will stop automatically when time is up.
      </p>

      {/* Stop button */}
      <button
        onClick={onStop}
        disabled={!isRecording}
        className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <rect x="6" y="6" width="8" height="8" rx="1" />
        </svg>
        Stop Recording
      </button>
    </div>
  );
}
