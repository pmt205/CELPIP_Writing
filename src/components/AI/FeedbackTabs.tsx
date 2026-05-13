import { useState, type ReactNode } from 'react';

export interface TabDefinition {
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface FeedbackTabsProps {
  tabs: TabDefinition[];
}

export default function FeedbackTabs({ tabs }: FeedbackTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 -mx-6 px-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-[3px] ${
              activeTab === index
                ? 'border-celpip-accent text-celpip-accent'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`mt-4 ${activeTab === index ? 'animate-fade-in' : 'hidden'}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
