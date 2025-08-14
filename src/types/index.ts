export type Language = 'en' | 'es';

export type LeadershipColor = 'red' | 'green' | 'blue' | 'yellow';

export interface Question {
  id: number;
  color: LeadershipColor;
  en: string;
  es: string;
}

export interface LeadershipStyle {
  color: LeadershipColor;
  en: {
    title: string;
    description: string;
  };
  es: {
    title: string;
    description: string;
  };
}

export interface UserResponse {
  questionId: number;
  score: number;
}

export interface AssessmentResults {
  red: number;
  green: number;
  blue: number;
  yellow: number;
}

export interface AppState {
  language: Language;
  userName: string;
  responses: UserResponse[];
  isCompleted: boolean;
}

export interface QuestionHeaderText {
  en: string;
  es: string;
}