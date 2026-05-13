import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import SettingsModal from '../components/AI/SettingsModal';
import { useAppStore } from '../store/useAppStore';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const CUSTOM_VOCAB_KEY = 'celpip-custom-vocabulary';

interface CloudData {
  vocabulary?: Record<string, unknown>;
  questions?: Record<string, unknown>;
  [key: string]: unknown;
}

export default function SettingsPage() {
  const adminMode = useAppStore((state) => state.adminMode);
  const toggleAdminMode = useAppStore((state) => state.toggleAdminMode);
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);

  const [cloudUrl, setCloudUrl] = useState(settings.cloudDataUrl || '');
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cloudMessage, setCloudMessage] = useState('');

  const handleSaveCloudUrl = () => {
    setSettings({ cloudDataUrl: cloudUrl });
    setCloudMessage('Cloud Data URL saved.');
    setCloudStatus('success');
    setTimeout(() => setCloudStatus('idle'), 3000);
  };

  const handleFetchCloud = async () => {
    if (!cloudUrl.trim()) {
      setCloudMessage('Please enter a Cloud Data URL first.');
      setCloudStatus('error');
      return;
    }
    setCloudStatus('loading');
    setCloudMessage('Fetching cloud data...');
    try {
      const response = await fetch(cloudUrl.trim());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: CloudData = await response.json();

      // Merge vocabulary if present
      if (data.vocabulary) {
        const existing = loadFromStorage<Record<string, unknown>>(CUSTOM_VOCAB_KEY, {});
        const merged = { ...existing, ...data.vocabulary };
        saveToStorage(CUSTOM_VOCAB_KEY, merged);
      }

      // Merge questions if present
      if (data.questions) {
        const existingQuestions = loadFromStorage<Record<string, unknown>>('celpip-custom-questions', {});
        const merged = { ...existingQuestions, ...data.questions };
        saveToStorage('celpip-custom-questions', merged);
      }

      setCloudStatus('success');
      setCloudMessage('Cloud data fetched and merged successfully!');
      // Save URL to settings
      setSettings({ cloudDataUrl: cloudUrl });
    } catch (err) {
      setCloudStatus('error');
      setCloudMessage(`Failed to fetch: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleExportVocabulary = () => {
    const vocab = loadFromStorage(CUSTOM_VOCAB_KEY, {});
    const blob = new Blob([JSON.stringify(vocab, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'celpip-custom-vocabulary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVocabulary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const existing = loadFromStorage<Record<string, unknown>>(CUSTOM_VOCAB_KEY, {});
        const merged = { ...existing, ...data };
        saveToStorage(CUSTOM_VOCAB_KEY, merged);
        setCloudMessage('Vocabulary imported successfully!');
        setCloudStatus('success');
        setTimeout(() => setCloudStatus('idle'), 3000);
      } catch {
        setCloudMessage('Invalid JSON file.');
        setCloudStatus('error');
      }
    };
    reader.readAsText(file);
    // Reset input so re-importing same file triggers change
    e.target.value = '';
  };

  return (
    <Layout>
      <section>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Configure your AI feedback settings and preferences.
          </p>
        </div>

        <SettingsModal />

        {/* Cloud Data Sync Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cloud Data Sync
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Provide a URL to a JSON file containing vocabulary and/or questions data. On fetch, data will be merged into your local storage.
          </p>

          {/* Cloud Data URL */}
          <div>
            <label htmlFor="cloudDataUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cloud Data URL
            </label>
            <input
              id="cloudDataUrl"
              type="url"
              value={cloudUrl}
              onChange={(e) => setCloudUrl(e.target.value)}
              placeholder="https://example.com/celpip-data.json"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveCloudUrl}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
            >
              Save URL
            </button>
            <button
              onClick={handleFetchCloud}
              disabled={cloudStatus === 'loading'}
              className="px-4 py-2 text-sm font-medium bg-celpip-blue hover:bg-celpip-lightblue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-celpip-accent"
            >
              {cloudStatus === 'loading' ? 'Fetching...' : 'Fetch & Merge'}
            </button>
          </div>

          {cloudMessage && (
            <p className={`text-sm font-medium ${
              cloudStatus === 'success' ? 'text-green-600 dark:text-green-400' :
              cloudStatus === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-300'
            }`}>
              {cloudMessage}
            </p>
          )}

          {/* Vocabulary Export/Import */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Custom Vocabulary (Local)
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Export your custom vocabulary to share or back up, or import a vocabulary file to merge.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportVocabulary}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent"
              >
                Export Vocabulary
              </button>
              <label className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-celpip-accent">
                Import Vocabulary
                <input type="file" accept=".json" onChange={handleImportVocabulary} className="sr-only" />
              </label>
            </div>
          </div>
        </div>

        {/* Admin Mode Toggle */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Admin Mode
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enable to manage questions and access advanced features.
              </p>
            </div>
            <button
              onClick={toggleAdminMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-celpip-accent focus:ring-offset-2 ${
                adminMode ? 'bg-celpip-blue' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={adminMode}
              aria-label="Toggle admin mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  adminMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
