import { useState } from 'react';
import { task1Vocabulary, task2Vocabulary, TaskVocabulary } from '../../data/vocabularyBank';

const categoryLabels: Record<string, string> = {
  formal_openings: 'Formal Openings',
  complaint_phrases: 'Complaint Phrases',
  request_phrases: 'Request Phrases',
  apology_phrases: 'Apology Phrases',
  persuasive_phrases: 'Persuasive Phrases',
  closing_phrases: 'Closing Phrases',
  opinion_phrases: 'Opinion Phrases',
  agreement_disagreement: 'Agreement & Disagreement',
  supporting_arguments: 'Supporting Arguments',
  comparison_phrases: 'Comparison Phrases',
  conclusion_phrases: 'Conclusion Phrases',
};

function CategoryCard({ category, phrases }: { category: string; phrases: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
      >
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {categoryLabels[category] || category}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <ul className="space-y-2">
            {phrases.map((phrase, index) => (
              <li key={index} className="flex items-start">
                <span className="text-celpip-accent mr-2 mt-1">&#8226;</span>
                <span className="text-gray-700 dark:text-gray-300">{phrase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function getCategories(vocabulary: TaskVocabulary): [string, string[]][] {
  const categories: [string, string[]][] = [];
  const keys = Object.keys(vocabulary) as (keyof TaskVocabulary)[];
  for (const key of keys) {
    if (key === 'high_scoring_words') continue;
    const value = vocabulary[key];
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      categories.push([key, value as string[]]);
    }
  }
  return categories;
}

export default function VocabularySection() {
  const [activeTask, setActiveTask] = useState<'task1' | 'task2'>('task1');

  const vocabulary = activeTask === 'task1' ? task1Vocabulary : task2Vocabulary;
  const categories = getCategories(vocabulary);

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTask('task1')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTask === 'task1'
              ? 'bg-celpip-lightblue text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Task 1 - Email
        </button>
        <button
          onClick={() => setActiveTask('task2')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTask === 'task2'
              ? 'bg-celpip-lightblue text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Task 2 - Survey
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3 mb-8">
        {categories.map(([key, phrases]) => (
          <CategoryCard key={key} category={key} phrases={phrases} />
        ))}
      </div>

      {/* High-Scoring Words */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        High-Scoring Words
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vocabulary.high_scoring_words.map((item) => (
          <div
            key={item.word}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <p className="font-bold text-celpip-lightblue dark:text-celpip-accent">
              {item.word}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.meaning}
            </p>
            <p className="text-sm italic text-gray-500 dark:text-gray-500 mt-1">
              &ldquo;{item.example}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
