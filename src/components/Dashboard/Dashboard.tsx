import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import StatsCard from './StatsCard';

function getClbInterpretation(score: number): string {
  if (score >= 11.5) return `Your average score of ${score} corresponds to CLB 12 (Advanced proficiency)`;
  if (score >= 10.5) return `Your average score of ${score} corresponds to CLB 11 (Advanced proficiency)`;
  if (score >= 9.5) return `Your average score of ${score} corresponds to CLB 10 (Highly effective)`;
  if (score >= 8.5) return `Your average score of ${score} corresponds to CLB 8-9 (Good to Effective)`;
  if (score >= 7.5) return `Your average score of ${score} corresponds to CLB 8 (Good)`;
  if (score >= 6.5) return `Your average score of ${score} corresponds to CLB 7 (Adequate - meets Express Entry)`;
  if (score >= 5.5) return `Your average score of ${score} corresponds to CLB 6 (Developing)`;
  if (score >= 4.5) return `Your average score of ${score} corresponds to CLB 5 (Acquiring)`;
  if (score >= 3.5) return `Your average score of ${score} corresponds to CLB 4 (Basic - meets Citizenship)`;
  return `Your average score of ${score} corresponds to CLB 3 or below (Initial)`;
}

export default function Dashboard() {
  const history = useAppStore((state) => state.history);

  const totalSessions = history.length;
  const averageScore =
    history.filter((h) => h.feedback).length > 0
      ? (
          history
            .filter((h) => h.feedback)
            .reduce((sum, h) => sum + (h.feedback?.overallScore || 0), 0) /
          history.filter((h) => h.feedback).length
        ).toFixed(1)
      : 'N/A';
  const task1Completed = history.filter((h) => h.session.taskType === 'task1').length;
  const task2Completed = history.filter((h) => h.session.taskType === 'task2').length;
  const recentSessions = history.slice(0, 5);

  return (
    <section>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-celpip-blue dark:text-celpip-accent">
          CELPIP Writing Practice
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
          Improve your CELPIP writing skills with timed practice sessions and AI-powered feedback.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Sessions"
          value={totalSessions}
          subtitle="practice sessions"
          icon="📝"
        />
        <StatsCard
          title="Average Score"
          value={averageScore}
          subtitle="out of 12"
          icon="⭐"
        />
        <StatsCard
          title="Task 1 Completed"
          value={task1Completed}
          subtitle="email writing"
          icon="✉️"
        />
        <StatsCard
          title="Task 2 Completed"
          value={task2Completed}
          subtitle="survey responses"
          icon="📊"
        />
      </div>

      {/* CLB Score Interpretation */}
      {averageScore !== 'N/A' && (
        <div className="mb-8 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
            {getClbInterpretation(parseFloat(averageScore as string))}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Quick Start
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/practice"
            state={{ taskType: 'task1' }}
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
          >
            <span className="mr-2 text-xl">✉️</span>
            Start Task 1 - Email
          </Link>
          <Link
            to="/practice"
            state={{ taskType: 'task2' }}
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-celpip-blue hover:bg-celpip-lightblue text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2"
          >
            <span className="mr-2 text-xl">📊</span>
            Start Task 2 - Survey
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Recent Activity
        </h2>
        {recentSessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No practice sessions yet. Start your first practice to see activity here.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {recentSessions.map((entry, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {entry.session.taskType === 'task1' ? '✉️' : '📊'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.session.question.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.date} - {entry.session.wordCount} words
                    </p>
                  </div>
                </div>
                {entry.feedback && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Score: {entry.feedback.overallScore}/12
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
