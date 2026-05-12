import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import VocabularySection from '../components/Tips/VocabularySection';
import ExaminerTrapsSection from '../components/Tips/ExaminerTrapsSection';
import GeneralTipsSection from '../components/Tips/GeneralTipsSection';

type TabKey = 'vocabulary' | 'traps' | 'general';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'vocabulary', label: 'Vocabulary Bank' },
  { key: 'traps', label: 'Examiner Traps' },
  { key: 'general', label: 'General Tips' },
];

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('vocabulary');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tips & Tricks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Boost your CELPIP writing score with vocabulary, strategies, and common pitfalls to avoid.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-celpip-blue text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'vocabulary' && <VocabularySection />}
          {activeTab === 'traps' && <ExaminerTrapsSection />}
          {activeTab === 'general' && <GeneralTipsSection />}
        </div>
      </div>
    </Layout>
  );
}
