import type { AppState, UserResponse } from '../types';

const STORAGE_KEY = 'leadership-assessment';

export const saveToStorage = (data: Partial<AppState>): void => {
  try {
    const existing = getFromStorage();
    const updated = { ...existing, ...data };
    const serialized = JSON.stringify(updated);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const getFromStorage = (): Partial<AppState> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    return parsed;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return {};
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export const saveResponse = (questionId: number, score: number): void => {
  const existing = getFromStorage();
  const responses = existing.responses || [];
  
  const updatedResponses = responses.filter((r: UserResponse) => r.questionId !== questionId);
  updatedResponses.push({ questionId, score });
  
  saveToStorage({ responses: updatedResponses });
};

export const getResponse = (questionId: number): number | null => {
  const existing = getFromStorage();
  const responses = existing.responses || [];
  const response = responses.find((r: UserResponse) => r.questionId === questionId);
  return response ? response.score : null;
};