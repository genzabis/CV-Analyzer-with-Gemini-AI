
import React from 'react';
import { ResumeAnalysis } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface AnalysisViewProps {
  analysis: ResumeAnalysis;
  onBack: () => void;
}

const COLORS = ['#6366f1', '#e2e8f0'];

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onBack }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <div className="text-slate-400 text-sm">
          Analyzed on: {new Date(analysis.uploadedAt).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Professional Summary</h3>
            <p className="text-slate-600 leading-relaxed italic">
              "{analysis.summary}"
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.extractedSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Recommended Job Matches</h3>
            <div className="space-y-4">
              {analysis.matchScores.map((match) => (
                <div key={match.jobId} className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">{match.jobTitle}</h4>
                      <p className="text-slate-500 text-xs">Matching required industry standards</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-white font-bold ${match.score > 70 ? 'bg-green-500' : match.score > 40 ? 'bg-orange-500' : 'bg-red-500'}`}>
                      {match.score}%
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${match.score > 70 ? 'bg-green-500' : match.score > 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${match.score}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Matched Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.length > 0 ? match.matchedSkills.map((s, i) => (
                          <span key={i} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{s}</span>
                        )) : <span className="text-xs text-slate-400 italic">None</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Missing Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.length > 0 ? match.missingSkills.map((s, i) => (
                          <span key={i} className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{s}</span>
                        )) : <span className="text-xs text-slate-400 italic">Fully Qualified!</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Quick Stats */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Top Match Score</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Match', value: analysis.matchScores[0]?.score || 0 },
                      { name: 'Remaining', value: 100 - (analysis.matchScores[0]?.score || 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={analysis.matchScores[0]?.score > 70 ? '#10b981' : '#6366f1'} />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-[-8rem] mb-4">
                <span className="text-4xl font-black text-slate-900">{analysis.matchScores[0]?.score || 0}%</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-16 font-medium">Best Fit: {analysis.matchScores[0]?.jobTitle}</p>
          </div>

          <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 10-2 0h-1a1 1 0 100 2h1a1 1 0 102 0zm-7 5a1 1 0 10-2 0v1a1 1 0 102 0v-1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM5 10a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zM8 16a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              </svg>
              AI Roles Suggested
            </h3>
            <ul className="space-y-2">
              {analysis.suggestedRoles.map((role, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-white/10 p-2 rounded-lg text-sm">
                  <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                  {role}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-indigo-100">
                AI analyzed 20+ career paths to find these suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
