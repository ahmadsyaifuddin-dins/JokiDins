import React from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";

const PaymentListHeader = ({ onRefresh, refreshing, onBack }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Pembayaran</h1>
        <p className="text-gray-500 mt-1">
          Kelola pembayaran untuk order joki Anda
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 ${
            refreshing ? "animate-spin" : ""
          }`}
          disabled={refreshing}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </button>
      </div>
    </div>
  );
};

export default PaymentListHeader;
