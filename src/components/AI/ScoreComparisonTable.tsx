import { useState } from 'react';

interface ScoreLevel {
  celpipLevel: string;
  clbLevel: string;
  description: string;
}

const scoreData: ScoreLevel[] = [
  { celpipLevel: '12', clbLevel: '12', description: 'Advanced proficiency - Writing is sophisticated, precise, and highly effective with near-native control' },
  { celpipLevel: '11', clbLevel: '11', description: 'Advanced proficiency - Writing demonstrates excellent command with occasional minor imprecisions' },
  { celpipLevel: '10', clbLevel: '10', description: 'Highly effective - Writing is clear, detailed, and well-organized with good control of complex structures' },
  { celpipLevel: '9', clbLevel: '9', description: 'Effective - Writing is generally clear with good organization and vocabulary range; minor errors' },
  { celpipLevel: '8', clbLevel: '8', description: 'Good - Writing adequately addresses the task with reasonable organization; some errors do not impede meaning' },
  { celpipLevel: '7', clbLevel: '7', description: 'Adequate - Writing addresses main points with acceptable organization; errors occasionally impede meaning' },
  { celpipLevel: '6', clbLevel: '6', description: 'Developing - Writing attempts to address the task but may miss key points; limited vocabulary and frequent errors' },
  { celpipLevel: '5', clbLevel: '5', description: 'Acquiring - Writing partially addresses the task with basic vocabulary; errors frequently impede communication' },
  { celpipLevel: '4', clbLevel: '4', description: 'Developing basic - Limited ability to convey ideas in writing; significant errors throughout' },
  { celpipLevel: '3L', clbLevel: '3', description: 'Initial - Very limited writing ability; barely addresses the task' },
  { celpipLevel: '3', clbLevel: '3', description: 'Initial - Very limited writing ability; barely addresses the task' },
  { celpipLevel: 'M', clbLevel: 'Below 1', description: 'Minimal - Insufficient evidence of writing ability' },
];

function getRowHighlight(clbLevel: string): string {
  if (clbLevel === '7') {
    return 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500';
  }
  if (clbLevel === '4') {
    return 'bg-amber-50 dark:bg-amber-900/30 border-l-4 border-l-amber-500';
  }
  return '';
}

export default function ScoreComparisonTable() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-celpip-accent hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        aria-expanded={expanded}
      >
        <span className="font-medium text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-celpip-accent" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          CELPIP Score Comparison Table
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500 rounded-sm"></span>
              <span className="text-gray-700 dark:text-gray-300">Express Entry (CLB 7+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-l-amber-500 rounded-sm"></span>
              <span className="text-gray-700 dark:text-gray-300">Citizenship (CLB 4+)</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-celpip-blue text-white">
                  <th className="px-3 py-2 text-left font-semibold">CELPIP Level</th>
                  <th className="px-3 py-2 text-left font-semibold">CLB Level</th>
                  <th className="px-3 py-2 text-left font-semibold">Performance Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {scoreData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${getRowHighlight(row.clbLevel)} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                  >
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                      {row.celpipLevel}
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {row.clbLevel}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Immigration Context */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
              Immigration Score Requirements
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span><strong>Express Entry (CRS):</strong> Generally requires CLB 7+ (CELPIP 7+) for skilled workers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                <span><strong>Canadian Citizenship:</strong> Requires CLB 4+ (CELPIP 4+)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                <span><strong>Provincial Nominee Programs (PNP):</strong> Vary but typically require CLB 5-7</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
