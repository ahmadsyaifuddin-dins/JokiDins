import React from "react";

const IncomeFilter = ({
  searchNominal,
  setSearchNominal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="searchNominal"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Cari Nominal
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              id="searchNominal"
              value={searchNominal}
              onChange={(e) => setSearchNominal(e.target.value)}
              placeholder="Cari nominal..."
              className="block w-full pl-10 pr-3 py-2 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Tanggal Mulai
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full px-3 py-2 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-slate-300 mb-1"
          >
            Tanggal Akhir
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full px-3 py-2 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => {
            setSearchNominal("");
            setStartDate("");
            setEndDate("");
          }}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default IncomeFilter;