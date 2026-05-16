import { useState, useRef } from 'react';

interface SynonymResult {
  word: string;
  score: number;
}

export default function SynonymSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SynonymResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      const res = await fetch(
        `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch synonyms');
      }
      const data: SynonymResult[] = await res.json();
      setResults(data.slice(0, 10));
    } catch {
      setError('Could not fetch synonyms. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleCopy = async (word: string) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(null), 1500);
    } catch {
      // Fallback: silent fail if clipboard not available
    }
  };

  return (
    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 dark:text-gray-500 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search synonyms..."
          className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-celpip-accent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-3 py-1 text-sm font-medium bg-celpip-accent text-white rounded hover:bg-celpip-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {error && (
            <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
          )}
          {!error && results.length === 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              No synonyms found
            </span>
          )}
          {results.map((item) => (
            <button
              key={item.word}
              onClick={() => handleCopy(item.word)}
              title={`Click to copy "${item.word}"`}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors cursor-pointer"
            >
              {copiedWord === item.word ? 'Copied!' : item.word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
