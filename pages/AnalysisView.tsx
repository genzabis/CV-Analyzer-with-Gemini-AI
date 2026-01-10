import React from "react";
import { ResumeAnalysis } from "../types";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AnalysisViewProps {
  analysis: ResumeAnalysis;
  onBack: () => void;
}

const LEVEL_KEMAMPUAN = ["Pemula", "Menengah", "Lanjutan", "Expert"];

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onBack,
}) => {
  // Data untuk visualisasi
  const dataMatchTeratas = [
    { name: "Skor Cocok", value: analysis.matchScores[0]?.score || 0 },
    { name: "Sisa", value: 100 - (analysis.matchScores[0]?.score || 0) },
  ];

  const dataSkorMatch = analysis.matchScores.map((match) => ({
    nama:
      match.jobTitle.length > 15
        ? match.jobTitle.substring(0, 12) + "..."
        : match.jobTitle,
    skor: match.score,
    cocok: match.matchedSkills.length,
    kurang: match.missingSkills.length,
  }));

  const dataDistribusiSkill = [
    {
      kategori: "Teknis",
      jumlah: analysis.extractedSkills.filter((s) =>
        [
          "javascript",
          "typescript",
          "python",
          "java",
          "react",
          "node",
          "aws",
          "docker",
        ].includes(s.toLowerCase())
      ).length,
    },
    {
      kategori: "Soft Skill",
      jumlah: analysis.extractedSkills.filter((s) =>
        ["komunikasi", "kepemimpinan", "teamwork", "problem", "manajemen"].some(
          (keyword) => s.toLowerCase().includes(keyword)
        )
      ).length,
    },
    {
      kategori: "Tools",
      jumlah: analysis.extractedSkills.filter((s) =>
        [
          "git",
          "jira",
          "jenkins",
          "docker",
          "kubernetes",
          "aws",
          "azure",
        ].includes(s.toLowerCase())
      ).length,
    },
  ];

  const getWarnaSkor = (skor: number) => {
    if (skor >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (skor >= 60) return "text-blue-600 bg-blue-50 border-blue-100";
    if (skor >= 40) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-gray-600 bg-gray-50 border-gray-100";
  };

  const getWarnaBarSkor = (skor: number) => {
    if (skor >= 80) return "#10b981";
    if (skor >= 60) return "#3b82f6";
    if (skor >= 40) return "#f59e0b";
    return "#9ca3af";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-medium">Kembali ke Analisis</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Laporan Analisis CV
              </h1>
              <p className="text-gray-600 text-sm">
                Analisis diselesaikan pada{" "}
                {new Date(analysis.uploadedAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getWarnaSkor(
                  analysis.matchScores[0]?.score || 0
                )}`}
              >
                Skor Keseluruhan: {analysis.matchScores[0]?.score || 0}%
              </span>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Ekspor PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Konten Utama */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ringkasan Eksekutif */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ringkasan Profesional
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Highlight Utama
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {analysis.extractedSkills.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Skill Teridentifikasi
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {analysis.matchScores.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Posisi Dianalisis
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {Math.max(...analysis.matchScores.map((m) => m.score))}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Kecocokan Tertinggi
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {analysis.suggestedRoles.length}
                      </div>
                      <div className="text-xs text-gray-500">Jalur Karir</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Skill */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Analisis Kompetensi
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Skill yang Teridentifikasi
                    </h3>
                    <span className="text-xs text-gray-500">
                      {analysis.extractedSkills.length} total
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.extractedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Kategori Skill
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataDistribusiSkill}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="kategori"
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          formatter={(value) => [`${value} skill`, "Jumlah"]}
                          labelStyle={{ color: "#374151" }}
                        />
                        <Bar
                          dataKey="jumlah"
                          fill="#4f46e5"
                          radius={[4, 4, 0, 0]}
                          name="Jumlah Skill"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Kecocokan Posisi */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Analisis Kecocokan Posisi
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {analysis.matchScores.map((match, index) => (
                    <div
                      key={match.jobId}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {match.jobTitle}
                            </h3>
                            {index === 0 && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                Paling Cocok
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {match.matchedSkills.length} dari{" "}
                            {match.matchedSkills.length +
                              match.missingSkills.length}{" "}
                            skill yang dibutuhkan
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg font-bold ${getWarnaSkor(
                            match.score
                          )} border`}
                        >
                          {match.score}%
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progres Kecocokan</span>
                          <span>{match.score}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-1000 rounded-full"
                            style={{
                              width: `${match.score}%`,
                              backgroundColor: getWarnaBarSkor(match.score),
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Breakdown Skill */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-emerald-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <h4 className="text-sm font-medium text-gray-900">
                              Skill yang Cocok
                            </h4>
                            <span className="text-xs text-gray-500">
                              ({match.matchedSkills.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {match.matchedSkills.length > 0 ? (
                              match.matchedSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                Tidak ada skill yang cocok
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <h4 className="text-sm font-medium text-gray-900">
                              Perlu Dikembangkan
                            </h4>
                            <span className="text-xs text-gray-500">
                              ({match.missingSkills.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {match.missingSkills.length > 0 ? (
                              match.missingSkills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-200"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-emerald-600 italic">
                                Semua skill telah terpenuhi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Sidebar */}
          <div className="space-y-8">
            {/* Visualisasi Skor Tertinggi */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Skor Kecocokan Tertinggi
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="30%"
                    outerRadius="90%"
                    data={dataMatchTeratas}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={15}
                      background={{ fill: "#f3f4f6" }}
                      dataKey="value"
                      cornerRadius={8}
                    >
                      <Cell
                        fill={getWarnaBarSkor(
                          analysis.matchScores[0]?.score || 0
                        )}
                      />
                      <Cell fill="#f3f4f6" />
                    </RadialBar>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Skor"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {analysis.matchScores[0]?.score || 0}%
                </div>
                <p className="text-sm text-gray-600">
                  {analysis.matchScores[0]?.jobTitle}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  Berdasarkan{" "}
                  {analysis.matchScores[0]?.matchedSkills.length || 0} skill
                  yang cocok
                </div>
              </div>
            </div>

            {/* Saran Jalur Karir */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Saran Jalur Karir
              </h3>
              <ul className="space-y-3">
                {analysis.suggestedRoles.map((role, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="text-sm font-medium">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{role}</p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Berdasarkan profil skill Anda
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-xs text-gray-300">
                  <p className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Analisis berdasarkan tren pasar saat ini
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Skor Kecocokan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Ringkasan Skor Kecocokan
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataSkorMatch}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f3f4f6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="nama"
                      stroke="#6b7280"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={11}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Skor Kecocokan"]}
                      labelStyle={{ color: "#374151" }}
                    />
                    <Bar
                      dataKey="skor"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                      name="Skor Kecocokan"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 text-center">
                  Skor dihitung berdasarkan kesesuaian skill dengan kebutuhan
                  posisi
                </div>
              </div>
            </div>

            {/* Langkah Selanjutnya */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h4 className="text-sm font-medium text-blue-900 mb-3">
                Langkah Selanjutnya yang Disarankan
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs text-blue-600">1</span>
                  </div>
                  <span className="text-blue-800">
                    Fokus kembangkan skill yang kurang untuk posisi target Anda
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs text-blue-600">2</span>
                  </div>
                  <span className="text-blue-800">
                    Pertimbangkan posisi dengan skor 80%+ untuk aplikasi
                    langsung
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs text-blue-600">3</span>
                  </div>
                  <span className="text-blue-800">
                    Update CV untuk highlight skill yang cocok secara lebih
                    menonjol
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
