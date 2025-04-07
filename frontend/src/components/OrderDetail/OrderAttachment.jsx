import React from "react";
import { FileText, Download, Loader, AlertCircle } from "lucide-react";

const OrderAttachment = ({ order, handleDownloadFile, isDownloading }) => (
  <div className="transition-all hover:shadow-md rounded-xl">
    <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <span className="inline-block w-1 h-4 bg-purple-500 mr-2 rounded"></span>
      Berkas Lampiran
    </h2>
    {order.file ? (
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800 break-words">
                {order.file.originalName}
              </p>
              {order.file.size && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(order.file.size / 1024)} KB
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDownloadFile}
            disabled={isDownloading}
            className={`inline-flex items-center px-4 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
              isDownloading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isDownloading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
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
      <div className="text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
        <p className="italic text-gray-400">Tidak ada berkas yang dilampirkan</p>
      </div>
    )}
  </div>
);

export default OrderAttachment;
