
import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { AnalysisView } from './pages/AnalysisView';
import { HistoryPage } from './pages/HistoryPage';
import { ResumeAnalysis } from './types';
import { getHistory } from './services/dbService';

type Page = 'dashboard' | 'history' | 'result';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalysisComplete = (analysis: ResumeAnalysis) => {
    setHistory(prev => [analysis, ...prev]);
    setSelectedAnalysis(analysis);
    setCurrentPage('result');
  };

  const viewHistoryItem = (analysis: ResumeAnalysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage('result');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
      case 'history':
        return <HistoryPage history={history} onViewItem={viewHistoryItem} />;
      case 'result':
        return selectedAnalysis ? 
          <AnalysisView analysis={selectedAnalysis} onBack={() => setCurrentPage('dashboard')} /> : 
          <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
      default:
        return <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Smart Resume Analyzer</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Analyzer
              </button>
              <button 
                onClick={() => setCurrentPage('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      <footer className="border-t border-slate-200 mt-auto py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Smart Resume Analyzer AI. Professional Tool for HR.
      </footer>
    </div>
  );
};

export default App;
