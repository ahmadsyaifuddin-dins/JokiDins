import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const DashboardSort = ({ sortBy, sortOrder, setSortBy, setSortOrder }) => {
  const sortOptions = [
    { value: "deadline", label: "Tenggat Waktu" },
    { value: "createdAt", label: "Tanggal Dibuat" },
  ];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500 whitespace-nowrap">Urutkan:</label>
      <div className="flex">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="block w-full rounded-l-lg border-r-0 border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={toggleSortOrder}
          className="px-3 bg-white border border-l-0 border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ArrowDown className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DashboardSort;