import questionBank from '../../CELPIP_Speaking_Question_Bank.json';
import type { SpeakingTask } from '../types';

const tasks: SpeakingTask[] = questionBank.tasks as SpeakingTask[];

export interface SpeakingTaskInfo {
  task: number;
  name: string;
  prepTime: number;
  speakingTime: number;
}

export const speakingTasks: SpeakingTaskInfo[] = [
  { task: 1, name: 'Giving Advice', prepTime: 30, speakingTime: 90 },
  { task: 2, name: 'Talking About a Personal Experience', prepTime: 30, speakingTime: 60 },
  { task: 3, name: 'Describing a Scene', prepTime: 30, speakingTime: 60 },
  { task: 4, name: 'Making Predictions', prepTime: 30, speakingTime: 60 },
  { task: 5, name: 'Comparing and Persuading', prepTime: 60, speakingTime: 90 },
  { task: 6, name: 'Dealing With a Difficult Situation', prepTime: 60, speakingTime: 60 },
  { task: 7, name: 'Expressing Opinions', prepTime: 30, speakingTime: 90 },
  { task: 8, name: 'Describing an Unusual Situation', prepTime: 30, speakingTime: 60 },
];

export const sceneImages: string[] = [
  '/speaking-images/task3_scene_001.jpeg',
  '/speaking-images/task3_scene_002.jpeg',
  '/speaking-images/task3_scene_003.jpeg',
  '/speaking-images/task3_scene_004.jpeg',
  '/speaking-images/task3_scene_005.jpeg',
  '/speaking-images/task3_scene_006.jpeg',
  '/speaking-images/task3_scene_007.jpeg',
  '/speaking-images/task3_scene_008.jpeg',
  '/speaking-images/task3_scene_009.jpeg',
  '/speaking-images/task3_scene_010.jpeg',
  '/speaking-images/task3_scene_011.jpeg',
  '/speaking-images/task3_scene_012.jpeg',
  '/speaking-images/task3_scene_013.jpeg',
  '/speaking-images/task3_scene_014.jpeg',
  '/speaking-images/task3_scene_015.jpeg',
  '/speaking-images/task3_scene_016.jpeg',
  '/speaking-images/task3_scene_017.jpeg',
  '/speaking-images/task3_scene_018.jpeg',
  '/speaking-images/task3_scene_019.jpeg',
  '/speaking-images/task3_scene_020.jpeg',
  '/speaking-images/task3_scene_021.jpeg',
  '/speaking-images/task3_scene_022.jpeg',
  '/speaking-images/task3_scene_023.jpeg',
];

export const TASK3_QUESTION = 'Describe what is happening in the picture.';
export const TASK4_QUESTION = 'What do you think will happen next in this situation?';

export function getRandomImage(): string {
  return sceneImages[Math.floor(Math.random() * sceneImages.length)];
}

export function getRandomQuestion(taskNumber: number): string {
  if (taskNumber === 3) {
    return TASK3_QUESTION;
  }
  if (taskNumber === 4) {
    return TASK4_QUESTION;
  }
  const task = tasks.find((t) => t.task === taskNumber);
  if (!task || task.questions.length === 0) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * task.questions.length);
  const item = task.questions[randomIndex];
  return typeof item === 'string' ? item : item.question;
}

export function getTipsForQuestion(taskNumber: number, questionText: string): string[] {
  if (taskNumber === 3 || taskNumber === 4) return [];
  const task = tasks.find((t) => t.task === taskNumber);
  if (!task) return [];
  for (const item of task.questions) {
    if (typeof item !== 'string' && item.question === questionText) {
      return item.tips;
    }
  }
  return [];
}

export function getQuestionsForTask(taskNumber: number): string[] | null {
  if (taskNumber === 3 || taskNumber === 4) return null;
  const task = tasks.find((t) => t.task === taskNumber);
  if (!task) return [];
  return task.questions.map((item) => typeof item === 'string' ? item : item.question);
}

export function getAllImages(): string[] {
  return sceneImages;
}

export { tasks as speakingQuestionBank };
