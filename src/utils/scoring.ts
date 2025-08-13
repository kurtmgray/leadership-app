import type { UserResponse, AssessmentResults, LeadershipColor } from '../types';
import { questions } from '../data/questions';

export const calculateScores = (responses: UserResponse[]): AssessmentResults => {
  const scores: AssessmentResults = {
    red: 0,
    green: 0,
    blue: 0,
    yellow: 0
  };

  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question) {
      scores[question.color] += response.score;
    }
  });

  return scores;
};

export const getSortedResults = (scores: AssessmentResults): Array<{color: LeadershipColor, score: number}> => {
  return Object.entries(scores)
    .map(([color, score]) => ({ color: color as LeadershipColor, score }))
    .sort((a, b) => b.score - a.score);
};

export const isAssessmentComplete = (responses: UserResponse[]): boolean => {
  return responses.length === questions.length;
};