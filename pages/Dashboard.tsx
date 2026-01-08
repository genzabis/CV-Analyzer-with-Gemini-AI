
import React, { useState } from 'react';
import { analyzeResumeWithAI } from '../services/geminiService';
import { calculateMatchScores } from '../services/matchingService';
import { saveAnalysis } from '../services/dbService';
import { ResumeAnalysis } from '../types';

interface DashboardProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Silakan upload atau tempel teks CV Anda.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Call Gemini AI API
      const aiResponse = await analyzeResumeWithAI(resumeText);
      
      // 2. Business Logic: Matching Score
      const matchScores = calculateMatchScores(aiResponse.skills);

      // 3. Prepare full data
      const analysis: ResumeAnalysis = {
        id: crypto.randomUUID(),
        userId: 'current-user', // Simulated
        fileName: fileName || 'Pasted Text Resume',
        uploadedAt: new Date().toISOString(),
        extractedSkills: aiResponse.skills,
        summary: aiResponse.summary,
        suggestedRoles: aiResponse.suggested_roles,
        matchScores
      };

      // 4. Save to Database (LocalStorage)
      saveAnalysis(analysis);

      // 5. Success
      onAnalysisComplete(analysis);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Analyze Your Resume</h2>
            <p className="text-slate-500">Get AI-powered insights, skill extraction, and job match scoring in seconds.</p>
          </div>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors hover:border-indigo-300">
              <input 
                type="file" 
                id="resumeFile" 
                className="hidden" 
                onChange={handleFileUpload} 
                accept=".txt,.md,.doc,.pdf" // Note: Basic text reader used for simplicity
              />
              <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="text-slate-900 font-medium">{fileName || "Click to upload Resume (TXT/MD)"}</span>
                <span className="text-slate-400 text-sm mt-1">Or paste your CV text below</span>
              </label>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 italic">OR PASTE TEXT</span>
              </div>
            </div>

            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !resumeText}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isLoading || !resumeText 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Smart Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
          <div className="text-indigo-600 font-bold text-xl mb-1">100%</div>
          <div className="text-slate-500 text-sm">AI Accuracy</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
          <div className="text-indigo-600 font-bold text-xl mb-1">JSON</div>
          <div className="text-slate-500 text-sm">Structured Outputs</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
          <div className="text-indigo-600 font-bold text-xl mb-1">&lt; 5s</div>
          <div className="text-slate-500 text-sm">Analysis Speed</div>
        </div>
      </div>
    </div>
  );
};
