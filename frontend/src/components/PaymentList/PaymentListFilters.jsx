import React from "react";
import { Search, ChevronDown, Filter, Calendar } from "lucide-react";

const PaymentListFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  resetFilters,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        {/* Search bar */}
        <div className="w-full sm:max-w-xs mb-3 sm:mb-0 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari order ID atau paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highestAmount">Nominal Tertinggi</option>
            <option value="lowestAmount">Nominal Terendah</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter</span>
            <ChevronDown
              className={`h-4 w-4 ml-1 transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 bg-white text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="dicicil">Dicicil</option>
                <option value="belum dibayar">Belum Dibayar</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="border pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="border pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="w-full sm:w-auto flex self-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentListFilters;
