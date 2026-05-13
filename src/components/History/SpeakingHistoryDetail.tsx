import type { SpeakingHistory } from '../../types';

interface SpeakingHistoryDetailProps {
  entry: SpeakingHistory;
}

function getScoreColor(score: number): string {
  if (score >= 9) return 'text-green-600 dark:text-green-400';
  if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBgColor(score: number): string {
  if (score >= 9) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function SpeakingHistoryDetail({ entry }: SpeakingHistoryDetailProps) {
  const timeUsed = entry.session.endTime
    ? Math.round((entry.session.endTime - entry.session.startTime) / 1000)
    : 0;
  const minutes = Math.floor(timeUsed / 60);
  const seconds = timeUsed % 60;

  const feedback = entry.feedback;

  const renderTranscript = () => {
    if (!feedback?.transcript) {
      return <p className="text-gray-500 dark:text-gray-400 italic text-sm">No transcript available.</p>;
    }

    const highlights = feedback.errorHighlights || [];
    if (highlights.length === 0) {
      return (
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
          {feedback.transcript}
        </p>
      );
    }

    const segments: { text: string; isError: boolean; correction?: string }[] = [];
    let remaining = feedback.transcript;

    const sortedHighlights = [...highlights].sort((a, b) => {
      const posA = remaining.indexOf(a.original);
      const posB = remaining.indexOf(b.original);
      return posA - posB;
    });

    for (const highlight of sortedHighlights) {
      const index = remaining.indexOf(highlight.original);
      if (index === -1) continue;
      if (index > 0) {
        segments.push({ text: remaining.slice(0, index), isError: false });
      }
      segments.push({ text: highlight.original, isError: true, correction: highlight.correction });
      remaining = remaining.slice(index + highlight.original.length);
    }
    if (remaining) {
      segments.push({ text: remaining, isError: false });
    }

    return (
      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
        {segments.map((seg, i) =>
          seg.isError ? (
            <span
              key={i}
              className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 underline decoration-red-500 decoration-wavy"
              title={`Correction: ${seg.correction}`}
            >
              {seg.text}
              <span className="text-green-600 dark:text-green-400 text-xs ml-1 no-underline">
                ({seg.correction})
              </span>
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Question prompt */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Question Prompt
        </h4>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {entry.session.questionText}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Task: <span className="font-medium text-gray-900 dark:text-white">
            {entry.session.taskNumber} - {entry.session.taskName}
          </span>
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Time: <span className="font-medium text-gray-900 dark:text-white">{minutes}m {seconds}s</span>
        </span>
      </div>

      {/* Transcript */}
      {feedback?.transcript && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Transcript
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
            {renderTranscript()}
          </div>
        </div>
      )}

      {/* Category scores */}
      {feedback && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Scores
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {feedback.categories.map((cat, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{cat.name}</span>
                  <span className={`text-xs font-bold ${getScoreColor(cat.score)}`}>{cat.score}/12</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div
                    className={`h-full rounded-full ${getScoreBgColor(cat.score)}`}
                    style={{ width: `${(cat.score / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Polished version */}
      {feedback?.polishedVersion && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Ideal Response
          </h4>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {feedback.polishedVersion}
            </p>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {feedback && feedback.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Suggestions
          </h4>
          <ul className="space-y-1">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="text-green-500 mt-0.5">&#10003;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
