import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Settings, Task1Question, Task2Question, AIFeedback } from '../types';
import { generateScoringRubricText } from '../data/scoringCriteria';

export async function getAIFeedback(
  settings: Settings,
  question: Task1Question | Task2Question,
  writingText: string
): Promise<AIFeedback> {
  const genAI = new GoogleGenerativeAI(settings.apiKey);
  const model = genAI.getGenerativeModel({
    model: settings.model,
    generationConfig: {
      temperature: settings.temperature,
      maxOutputTokens: Math.max(settings.maxTokens, 4096),
    },
  });

  const taskDescription =
    question.type === 'task1'
      ? `Task 1 - Email Writing\nSituation: ${(question as Task1Question).situation}\nTone: ${(question as Task1Question).tone}\nPoints to address: ${(question as Task1Question).bulletPoints.join(', ')}`
      : `Task 2 - Survey Response\nTopic: ${(question as Task2Question).topic}\nInstructions: ${(question as Task2Question).instructions}\nViewpoints to consider: ${(question as Task2Question).viewpoints.join(', ')}`;

  const scoringRubric = generateScoringRubricText();

  const prompt = `${settings.systemPrompt || 'You are an experienced CELPIP writing examiner. Evaluate the following writing response using the official CELPIP scoring rubric provided below.'}

${scoringRubric}

EVALUATION INSTRUCTIONS - STRICT SCORING CALIBRATION:

CRITICAL SCORING PRINCIPLES:
1. NEVER inflate scores to make the student feel good. Your job is to provide honest, accurate assessment.
2. Most intermediate English learners score between 5-7. A score of 8+ requires genuinely strong writing.
3. A score of 9+ requires near-native fluency with sophisticated vocabulary and complex grammar used accurately.
4. A score of 10+ is rare and requires exceptional writing that would impress a native English speaker.
5. A score of 11-12 requires virtually flawless writing with precise, varied vocabulary and perfect control of complex structures.

CALIBRATION ANCHORS (use these to calibrate your scoring):
- Level 5: Simple sentences, basic vocabulary, some errors impede meaning. Writing partially addresses the task.
- Level 6: Short coherent texts, common vocabulary, good simple grammar but struggles with complex structures.
- Level 7: Moderately complex texts, some context-specific vocabulary, adequate complex grammar. THIS IS THE THRESHOLD FOR MANY PROGRAMS.
- Level 8: Well-organized paragraphs, good complex grammar control, appropriate tone. This requires noticeably better organization and vocabulary than Level 7.
- Level 9: Formal/informal register control, precise vocabulary, diverse grammar structures with good control. Clearly above average writing.
- Level 10: Sophisticated transitions, precise word choice for comparisons, excellent grammar control. Writing that stands out.
- Level 11-12: Near-native precision, specialized vocabulary used naturally, virtually no errors, appropriate tone for any audience.

SCORING PROCESS:
- For each of the 4 criteria (Content/Coherence, Vocabulary, Readability, Task Fulfillment), compare the student's writing against the level descriptors in the rubric above.
- Determine which level best matches the student's performance for EACH criterion independently.
- A score of M (use 2) means levels 0-2. Otherwise use the exact level number (3-12).
- Be precise: identify which level descriptors the writing FULLY matches and which it does NOT yet achieve. Only assign a level if the writing consistently demonstrates ALL abilities described at that level.
- If the writing shows characteristics of two adjacent levels, assign the LOWER level unless the higher-level characteristics are consistent throughout.
- The overall score should reflect the average performance across all 4 criteria, rounded to the nearest integer.
- Provide specific, actionable feedback for each criterion. Tell the student exactly what they need to improve to reach the next level, with concrete examples from their writing.

COMMON SCORING MISTAKES TO AVOID:
- Do NOT give 8+ just because the writing is "okay" or "readable." Level 8 requires genuinely good complex grammar control and well-developed ideas.
- Do NOT give 9+ for writing that has repetitive vocabulary or simple sentence structures, even if grammar is mostly correct.
- Do NOT confuse length with quality. A long response with repetitive ideas and basic vocabulary is still Level 5-6.
- Do NOT ignore errors in articles, prepositions, or verb tenses when scoring Readability. These matter.
- DO acknowledge genuine strengths while being honest about weaknesses.

Task Details:
${taskDescription}

Prompt: ${question.prompt}

Student's Response:
${writingText}

Respond ONLY with valid JSON in the following format (no markdown, no explanation outside JSON):
{
  "overallScore": <number 1-12>,
  "categories": [
    {"name": "Content/Coherence", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Vocabulary", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Readability", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Task Fulfillment", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"}
  ],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "overallFeedback": "<A 2-3 sentence narrative summary of the student's performance, highlighting their key strengths and the most important areas for improvement>",
  "errorHighlights": [
    {"original": "<exact erroneous text from student's writing>", "correction": "<corrected version>", "type": "<one of: grammar, vocabulary, coherence, spelling, punctuation, style>", "explanation": "<brief reason for the correction>"}
  ],
  "polishedVersion": "<A full rewrite of the student's response demonstrating level 10+ writing. Wrap key improvements in **bold** markdown to highlight what was changed and why it is better.>"
}`;

  // Retry up to 3 times for transient server errors (500, 503)
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]) as {
        overallScore: number;
        categories: { name: string; score: number; feedback: string }[];
        suggestions: string[];
        overallFeedback?: string;
        errorHighlights?: { original: string; correction: string; type: string; explanation: string }[];
        polishedVersion?: string;
      };

      // Validate overallScore
      if (typeof parsed.overallScore !== 'number' || parsed.overallScore < 1 || parsed.overallScore > 12) {
        throw new Error(
          `Invalid overallScore: expected a number between 1 and 12, got ${JSON.stringify(parsed.overallScore)}`
        );
      }

      // Validate categories
      if (!Array.isArray(parsed.categories) || parsed.categories.length !== 4) {
        throw new Error('Invalid categories: expected an array of exactly 4 categories');
      }

      const expectedCategories = ['Content/Coherence', 'Vocabulary', 'Readability', 'Task Fulfillment'];
      for (const category of parsed.categories) {
        if (typeof category.name !== 'string' || !expectedCategories.includes(category.name)) {
          throw new Error(
            `Invalid category name: expected one of ${expectedCategories.join(', ')}, got ${JSON.stringify(category.name)}`
          );
        }
        if (typeof category.score !== 'number' || category.score < 1 || category.score > 12) {
          throw new Error(
            `Invalid category "${category.name}": "score" must be a number between 1 and 12, got ${JSON.stringify(category.score)}`
          );
        }
        if (typeof category.feedback !== 'string' || category.feedback.length === 0) {
          throw new Error(
            `Invalid category "${category.name}": "feedback" must be a non-empty string`
          );
        }
      }

      return {
        overallScore: parsed.overallScore,
        categories: parsed.categories,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        rawResponse: text,
        overallFeedback: typeof parsed.overallFeedback === 'string' ? parsed.overallFeedback : '',
        errorHighlights: Array.isArray(parsed.errorHighlights) ? parsed.errorHighlights : [],
        polishedVersion: typeof parsed.polishedVersion === 'string' ? parsed.polishedVersion : '',
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Only retry on server errors (500, 503) or network issues
      const errorMsg = lastError.message.toLowerCase();
      const isRetryable = errorMsg.includes('500') || errorMsg.includes('503') ||
        errorMsg.includes('internal') || errorMsg.includes('unavailable') ||
        errorMsg.includes('overloaded');

      if (!isRetryable || attempt === MAX_RETRIES) {
        break;
      }

      // Wait before retrying (exponential backoff: 1s, 2s)
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  const errorMessage = lastError?.message || 'Unknown error';
  throw new Error(`Failed to get AI feedback: ${errorMessage}`);
}
