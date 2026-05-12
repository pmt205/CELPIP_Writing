import type { AIFeedback } from '../../types';
import ScoreComparisonTable from './ScoreComparisonTable';

interface AIFeedbackProps {
  feedback: AIFeedback;
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

function getScoreBadgeBg(score: number): string {
  if (score >= 9) return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
  if (score >= 5) return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700';
  return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700';
}

export default function AIFeedbackPanel({ feedback }: AIFeedbackProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        AI Feedback
      </h3>

      {/* Overall Score Badge */}
      <div className="flex justify-center mb-6">
        <div className={`flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBadgeBg(feedback.overallScore)}`}>
          <div className="text-center">
            <p className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">/12</p>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-4 mb-6">
        {feedback.categories.map((category, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {category.name}
              </h4>
              <span className={`font-bold ${getScoreColor(category.score)}`}>
                {category.score}/12
              </span>
            </div>
            {/* Score bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
              <div
                className={`h-full rounded-full ${getScoreBgColor(category.score)}`}
                style={{ width: `${(category.score / 12) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {category.feedback}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-celpip-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score Comparison Table */}
      <ScoreComparisonTable />
    </div>
  );
}
