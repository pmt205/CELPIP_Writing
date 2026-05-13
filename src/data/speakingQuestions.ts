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

export function getRandomQuestion(taskNumber: number): string {
  const task = tasks.find((t) => t.task === taskNumber);
  if (!task || task.questions.length === 0) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * task.questions.length);
  return task.questions[randomIndex];
}

export { tasks as speakingQuestionBank };
