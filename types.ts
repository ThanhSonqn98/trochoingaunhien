
export enum GameType {
  RUNG_CHUONG_VANG = 'RUNG_CHUONG_VANG',
  MEMORY = 'MEMORY',
  MATCHING = 'MATCHING',
  BUBBLE_POP = 'BUBBLE_POP',
  WHATS_IN_BOX = 'WHATS_IN_BOX',
  GUESS_IMAGE = 'GUESS_IMAGE'
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface Pair {
  id: string;
  left: string;
  right: string;
}

export interface BubbleItem {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface GameConfig {
  type: GameType;
  title: string;
  description: string;
  items: any[];
  reason: string;
}

export interface AppSettings {
  students: string[];
  timer: number;
}
