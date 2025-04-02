import React from "react";

/**
 * Komponen untuk tombol export data pendapatan
 * @param {Function} exportToPDF - Fungsi untuk export ke PDF
 * @param {Function} exportToExcel - Fungsi untuk export ke Excel
 * @param {Array} allData - Semua data pendapatan
 * @param {Array} filteredData - Data pendapatan yang sudah difilter
 */
const IncomeExport = ({ exportToPDF, exportToExcel, allData, filteredData }) => {
  // Pastikan data yang digunakan tidak undefined
  
  const handleExportPDF = () => {
    const dataToExport = filteredData && filteredData.length > 0 ? filteredData : allData || [];
    exportToPDF(allData || [], dataToExport);
  };

  const handleExportExcel = () => {
    const dataToExport = filteredData && filteredData.length > 0 ? filteredData : allData || [];
    exportToExcel(allData || [], dataToExport);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExportPDF}
        className="px-3 py-2 bg-red-600/70 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
        title="Export ke PDF"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        PDF
      </button>
      <button
        onClick={handleExportExcel}
        className="px-3 py-2 bg-green-600/70 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
        title="Export ke Excel"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          ></path>
        </svg>
        Excel
      </button>
    </div>
  );
};

export default IncomeExport;