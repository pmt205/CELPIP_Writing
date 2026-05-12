import { task1Traps, task2Traps } from '../../data/examinerTraps';
import type { ExaminerTrap } from '../../data/examinerTraps';

function TrapCard({ trap }: { trap: ExaminerTrap }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-bold text-gray-900 dark:text-gray-100">{trap.trap}</span>
      </div>
      <p className="text-sm text-red-600 dark:text-red-400 mb-1">
        <span className="font-medium">Why it hurts:</span> {trap.why_it_hurts}
      </p>
      <p className="text-sm text-green-600 dark:text-green-400">
        <span className="font-medium">How to fix:</span> {trap.fix}
      </p>
    </div>
  );
}

export default function ExaminerTrapsSection() {
  return (
    <div>
      {/* Task 1 Traps */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Task 1 - Email Traps
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {task1Traps.map((trap, index) => (
          <TrapCard key={index} trap={trap} />
        ))}
      </div>

      {/* Task 2 Traps */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Task 2 - Survey Traps
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {task2Traps.map((trap, index) => (
          <TrapCard key={index} trap={trap} />
        ))}
      </div>
    </div>
  );
}
