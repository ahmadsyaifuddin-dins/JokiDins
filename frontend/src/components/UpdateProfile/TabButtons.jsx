import React from "react";
import { User, Phone, Lock } from "lucide-react";

const TabButtons = ({ section, setSection }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
      <button
        type="button"
        onClick={() => setSection("basic")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "basic"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <User className="h-4 w-4 mx-auto mb-1" />
        Profil
      </button>
      <button
        type="button"
        onClick={() => setSection("contact")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "contact"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Phone className="h-4 w-4 mx-auto mb-1" />
        Kontak
      </button>
      <button
        type="button"
        onClick={() => setSection("security")}
        className={`py-3 px-1 rounded-lg font-medium text-sm transition-colors ${
          section === "security"
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Lock className="h-4 w-4 mx-auto mb-1" />
        Keamanan
      </button>
    </div>
  );
};

export default TabButtons;
