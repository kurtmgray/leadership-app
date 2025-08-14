import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, Language } from '../types';
import { saveToStorage, getFromStorage } from '../utils/storage';

interface AssessmentContextType {
  state: AppState;
  setLanguage: (language: Language) => void;
  setUserName: (name: string) => void;
  setResponse: (questionId: number, score: number) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}

const initialState: AppState = {
  language: 'es',
  userName: '',
  responses: [],
  isCompleted: false,
};

type Action =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'SET_RESPONSE'; payload: { questionId: number; score: number } }
  | { type: 'COMPLETE_ASSESSMENT' }
  | { type: 'RESET_ASSESSMENT' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<AppState> };

const assessmentReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    case 'SET_RESPONSE':
      const existingResponses = state.responses.filter(r => r.questionId !== action.payload.questionId);
      return {
        ...state,
        responses: [...existingResponses, { questionId: action.payload.questionId, score: action.payload.score }]
      };
    case 'COMPLETE_ASSESSMENT':
      return { ...state, isCompleted: true };
    case 'RESET_ASSESSMENT':
      return initialState;
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  useEffect(() => {
    const storedData = getFromStorage();
    if (Object.keys(storedData).length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedData });
    }
  }, []);

  useEffect(() => {
    if (state.language || state.userName || state.responses.length > 0) {
      saveToStorage(state);
    }
  }, [state]);

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const setUserName = (name: string) => {
    dispatch({ type: 'SET_USER_NAME', payload: name });
  };

  const setResponse = (questionId: number, score: number) => {
    dispatch({ type: 'SET_RESPONSE', payload: { questionId, score } });
  };


  const completeAssessment = () => {
    dispatch({ type: 'COMPLETE_ASSESSMENT' });
  };

  const resetAssessment = () => {
    dispatch({ type: 'RESET_ASSESSMENT' });
  };

  return (
    <AssessmentContext.Provider value={{
      state,
      setLanguage,
      setUserName,
      setResponse,
      completeAssessment,
      resetAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = (): AssessmentContextType => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};