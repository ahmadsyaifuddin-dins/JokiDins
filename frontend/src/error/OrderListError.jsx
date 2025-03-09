import { AlertCircle, RefreshCcw } from "lucide-react";
import React from "react";

const OrderListError = ({ error, fetchOrders }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 mr-3 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListError;
