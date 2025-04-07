// common/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <span className="text-gray-700 font-medium">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;