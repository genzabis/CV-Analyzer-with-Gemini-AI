import React, { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { AnalysisView } from "./pages/AnalysisView";
import { HistoryPage } from "./pages/HistoryPage";
import { ResumeAnalysis } from "./types";
import { getHistory } from "./services/dbService";

type Page = "dashboard" | "history" | "result";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalysisComplete = (analysis: ResumeAnalysis) => {
    setHistory((prev) => [analysis, ...prev]);
    setSelectedAnalysis(analysis);
    setCurrentPage("result");
  };

  const viewHistoryItem = (analysis: ResumeAnalysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage("result");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
      case "history":
        return <HistoryPage history={history} onViewItem={viewHistoryItem} />;
      case "result":
        return selectedAnalysis ? (
          <AnalysisView
            analysis={selectedAnalysis}
            onBack={() => setCurrentPage("dashboard")}
          />
        ) : (
          <Dashboard onAnalysisComplete={handleAnalysisComplete} />
        );
      default:
        return <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Analisis CV";
      case "history":
        return "Riwayat Analisis";
      case "result":
        return "Hasil Analisis";
      default:
        return "Analisis CV";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CR</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                    CareerResume
                  </h1>
                  <p className="text-xs text-gray-500">Analisis Profesional</p>
                </div>
              </div>

              {/* Page Title - Desktop */}
              <div className="hidden lg:block ml-6 pl-6 border-l border-gray-200">
                <h2 className="text-sm font-medium text-gray-900">
                  {getPageTitle()}
                </h2>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === "dashboard"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Analisis Baru
              </button>
              <button
                onClick={() => setCurrentPage("history")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === "history"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Riwayat
              </button>
            </div>
          </div>

          {/* Page Title - Mobile */}
          <div className="lg:hidden py-3 border-t border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CR</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  CareerResume Analytics
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tools analisis CV untuk profesional
              </p>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                Syarat Layanan
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-700">
                Kontak
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CareerResume Analytics. Semua
              hak dilindungi.
              <span className="block mt-1 text-gray-300">
                Alat untuk pengembangan karir profesional.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
