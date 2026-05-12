import { generalScoringTips } from '../../data/examinerTraps';

export default function GeneralTipsSection() {
  return (
    <div>
      <div className="space-y-3">
        {generalScoringTips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-celpip-blue text-white text-sm font-bold rounded-full mr-3">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-300 pt-1">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
