// components/Header.jsx
import React from "react";
import { ClipboardList, RefreshCw } from "lucide-react";

export const Header = ({ refreshing, onRefresh }) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          Status Pembayaran Order
        </h1>
        <p className="mt-2 text-gray-600">
          Kelola nominal pembayaran dan status pembayarannya.
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition-all duration-200 ease-in-out w-full sm:w-auto group"
      >
        <RefreshCw
          className={`w-5 h-5 transition-colors duration-200 ${
            refreshing ? "animate-spin text-blue-600" : "text-gray-500 group-hover:text-blue-600"
          }`}
        />
        <span className="inline">Muat Ulang</span>
      </button>
    </div>
  );
};