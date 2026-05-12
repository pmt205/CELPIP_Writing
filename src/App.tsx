import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-celpip-blue dark:text-celpip-accent">
        CELPIP Writing Practice
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Welcome to the CELPIP Writing Practice app. Select a task to begin practicing.
      </p>
    </div>
  );
}

function PracticePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Practice</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Select a writing task to practice.</p>
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Practice History</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Your completed writing sessions will appear here.</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Configure your API key and preferences.</p>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Manage questions and app settings.</p>
    </div>
  );
}

function App() {
  const darkMode = useAppStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
