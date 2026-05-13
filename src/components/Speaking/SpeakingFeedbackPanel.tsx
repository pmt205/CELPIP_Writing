import { useState } from 'react';
import type { SpeakingFeedback } from '../../types';

interface SpeakingFeedbackPanelProps {
  feedback: SpeakingFeedback;
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

type TabId = 'overview' | 'transcript' | 'criteria' | 'polished';

export default function SpeakingFeedbackPanel({ feedback }: SpeakingFeedbackPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'transcript', label: 'Transcript', icon: '📝' },
    { id: 'criteria', label: 'Criteria', icon: '📋' },
    { id: 'polished', label: 'Polished Version', icon: '✨' },
  ];

  const renderTranscriptWithHighlights = () => {
    if (!feedback.transcript) {
      return <p className="text-gray-500 dark:text-gray-400 italic">No transcript available.</p>;
    }

    let highlightedText = feedback.transcript;
    const highlights = feedback.errorHighlights || [];

    if (highlights.length === 0) {
      return (
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {highlightedText}
        </p>
      );
    }

    // Build segments with highlights
    const segments: { text: string; isError: boolean; correction?: string; type?: string; explanation?: string }[] = [];
    let remaining = highlightedText;

    // Sort highlights by position in text (first occurrence)
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
      segments.push({
        text: highlight.original,
        isError: true,
        correction: highlight.correction,
        type: highlight.type,
        explanation: highlight.explanation,
      });
      remaining = remaining.slice(index + highlight.original.length);
    }

    if (remaining) {
      segments.push({ text: remaining, isError: false });
    }

    return (
      <div>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {segments.map((segment, i) =>
            segment.isError ? (
              <span
                key={i}
                className="relative inline bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 underline decoration-red-500 decoration-wavy cursor-help"
                title={`${segment.type}: ${segment.explanation} -> ${segment.correction}`}
              >
                {segment.text}
                <span className="text-green-600 dark:text-green-400 text-xs ml-1 no-underline">
                  ({segment.correction})
                </span>
              </span>
            ) : (
              <span key={i}>{segment.text}</span>
            )
          )}
        </p>

        {/* Error list */}
        {highlights.length > 0 && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Errors Found ({highlights.length})
            </h4>
            <div className="space-y-3">
              {highlights.map((error, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      {error.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="line-through text-red-600 dark:text-red-400">{error.original}</span>
                    {' -> '}
                    <span className="text-green-600 dark:text-green-400 font-medium">{error.correction}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{error.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-[3px] ${
              activeTab === tab.id
                ? 'border-celpip-accent text-celpip-accent'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Score display */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-celpip-accent/10 dark:bg-celpip-accent/20 mb-3">
                <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                  {feedback.overallScore}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">out of 12</p>
            </div>

            {/* Overall feedback */}
            {feedback.overallFeedback && (
              <div className="border-l-4 border-celpip-accent pl-4 py-2">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feedback.overallFeedback}
                </p>
              </div>
            )}

            {/* Suggestions */}
            {feedback.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                  Suggestions for Improvement
                </h4>
                <ul className="space-y-2">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Transcript tab */}
        {activeTab === 'transcript' && (
          <div className="animate-fade-in">
            {renderTranscriptWithHighlights()}
          </div>
        )}

        {/* Criteria tab */}
        {activeTab === 'criteria' && (
          <div className="space-y-3 animate-fade-in">
            {feedback.categories.map((category, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {category.name}
                  </h4>
                  <span className={`font-bold text-sm ${getScoreColor(category.score)}`}>
                    {category.score}/12
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getScoreBgColor(category.score)}`}
                    style={{ width: `${(category.score / 12) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {category.feedback}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Polished Version tab */}
        {activeTab === 'polished' && (
          <div className="animate-fade-in">
            {feedback.polishedVersion ? (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3 uppercase tracking-wide">
                  Ideal Response (Level 10+)
                </h4>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {feedback.polishedVersion}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No polished version available for this response.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
