import React, { useState } from "react";
import { analyzeResumeWithAI } from "../services/geminiService";
import { calculateMatchScores } from "../services/matchingService";
import { saveAnalysis } from "../services/dbService";
import { ResumeAnalysis } from "../types";

interface DashboardProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAnalysisComplete }) => {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
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
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Silakan upload atau tempel teks CV Anda.");
      return;
    }

    if (resumeText.length < 50) {
      setError(
        "Konten CV terlalu pendek. Pastikan CV Anda memiliki informasi yang cukup."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await analyzeResumeWithAI(resumeText);
      const matchScores = calculateMatchScores(aiResponse.skills);

      const analysis: ResumeAnalysis = {
        id: crypto.randomUUID(),
        userId: "current-user",
        fileName: fileName || "Konten CV",
        uploadedAt: new Date().toISOString(),
        extractedSkills: aiResponse.skills,
        summary: aiResponse.summary,
        suggestedRoles: aiResponse.suggested_roles,
        matchScores,
      };

      saveAnalysis(analysis);
      onAnalysisComplete(analysis);
    } catch (err: any) {
      setError(
        err.message || "Terjadi kesalahan saat analisis. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteExample = () => {
    setResumeText(`John Doe
Software Engineer
john.doe@example.com | (123) 456-7890

PENGALAMAN KERJA
Senior Software Engineer - TechCorp Inc. (2020-Sekarang)
- Memimpin pengembangan aplikasi web menggunakan React dan Node.js
- Meningkatkan performa aplikasi sebesar 40% melalui optimasi kode
- Membimbing 3 developer junior dalam tim

Software Developer - StartupXYZ (2018-2020)
- Membangun fitur customer-facing menggunakan TypeScript dan React
- Berkolaborasi dengan tim produk untuk implementasi UI/UX

PENDIDIKAN
Sarjana Ilmu Komputer - Universitas Teknologi (2014-2018)
IPK: 3.8/4.0

KEMAMPUAN
Pemrograman: JavaScript, TypeScript, Python, Java
Framework: React, Node.js, Express, Spring Boot
Tools: Git, Docker, AWS, MongoDB, Jenkins`);
    setFileName("Contoh CV.txt");
    setError(null);
  };

  const clearAll = () => {
    setResumeText("");
    setFileName("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Analisis CV Profesional
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Unggah CV Anda untuk mendapatkan analisis skill, rekomendasi karir,
            dan skor kecocokan posisi
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center transition-colors hover:border-gray-400 mb-6">
              <input
                type="file"
                id="resumeFile"
                className="hidden"
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.doc,.docx,.rtf"
              />
              <label
                htmlFor="resumeFile"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4">
                  {fileName ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 sm:h-7 sm:w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                </div>
                <div className="mb-3">
                  <p className="text-gray-900 font-medium text-sm sm:text-base">
                    {fileName || "Klik untuk upload CV"}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    {fileName
                      ? "File berhasil dipilih"
                      : "Support: PDF, DOC, DOCX, TXT, RTF"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      document.getElementById("resumeFile")?.click()
                    }
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Pilih File
                  </button>
                  <button
                    onClick={handlePasteExample}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Coba Contoh
                  </button>
                </div>
              </label>
            </div>

            {/* Divider */}
            <div className="my-6 sm:my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-gray-500 text-xs sm:text-sm">
                    Atau tempel teks CV di bawah
                  </span>
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="resumeText"
                  className="text-sm font-medium text-gray-700"
                >
                  Konten CV
                </label>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hapus semua
                </button>
              </div>
              <textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Tempel teks CV Anda di sini..."
                className="w-full h-48 sm:h-56 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-gray-900 resize-none text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                {resumeText.length > 0
                  ? `${resumeText.length} karakter`
                  : "Minimal 50 karakter"}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={
                isLoading || !resumeText.trim() || resumeText.length < 50
              }
              className={`w-full py-3 sm:py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : !resumeText.trim() || resumeText.length < 50
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menganalisis...
                </>
              ) : (
                <>
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Analisis CV
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              ~3s
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Waktu Analisis
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              50+
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Posisi Ditemukan
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Privasi Terjaga
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Tips untuk Hasil Terbaik
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>
                    Pastikan CV mencakup pengalaman kerja, pendidikan, dan skill
                    lengkap
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>
                    Sebutkan teknologi dan tools spesifik yang dikuasai
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>
                    Tambahkan pencapaian yang terukur (misal: "meningkatkan
                    performa 40%")
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
