// components/ErrorAlert.jsx
import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ message }) => {
  return (
    <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 flex items-center gap-3 shadow-sm">
      <AlertCircle className="w-6 h-6 flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
};