interface AudioRecorderProps {
  isRecording: boolean;
  timeRemaining: number;
  audioLevel: number;
  onStop: () => void;
  notes?: string;
  imageSrc?: string;
}

export default function AudioRecorder({ isRecording, timeRemaining, audioLevel, onStop, notes, imageSrc }: AudioRecorderProps) {
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

  const hasReferenceContent = (notes && notes.trim()) || imageSrc;

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column: Recording controls */}
        <div className={`w-full ${hasReferenceContent ? 'lg:w-1/2' : ''} flex flex-col items-center justify-center`}>
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
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

        {/* Right column: Reference materials */}
        {hasReferenceContent && (
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Scene image reference */}
            {imageSrc && (
              <div className="flex justify-center">
                <img src={imageSrc} alt="Scene" className="rounded-lg border border-gray-200 dark:border-gray-700 max-h-[280px] object-cover shadow-md" />
              </div>
            )}

            {/* Notes display (read-only, always expanded) */}
            {notes && notes.trim() && (
              <div className="bg-amber-50 dark:bg-gray-800/80 rounded-lg border border-amber-200 dark:border-gray-600 p-4">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Your Notes
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
