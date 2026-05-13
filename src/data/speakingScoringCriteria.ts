import scoringData from '../../Speaking_Scoring.json';

interface SpeakingLevelDescriptors {
  content_coherence: string[];
  vocabulary: string[];
  listenability: string[];
  task_fulfillment: string[];
  when: string[];
}

interface SpeakingLevel {
  level: number;
  name: string;
  descriptors: SpeakingLevelDescriptors;
}

const speakingLevels: SpeakingLevel[] = scoringData.speaking_levels as SpeakingLevel[];

/**
 * Generates a formatted string of the speaking scoring rubric for use in AI prompts.
 * Includes all levels and all 4 criteria descriptors.
 */
export function generateSpeakingScoringRubricText(): string {
  let rubric = 'CELPIP SPEAKING SCORING RUBRIC\n';
  rubric += '===============================\n\n';
  rubric += 'The CELPIP Speaking test is scored on 4 criteria: Content/Coherence, Vocabulary, Listenability, and Task Fulfillment.\n';
  rubric += 'Scores range from 0 to 12. Below are the "At this level, I can:" descriptors for each level and criterion.\n\n';

  for (const level of speakingLevels) {
    const levelLabel = level.level <= 2 ? `Level 0-2 (M)` : `Level ${level.level}`;
    rubric += `--- ${levelLabel}: ${level.name} ---\n`;
    rubric += `  Content/Coherence: ${level.descriptors.content_coherence.join('; ')}\n`;
    rubric += `  Vocabulary: ${level.descriptors.vocabulary.join('; ')}\n`;
    rubric += `  Listenability: ${level.descriptors.listenability.join('; ')}\n`;
    rubric += `  Task Fulfillment: ${level.descriptors.task_fulfillment.join('; ')}\n`;
    rubric += `  When: ${level.descriptors.when.join('; ')}\n`;
    rubric += '\n';
  }

  return rubric;
}
