import type { AIFeedback } from '../../types';
import ScoreComparisonTable from './ScoreComparisonTable';
import FeedbackTabs from './FeedbackTabs';
import OverallFeedbackTab from './OverallFeedbackTab';
import ErrorHighlightsTab from './ErrorHighlightsTab';
import PolishedVersionTab from './PolishedVersionTab';
import CriteriaBreakdownTab from './CriteriaBreakdownTab';

interface AIFeedbackProps {
  feedback: AIFeedback;
  studentText?: string;
}

function getScoreColor(score: number): string {
  if (score >= 9) return 'text-green-600 dark:text-green-400';
  if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBadgeBg(score: number): string {
  if (score >= 9) return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
  if (score >= 5) return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700';
  return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700';
}

function getMiniScoreColor(score: number): string {
  if (score >= 9) return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
  if (score >= 5) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
  return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
}

export default function AIFeedbackPanel({ feedback, studentText }: AIFeedbackProps) {
  const tabs = [
    {
      label: 'Overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <OverallFeedbackTab
          overallFeedback={feedback.overallFeedback}
          suggestions={feedback.suggestions}
        />
      ),
    },
    {
      label: 'Errors',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <ErrorHighlightsTab
          studentText={studentText}
          errorHighlights={feedback.errorHighlights}
        />
      ),
    },
    {
      label: 'Polished',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744l.311 1.244 1.244.311a1 1 0 010 1.934l-1.244.311-.311 1.244a1 1 0 01-1.934 0l-.311-1.244-1.244-.311a1 1 0 010-1.934l1.244-.311.311-1.244A1 1 0 0112 2z" />
        </svg>
      ),
      content: (
        <PolishedVersionTab polishedVersion={feedback.polishedVersion} />
      ),
    },
    {
      label: 'Criteria',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      content: (
        <CriteriaBreakdownTab categories={feedback.categories} />
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        AI Feedback
      </h3>

      {/* Score Overview Header */}
      <div className="flex flex-col items-center mb-6">
        {/* Overall score badge */}
        <div className={`flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBadgeBg(feedback.overallScore)}`}>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">/12</p>
          </div>
        </div>

        {/* Mini category score pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {feedback.categories.map((category, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getMiniScoreColor(category.score)}`}
            >
              {category.name}: {category.score}
            </span>
          ))}
        </div>
      </div>

      {/* Tabbed Content */}
      <FeedbackTabs tabs={tabs} />

      {/* Score Comparison Table */}
      <ScoreComparisonTable />
    </div>
  );
}
