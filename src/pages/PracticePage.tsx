import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import TaskSelection from '../components/Practice/TaskSelection';
import PracticeSession from '../components/Practice/PracticeSession';
import SessionSummary from '../components/Practice/SessionSummary';
import { useAppStore } from '../store/useAppStore';

export default function PracticePage() {
  const location = useLocation();
  const isActive = useAppStore((state) => state.isActive);
  const isSubmitted = useAppStore((state) => state.isSubmitted);
  const currentQuestion = useAppStore((state) => state.currentQuestion);

  // Check if a task type was passed from dashboard quick-start links
  const preselectedTask = (location.state as { taskType?: 'task1' | 'task2' } | null)?.taskType || null;

  // Clear the location state immediately so it doesn't persist on subsequent visits
  const hasClearedState = useRef(false);
  useEffect(() => {
    if (preselectedTask && !hasClearedState.current) {
      hasClearedState.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [preselectedTask]);

  const renderContent = () => {
    if (isSubmitted && currentQuestion) {
      return <SessionSummary />;
    }
    if (isActive && currentQuestion) {
      return <PracticeSession />;
    }
    return <TaskSelection preselectedTask={preselectedTask} />;
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}
