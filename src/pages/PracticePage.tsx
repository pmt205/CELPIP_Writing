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
  const resetSession = useAppStore((state) => state.resetSession);

  // Check if a task type was passed from dashboard quick-start links
  const preselectedTask = (location.state as { taskType?: 'task1' | 'task2' } | null)?.taskType || null;

  // When navigating with a preselected task, always reset any existing session first
  const hasResetForPreselection = useRef(false);
  useEffect(() => {
    if (preselectedTask) {
      hasResetForPreselection.current = true;
      resetSession();
      // Clear the location state so it doesn't persist on subsequent visits
      window.history.replaceState({}, document.title);
    } else {
      hasResetForPreselection.current = false;
    }
  }, [preselectedTask, resetSession]);

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
