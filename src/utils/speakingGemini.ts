import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Settings, SpeakingFeedback } from '../types';
import { generateSpeakingScoringRubricText } from '../data/speakingScoringCriteria';

export async function getSpeakingFeedback(
  settings: Settings,
  taskName: string,
  taskNumber: number,
  questionText: string,
  audioBase64: string,
  mimeType: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<SpeakingFeedback> {
  if (!settings.apiKey) {
    throw new Error('API key not configured. Please set your Google AI API key in Settings.');
  }

  const genAI = new GoogleGenerativeAI(settings.apiKey);

  // Fallback model chain: if primary model is overloaded, try alternatives
  const primaryModel = settings.speakingModel || 'gemini-2.5-flash';
  const fallbackModels = [
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite',
  ].filter((m) => m !== primaryModel);
  const modelChain = [primaryModel, ...fallbackModels];

  const scoringRubric = generateSpeakingScoringRubricText();

  const prompt = `You are an experienced CELPIP speaking examiner. Listen to the following audio recording and evaluate it using the official CELPIP speaking scoring rubric provided below.

${scoringRubric}

EVALUATION INSTRUCTIONS - STRICT SCORING CALIBRATION:

CRITICAL SCORING PRINCIPLES:
1. NEVER inflate scores to make the student feel good. Your job is to provide honest, accurate assessment.
2. Most intermediate English learners score between 5-7. A score of 8+ requires genuinely strong speaking ability.
3. A score of 9+ requires near-native fluency with sophisticated vocabulary and complex grammar used accurately.
4. A score of 10+ is rare and requires exceptional speaking that would impress a native English speaker.
5. A score of 11-12 requires virtually flawless speaking with precise, varied vocabulary and perfect control of complex structures.

CALIBRATION ANCHORS (use these to calibrate your scoring):
- Level 5: Simple sentences, basic vocabulary, some errors impede meaning. Speech partially addresses the task.
- Level 6: Short coherent responses, common vocabulary, good simple grammar but struggles with complex structures.
- Level 7: Moderately complex responses, some context-specific vocabulary, adequate complex grammar. THIS IS THE THRESHOLD FOR MANY PROGRAMS.
- Level 8: Well-organized responses, good complex grammar control, appropriate tone. This requires noticeably better organization and vocabulary than Level 7.
- Level 9: Formal/informal register control, precise vocabulary, diverse grammar structures with good control. Clearly above average speaking.
- Level 10: Sophisticated transitions, precise word choice, excellent grammar control. Speaking that stands out.
- Level 11-12: Near-native precision, specialized vocabulary used naturally, virtually no errors, appropriate tone for any audience.

SCORING PROCESS:
1. First, TRANSCRIBE the audio recording accurately, including any hesitations, repetitions, or self-corrections.
2. For each of the 4 criteria (Content/Coherence, Vocabulary, Listenability, Task Fulfillment), compare the speaker's performance against the level descriptors in the rubric above.
3. Determine which level best matches the speaker's performance for EACH criterion independently.
4. A score of 0-2 (use 2) means levels 0-2. Otherwise use the exact level number (3-12).
5. Be precise: identify which level descriptors the speech FULLY matches and which it does NOT yet achieve. Only assign a level if the speech consistently demonstrates ALL abilities described at that level.
6. If the speech shows characteristics of two adjacent levels, assign the LOWER level unless the higher-level characteristics are consistent throughout.
7. The overall score should reflect the average performance across all 4 criteria, rounded to the nearest integer.
8. Provide specific, actionable feedback for each criterion.

COMMON SCORING MISTAKES TO AVOID:
- Do NOT give 8+ just because the speech is "understandable." Level 8 requires genuinely good complex grammar control and well-developed ideas.
- Do NOT give 9+ for speech that has repetitive vocabulary or simple sentence structures, even if grammar is mostly correct.
- Do NOT confuse fluency with quality. A fluent response with repetitive ideas and basic vocabulary is still Level 5-6.
- Do NOT ignore pronunciation issues, inappropriate pauses, or self-corrections when scoring Listenability.
- DO acknowledge genuine strengths while being honest about weaknesses.

Task Details:
Task ${taskNumber} - ${taskName}
Question: ${questionText}
${imageBase64 ? '\nThe following image was shown to the speaker and they were asked to describe or make predictions based on it. For Task Fulfillment scoring, evaluate how accurately and completely the speaker describes or references elements visible in the image (people, actions, objects, settings, spatial relationships).' : ''}

Please listen to the audio and respond ONLY with valid JSON in the following format (no markdown, no explanation outside JSON):
{
  "transcript": "<accurate transcription of the audio recording>",
  "overallScore": <number 1-12>,
  "categories": [
    {"name": "Content/Coherence", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Vocabulary", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Listenability", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"},
    {"name": "Task Fulfillment", "score": <number 1-12>, "feedback": "<specific feedback referencing level descriptors>"}
  ],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "overallFeedback": "<A 2-3 sentence narrative summary of the speaker's performance, highlighting their key strengths and the most important areas for improvement>",
  "errorHighlights": [
    {"original": "<exact erroneous text from transcript>", "correction": "<corrected version>", "type": "<one of: grammar, vocabulary, coherence, pronunciation, fluency, style>", "explanation": "<brief reason for the correction>"}
  ],
  "polishedVersion": "<A full ideal spoken response demonstrating level 10+ speaking. This should be what an ideal response to this question would sound like.>"
}`;

  // Try each model in the fallback chain, with retries per model
  let lastError: Error | null = null;

  for (const modelName of modelChain) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: Math.max(settings.maxTokens, 4096),
      },
    });

    const MAX_RETRIES = 2;
    let shouldTryNextModel = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts: any[] = [
          { text: prompt },
          { inlineData: { data: audioBase64, mimeType: mimeType } },
        ];
        if (imageBase64) {
          parts.push({ inlineData: { data: imageBase64, mimeType: imageMimeType || 'image/jpeg' } });
        }
        const result = await model.generateContent(parts);
        const response = result.response;
        const text = response.text();

        // Try multiple strategies to extract JSON from the response
        let jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
        let jsonStr = jsonMatch ? jsonMatch[1].trim() : null;
        if (!jsonStr) {
          jsonMatch = text.match(/```\s*([\s\S]*?)```/);
          jsonStr = jsonMatch ? jsonMatch[1].trim() : null;
        }
        if (!jsonStr) {
          jsonMatch = text.match(/\{[\s\S]*\}/);
          jsonStr = jsonMatch ? jsonMatch[0] : null;
        }
        if (!jsonStr) {
          // If no JSON found at all, include snippet of response for debugging
          const snippet = text.substring(0, 200).replace(/\n/g, ' ');
          throw new Error(`No JSON found in AI response. Model returned: "${snippet}..."`);
        }

        let parsed: {
          transcript: string;
          overallScore: number;
          categories: { name: string; score: number; feedback: string }[];
          suggestions: string[];
          overallFeedback?: string;
          errorHighlights?: { original: string; correction: string; type: string; explanation: string }[];
          polishedVersion?: string;
        };
        try {
          parsed = JSON.parse(jsonStr);
        } catch (parseError) {
          // Attempt to repair common JSON issues (unescaped control characters)
          let repaired = jsonStr;
          repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (ch) => {
            if (ch === '\n') return '\\n';
            if (ch === '\r') return '\\r';
            if (ch === '\t') return '\\t';
            return '';
          });
          try {
            parsed = JSON.parse(repaired);
          } catch {
            throw new Error(`Invalid JSON in AI response: ${(parseError as Error).message}`);
          }
        }

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

        const expectedCategories = ['Content/Coherence', 'Vocabulary', 'Listenability', 'Task Fulfillment'];
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

        // Validate transcript
        const transcript = typeof parsed.transcript === 'string' ? parsed.transcript : '';

        return {
          overallScore: parsed.overallScore,
          categories: parsed.categories,
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
          overallFeedback: typeof parsed.overallFeedback === 'string' ? parsed.overallFeedback : '',
          transcript: transcript,
          errorHighlights: Array.isArray(parsed.errorHighlights)
            ? parsed.errorHighlights.filter(
                (e) => typeof e.original === 'string' && e.original && typeof e.correction === 'string' && e.correction
              )
            : [],
          polishedVersion: typeof parsed.polishedVersion === 'string' ? parsed.polishedVersion : '',
          rawResponse: text,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        const errorMsg = lastError.message.toLowerCase();
        const isHighDemand =
          errorMsg.includes('503') ||
          errorMsg.includes('429') ||
          errorMsg.includes('overloaded') ||
          errorMsg.includes('high demand') ||
          errorMsg.includes('unavailable') ||
          errorMsg.includes('quota') ||
          errorMsg.includes('rate limit') ||
          errorMsg.includes('rate-limit') ||
          errorMsg.includes('no json found');
        const isRetryable =
          isHighDemand ||
          errorMsg.includes('500') ||
          errorMsg.includes('internal') ||
          errorMsg.includes('json');

        if (isHighDemand) {
          // Model is overloaded - try next model in chain
          shouldTryNextModel = true;
          break;
        }

        if (!isRetryable || attempt === MAX_RETRIES) {
          break;
        }

        // Wait before retrying same model (exponential backoff: 1s, 2s)
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }

    if (!shouldTryNextModel) {
      // Error was not a capacity issue, don't try other models
      break;
    }

    // Brief delay before trying next model
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const errorMessage = lastError?.message || 'Unknown error';
  throw new Error(`Failed to get speaking feedback: ${errorMessage}`);
}
