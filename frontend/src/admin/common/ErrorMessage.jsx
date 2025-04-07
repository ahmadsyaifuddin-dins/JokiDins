// common/ErrorMessage.jsx
import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const ErrorMessage = ({ message, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <span className="text-red-700 font-medium">{message}</span>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;