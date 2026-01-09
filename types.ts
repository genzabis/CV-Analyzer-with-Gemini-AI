
export interface ResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
  extractedSkills: string[];
  summary: string;
  suggestedRoles: string[];
  matchScores: JobMatch[];
}

export interface JobMatch {
  jobId: string;
  jobTitle: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface Job {
  id: string;
  title: string;
  requiredSkills: string[];
  description: string;
}

export interface AIAnalysisResponse {
  skills: string[];
  summary: string;
  suggested_roles: string[];
}
