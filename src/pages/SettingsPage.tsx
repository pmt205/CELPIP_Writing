import Layout from '../components/Layout/Layout';
import SettingsModal from '../components/AI/SettingsModal';
import { useAppStore } from '../store/useAppStore';

export default function SettingsPage() {
  const adminMode = useAppStore((state) => state.adminMode);
  const toggleAdminMode = useAppStore((state) => state.toggleAdminMode);

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
