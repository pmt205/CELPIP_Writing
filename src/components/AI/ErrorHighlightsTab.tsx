import type { ReactElement } from 'react';
import type { ErrorHighlight } from '../../types';

interface ErrorHighlightsTabProps {
  studentText?: string;
  errorHighlights?: ErrorHighlight[];
}

const typeBadgeColors: Record<string, string> = {
  grammar: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  vocabulary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  coherence: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  spelling: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  punctuation: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  style: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
};

function getTypeBadgeColor(type: string): string {
  return typeBadgeColors[type.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}

function buildAnnotatedText(text: string, errors: ErrorHighlight[]): ReactElement[] {
  const parts: ReactElement[] = [];
  let remaining = text;
  let keyIndex = 0;
  const usedPositions = new Set<string>();

  // Sort errors by their position in the text (first occurrence)
  const sortedErrors = [...errors]
    .map((err) => {
      const pos = remaining.indexOf(err.original);
      return { ...err, pos };
    })
    .filter((err) => err.pos !== -1)
    .sort((a, b) => a.pos - b.pos);

  let offset = 0;

  for (const error of sortedErrors) {
    const posInRemaining = remaining.indexOf(error.original);
    if (posInRemaining === -1) continue;

    const posKey = `${offset + posInRemaining}:${error.original}`;
    if (usedPositions.has(posKey)) continue;
    usedPositions.add(posKey);

    // Add text before the error
    if (posInRemaining > 0) {
      parts.push(
        <span key={keyIndex++}>{remaining.substring(0, posInRemaining)}</span>
      );
    }

    // Add the error annotation
    parts.push(
      <span
        key={keyIndex++}
        className="line-through bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-0.5 rounded"
      >
        {error.original}
      </span>
    );
    parts.push(
      <span
        key={keyIndex++}
        className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-0.5 rounded font-medium"
      >
        {error.correction}
      </span>
    );

    offset += posInRemaining + error.original.length;
    remaining = remaining.substring(posInRemaining + error.original.length);
  }

  // Add any remaining text
  if (remaining) {
    parts.push(<span key={keyIndex++}>{remaining}</span>);
  }

  return parts;
}

export default function ErrorHighlightsTab({ studentText, errorHighlights }: ErrorHighlightsTabProps) {
  if (!errorHighlights || errorHighlights.length === 0) {
    return (
      <div className="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          No specific errors highlighted for this response.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Annotated text */}
      {studentText && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Annotated Text
          </h4>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {buildAnnotatedText(studentText, errorHighlights)}
          </p>
        </div>
      )}

      {/* Error summary list */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Error Summary ({errorHighlights.length} {errorHighlights.length === 1 ? 'issue' : 'issues'})
        </h4>
        <div className="space-y-3">
          {errorHighlights.map((error, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeBadgeColor(error.type)}`}>
                  {error.type}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="line-through text-red-600 dark:text-red-400">{error.original}</span>
                  {' '}
                  <span className="text-green-600 dark:text-green-400 font-medium">{error.correction}</span>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {error.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
