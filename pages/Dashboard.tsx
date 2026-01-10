import React, { useState, useRef } from "react";
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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/plain") {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Silakan upload atau tempel konten CV Anda");
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
      setError(err.message || "Analisis gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteExample = () => {
    setResumeText(`John Doe
Senior Software Engineer
john.doe@example.com | (123) 456-7890 | LinkedIn: johndoe

PENGALAMAN
Senior Software Engineer - TechCorp Inc. (2020-Sekarang)
- Memimpin pengembangan arsitektur microservices yang meningkatkan performa sistem sebesar 40%
- Membimbing 3 developer junior dan melakukan code review
- Teknologi: React, TypeScript, Node.js, AWS, Docker

Software Developer - StartupXYZ (2018-2020)
- Membangun aplikasi web customer-facing menggunakan framework JavaScript modern
- Berkolaborasi dengan tim produk untuk mengimplementasikan fitur baru

PENDIDIKAN
Sarjana Ilmu Komputer - State University (2014-2018)
IPK: 3.8/4.0

KEMAMPUAN
Pemrograman: JavaScript, TypeScript, Python, Java
Framework: React, Node.js, Express, Spring Boot
Tools: Git, Docker, AWS, Jenkins, MongoDB`);
    setFileName("Contoh CV");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Analisis CV</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unggah CV Anda untuk mendapatkan insight personal dan rekomendasi
            karir
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Konten Utama - 2/3 lebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Area Upload */}
                <div
                  className={`border-2 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  } border-dashed rounded-lg p-8 text-center transition-all duration-200`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-full w-full"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-900 font-medium mb-2">
                      {fileName ? fileName : "Tarik dan lepas CV Anda di sini"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Mendukung file .txt, .md, atau tempel teks di bawah
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Pilih File
                    </button>
                    <button
                      onClick={handlePasteExample}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Coba Contoh
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    id="resumeFile"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".txt,.md"
                  />
                </div>

                {/* Pembatas */}
                <div className="my-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-gray-500 text-sm">
                        Atau tempel konten langsung
                      </span>
                    </div>
                  </div>
                </div>

                {/* Area Teks */}
                <div className="mb-6">
                  <label
                    htmlFor="resumeText"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Konten CV
                  </label>
                  <textarea
                    id="resumeText"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Tempel konten CV Anda di sini..."
                    className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 resize-none"
                    rows={8}
                  />
                  <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {resumeText.length > 0
                        ? `${resumeText.length} karakter`
                        : ""}
                    </span>
                    <button
                      onClick={() => setResumeText("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Pesan Error */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-500 mr-2"
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

                {/* Tombol Analisis */}
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !resumeText.trim()}
                  className={`w-full py-3.5 px-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : !resumeText.trim()
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
          </div>

          {/* Sidebar - 1/3 lebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Kartu Fitur */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Yang Akan Anda Dapatkan
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        Ekstraksi skill
                      </span>{" "}
                      - Kompetensi kunci teridentifikasi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        Saran karir
                      </span>{" "}
                      - Rekomendasi posisi
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        Analisis kecocokan
                      </span>{" "}
                      - Penilaian kesesuaian industri
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        Ekspor hasil
                      </span>{" "}
                      - Simpan dan bagikan insight
                    </span>
                  </li>
                </ul>
              </div>

              {/* Kartu Statistik */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detail Analisis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">~3s</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Waktu proses
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Fokus privasi
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Posisi dianalisis
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">100+</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Skill dilacak
                    </div>
                  </div>
                </div>
              </div>

              {/* Kartu Tips */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-start mb-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-blue-900">
                    Tips untuk hasil terbaik
                  </span>
                </div>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Sertakan pengalaman kerja lengkap dengan tanggal
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Sebutkan teknologi dan tools spesifik yang digunakan
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Tambahkan pencapaian dan hasil yang terukur</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
