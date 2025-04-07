// OrderDetailComponents/OrderAttachments.jsx
import React from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const OrderAttachments = ({ file, handleDownloadFile }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await handleDownloadFile();
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Berkas Lampiran
        </h2>
        
        {file ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center flex-wrap gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{file.originalName}</p>
                <p className="text-sm text-gray-500">
                  {file.size ? `${(file.size / 1024).toFixed(2)} KB` : "Ukuran tidak diketahui"}
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Unduh Berkas
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Tidak ada berkas yang dilampirkan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderAttachments;