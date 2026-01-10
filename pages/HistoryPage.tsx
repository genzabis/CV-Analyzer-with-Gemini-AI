import React from "react";
import { ResumeAnalysis } from "../types";
import { deleteAnalysis } from "../services/dbService";

interface HistoryPageProps {
  history: ResumeAnalysis[];
  onViewItem: (item: ResumeAnalysis) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onViewItem,
}) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Belum Ada Riwayat
        </h2>
        <p className="text-gray-500 text-sm">
          Hasil analisis CV Anda akan muncul di sini.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Riwayat Analisis
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Semua analisis yang telah dilakukan
          </p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
          {history.length} item
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama File
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kecocokan Tertinggi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Skill Teridentifikasi
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                          {item.fileName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {item.extractedSkills.slice(0, 2).join(", ")}
                          {item.extractedSkills.length > 2 ? "..." : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.matchScores[0]?.jobTitle || "-"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-gray-900 h-1.5 rounded-full"
                            style={{
                              width: `${item.matchScores[0]?.score || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {item.matchScores[0]?.score || 0}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 font-medium mr-2">
                        {item.extractedSkills.length}
                      </span>
                      <span className="text-sm text-gray-500">skill</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(item.uploadedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewItem(item)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Lihat
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Apakah Anda yakin ingin menghapus analisis ini?"
                            )
                          ) {
                            deleteAnalysis(item.id);
                            window.location.reload();
                          }
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500">
              Total analisis:{" "}
              <span className="font-medium text-gray-700">
                {history.length}
              </span>
            </div>
            <div className="text-gray-500">
              Rata-rata skill:{" "}
              <span className="font-medium text-gray-700">
                {Math.round(
                  history.reduce(
                    (acc, item) => acc + item.extractedSkills.length,
                    0
                  ) / history.length
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Analisis</div>
          <div className="text-2xl font-bold text-gray-900">
            {history.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Skill Rata-rata</div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(
              history.reduce(
                (acc, item) => acc + item.extractedSkills.length,
                0
              ) / history.length
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Skor Tertinggi</div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.max(
              ...history.map((item) => item.matchScores[0]?.score || 0)
            )}
            %
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Analisis Terbaru</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDate(history[0]?.uploadedAt || "")}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-6">
        <div className="flex items-start">
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
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Tips Mengelola Riwayat
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Hapus analisis lama untuk menjaga kinerja aplikasi</span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>
                  Bandingkan analisis untuk melihat perkembangan skill Anda
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-1">•</span>
                <span>Prioritaskan pengembangan skill yang sering kurang</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
