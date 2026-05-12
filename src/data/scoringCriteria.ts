/**
 * Official CELPIP Writing Scoring Criteria
 * Based on the CELPIP Score Comparison Chart level descriptors.
 * Levels: M (covers 0-2), 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
 * Categories: Content/Coherence, Vocabulary, Readability, Task Fulfillment
 */

export interface ScoringLevel {
  level: string;
  numericRange: [number, number];
  description: string;
  contentCoherence: string;
  vocabulary: string;
  readability: string;
  taskFulfillment: string;
}

export const scoringLevels: ScoringLevel[] = [
  {
    level: 'M',
    numericRange: [0, 2],
    description: 'Limited ability in contexts related to immediate needs',
    contentCoherence:
      'Write very short, simple phrases',
    vocabulary:
      'Write the alphabet and numbers. Use very common words',
    readability:
      'Rarely use correct grammar',
    taskFulfillment:
      'Write some very simple information about me. When: I write for or to a familiar person',
  },
  {
    level: '3',
    numericRange: [3, 3],
    description: 'Some proficiency in limited contexts of personal relevance',
    contentCoherence:
      'Write short, simple sentences',
    vocabulary:
      'Use very common words',
    readability:
      'Sometimes use correct grammar. Use capital letters and some punctuation',
    taskFulfillment:
      'Write some information about me. When: I write for or to a familiar person',
  },
  {
    level: '4',
    numericRange: [4, 4],
    description: 'Adequate proficiency for daily life activities',
    contentCoherence:
      'Write simple sentences and short, simple paragraphs. Communicate personal information',
    vocabulary:
      'Use common words',
    readability:
      'Write with some control of simple grammar. Use capital letters and simple punctuation',
    taskFulfillment:
      'Use some common phrases that are appropriate to the situation. Convey some information about very familiar topics. When: I write for or to a familiar person',
  },
  {
    level: '5',
    numericRange: [5, 5],
    description: 'Acquiring proficiency in workplace and community contexts',
    contentCoherence:
      'Write short, simple to moderately complex texts. Express a main idea and some related ideas',
    vocabulary:
      'Use common words and phrases',
    readability:
      'Connect two or more related ideas. Write with good control of simple grammar. Write with adequate control of spelling and punctuation',
    taskFulfillment:
      'Use common phrases that are appropriate to the situation. Convey some information about familiar topics. When: I write for or to familiar people',
  },
  {
    level: '6',
    numericRange: [6, 6],
    description: 'Developing proficiency in workplace and community contexts',
    contentCoherence:
      'Write short, coherent texts. Express a main idea with some supporting details',
    vocabulary:
      'Use common words and phrases',
    readability:
      'Organize related ideas into paragraphs. Write with good control of simple grammar. Write with adequate control of spelling and punctuation',
    taskFulfillment:
      'Present information using a tone and style that are sometimes appropriate to the situation. Convey some factual information about a topic. When: I write for or to a familiar or clearly defined audience',
  },
  {
    level: '7',
    numericRange: [7, 7],
    description: 'Adequate proficiency in workplace and community contexts',
    contentCoherence:
      'Write short, moderately complex, factual texts. Express a main idea with supporting details',
    vocabulary:
      'Use common and some context-specific words to communicate meaning',
    readability:
      'Organize related ideas into paragraphs. Write with adequate control of complex grammatical structures. Write with good control of simple grammar, spelling, and punctuation',
    taskFulfillment:
      'Present information using a tone and style that follows most common writing conventions. Convey factual information about a topic. When: I write for or to a familiar or clearly defined audience',
  },
  {
    level: '8',
    numericRange: [8, 8],
    description: 'Good proficiency in workplace and community contexts',
    contentCoherence:
      'Write short, moderately complex texts. Develop a main idea with supporting details',
    vocabulary:
      'Use common or context-specific words to communicate meaning',
    readability:
      'Write well-organized paragraphs. Write with good control of complex grammatical structures, spelling, and punctuation',
    taskFulfillment:
      'Present information using a tone and style that follows common writing conventions. Convey and support my main ideas about a topic. When: I write for or to a familiar or clearly defined audience',
  },
  {
    level: '9',
    numericRange: [9, 9],
    description: 'Effective proficiency in workplace and community contexts',
    contentCoherence:
      'Write short formal and informal texts of some complexity. Support key ideas with relevant facts, descriptions, details, or quotations',
    vocabulary:
      'Choose words and phrases to provide accurate details, descriptions, and comparisons',
    readability:
      'Write well-organized paragraphs. Write with control of a range of complex and diverse grammatical structures. Write with good control of spelling and punctuation',
    taskFulfillment:
      'Present information using a tone and style that follows some formal and most informal writing conventions. Convey my intended meaning. When: I write for a defined audience and the situation is formal or informal',
  },
  {
    level: '10',
    numericRange: [10, 10],
    description: 'Highly effective proficiency in workplace and community contexts',
    contentCoherence:
      'Write short formal and informal texts of some complexity. Support key ideas with a range of facts, descriptions, details, or quotations',
    vocabulary:
      'Choose words and phrases to provide precise details, descriptions, and comparisons',
    readability:
      'Connect ideas and make transitions within and between paragraphs. Write with good control of a range of complex and diverse grammatical structures',
    taskFulfillment:
      'Present information using a tone and style that follows most formal and informal writing conventions. Convey my intended meaning. When: I write for a defined audience and the situation is formal or informal',
  },
  {
    level: '11',
    numericRange: [11, 11],
    description: 'Advanced proficiency in workplace and community contexts',
    contentCoherence:
      'Write formal and informal texts for a range of purposes. Develop ideas with relevant facts, descriptions, details, or quotations',
    vocabulary:
      'Choose specialized, formal, and common words to express my meaning',
    readability:
      'Connect ideas and make transitions within and between paragraphs. Write with good control of a broad range of complex and diverse grammatical structures',
    taskFulfillment:
      'Present information using a tone and style usually appropriate to the situation. Accurately communicate my ideas. When: I write for an undefined audience and the situation is formal or informal',
  },
  {
    level: '12',
    numericRange: [12, 12],
    description: 'Advanced proficiency in workplace and community contexts',
    contentCoherence:
      'Write complex formal and informal texts for a full range of purposes, intentions, and objectives. Develop ideas with relevant and sufficient facts, extended descriptions, details, or quotations',
    vocabulary:
      'Choose specialized, formal, and common words to express my precise meaning',
    readability:
      'Connect ideas and make transitions within and between paragraphs. Write with very good control of a very broad range of complex and diverse grammatical structures',
    taskFulfillment:
      'Present information using a tone and style appropriate to the situation. Precisely communicate my ideas. When: I write for a diverse and undefined audience and the situation is formal or informal',
  },
];

/**
 * Generates a formatted string of the scoring rubric for use in AI prompts.
 * Includes all levels and all 4 criteria descriptors.
 */
export function generateScoringRubricText(): string {
  let rubric = 'CELPIP WRITING SCORING RUBRIC\n';
  rubric += '=============================\n\n';
  rubric += 'The CELPIP Writing test is scored on 4 criteria: Content/Coherence, Vocabulary, Readability, and Task Fulfillment.\n';
  rubric += 'Scores range from M (0-2) to 12. Below are the "At this level, I can:" descriptors for each level and criterion.\n\n';

  for (const level of scoringLevels) {
    const levelLabel = level.level === 'M' ? `Level M (0-2)` : `Level ${level.level}`;
    rubric += `--- ${levelLabel}: ${level.description} ---\n`;
    rubric += `  Content/Coherence: ${level.contentCoherence}\n`;
    rubric += `  Vocabulary: ${level.vocabulary}\n`;
    rubric += `  Readability: ${level.readability}\n`;
    rubric += `  Task Fulfillment: ${level.taskFulfillment}\n`;
    rubric += '\n';
  }

  return rubric;
}
