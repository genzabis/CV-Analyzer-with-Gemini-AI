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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalysisComplete = (analysis: ResumeAnalysis) => {
    setHistory((prev) => [analysis, ...prev]);
    setSelectedAnalysis(analysis);
    setCurrentPage("result");
    setIsMenuOpen(false);
  };

  const viewHistoryItem = (analysis: ResumeAnalysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage("result");
    setIsMenuOpen(false);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
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
            onBack={() => navigateTo("dashboard")}
          />
        ) : (
          <Dashboard onAnalysisComplete={handleAnalysisComplete} />
        );
      default:
        return <Dashboard onAnalysisComplete={handleAnalysisComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">CR</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                  CareerResume
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Analisis Profesional
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => navigateTo("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === "dashboard"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Analisis Baru
              </button>
              <button
                onClick={() => navigateTo("history")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === "history"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Riwayat
              </button>
            </nav>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 border-t border-gray-100 animate-fadeIn">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => navigateTo("dashboard")}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                    currentPage === "dashboard"
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Analisis Baru
                  </div>
                </button>
                <button
                  onClick={() => navigateTo("history")}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                    currentPage === "history"
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Riwayat
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="animate-fadeIn">{renderPage()}</div>
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
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

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 md:mb-0">
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Syarat Layanan
              </a>
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Kontak
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CareerResume Analytics
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Alat untuk pengembangan karir profesional
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button for Mobile */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 sm:hidden w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-gray-800 transition-colors active:scale-95"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
