// components/ViewToggle.jsx
import React from "react";
import { List, Grid } from "lucide-react";

export const ViewToggle = ({ viewMode, onToggle }) => {
  return (
    <div className="inline-flex items-center p-1 bg-gray-100 rounded-md">
      <button
        onClick={() => viewMode === "grid" && onToggle()}
        className={`flex items-center justify-center p-2 rounded ${
          viewMode === "table"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        } transition-all duration-200`}
      >
        <List className="w-5 h-5" />
        <span className="ml-2 text-sm font-medium">Tabel</span>
      </button>
      <button
        onClick={() => viewMode === "table" && onToggle()}
        className={`flex items-center justify-center p-2 rounded ${
          viewMode === "grid"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        } transition-all duration-200`}
      >
        <Grid className="w-5 h-5" />
        <span className="ml-2 text-sm font-medium">Grid</span>
      </button>
    </div>
  );
};