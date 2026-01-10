
import { ResumeAnalysis } from "../types";

const STORAGE_KEY = 'smart_resume_history';

export const saveAnalysis = (analysis: ResumeAnalysis): void => {
  const history = getHistory();
  history.unshift(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): ResumeAnalysis[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const deleteAnalysis = (id: string): void => {
  const history = getHistory().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getAnalysisById = (id: string): ResumeAnalysis | undefined => {
  return getHistory().find(a => a.id === id);
};
