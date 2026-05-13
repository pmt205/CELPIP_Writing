interface OverallFeedbackTabProps {
  overallFeedback?: string;
  suggestions: string[];
}

export default function OverallFeedbackTab({ overallFeedback, suggestions }: OverallFeedbackTabProps) {
  return (
    <div className="space-y-4">
      {/* Narrative feedback */}
      {overallFeedback ? (
        <div className="border-l-4 border-celpip-accent pl-4 py-2">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {overallFeedback}
          </p>
        </div>
      ) : (
        <div className="border-l-4 border-celpip-accent pl-4 py-2">
          <p className="text-gray-500 dark:text-gray-400 italic">
            Overall feedback summary is not available for this response.
          </p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
            Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
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
  );
}
