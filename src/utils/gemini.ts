import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Settings, Task1Question, Task2Question, AIFeedback } from '../types';

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
      maxOutputTokens: settings.maxTokens,
    },
  });

  const taskDescription =
    question.type === 'task1'
      ? `Task 1 - Email Writing\nSituation: ${(question as Task1Question).situation}\nTone: ${(question as Task1Question).tone}\nPoints to address: ${(question as Task1Question).bulletPoints.join(', ')}`
      : `Task 2 - Survey Response\nTopic: ${(question as Task2Question).topic}\nInstructions: ${(question as Task2Question).instructions}\nViewpoints to consider: ${(question as Task2Question).viewpoints.join(', ')}`;

  const prompt = `${settings.systemPrompt || 'You are a CELPIP writing examiner. Evaluate the following writing response.'}

Task Details:
${taskDescription}

Prompt: ${question.prompt}

Student's Response:
${writingText}

Please evaluate this CELPIP writing response and provide scores on a scale of 1-12 for each category. Respond ONLY with valid JSON in the following format:
{
  "overallScore": <number 1-12>,
  "categories": [
    {"name": "Task Response", "score": <number 1-12>, "feedback": "<specific feedback>"},
    {"name": "Coherence & Organization", "score": <number 1-12>, "feedback": "<specific feedback>"},
    {"name": "Vocabulary", "score": <number 1-12>, "feedback": "<specific feedback>"},
    {"name": "Grammar", "score": <number 1-12>, "feedback": "<specific feedback>"},
    {"name": "Spelling & Punctuation", "score": <number 1-12>, "feedback": "<specific feedback>"}
  ],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
}`;

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
    };

    return {
      overallScore: parsed.overallScore,
      categories: parsed.categories,
      suggestions: parsed.suggestions,
      rawResponse: text,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get AI feedback: ${errorMessage}`);
  }
}
