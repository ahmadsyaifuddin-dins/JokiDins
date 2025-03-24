import React, { useState } from "react";
import { ArrowPathIcon, DocumentPlusIcon } from "@heroicons/react/24/solid";

const ButtonDefault = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`
            w-full py-3 px-6 
            ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} 
            text-white font-semibold 
            rounded-lg 
            transition-all duration-200 
            ${!isLoading && "hover:shadow-md"} 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            flex items-center justify-center
            space-x-3
            ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
    >
      {isLoading ? (
        <>
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <DocumentPlusIcon className="w-5 h-5" />
          <span>Buat Order Joki</span>
        </>
      )}
    </button>
  );
};

export default ButtonDefault;
