export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export type WordCountStatus = 'low' | 'good' | 'high';

export function getWordCountStatus(
  count: number,
  taskType: 'task1' | 'task2'
): WordCountStatus {
  const range = getRecommendedRange(taskType);
  if (count < range.min) return 'low';
  if (count > range.max) return 'high';
  return 'good';
}

export function getRecommendedRange(_taskType: 'task1' | 'task2'): {
  min: number;
  max: number;
} {
  // Both task types have the same recommended word count range per CELPIP test requirements
  return { min: 150, max: 200 };
}
