import React from "react";
import { Calendar, ExternalLink, Edit, RefreshCw, Download, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDeadlineDisplay } from "../../utils/orderUtils";

const OrderCard = ({ order, getStatusConfig, timeInfo, downloadingId, handleDownloadFile }) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(order.status);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className={`${statusConfig.bgColor} px-4 py-3 border-b border-gray-200`}>
        <div className="flex justify-between items-center">
          <div className="line-clamp-1 font-semibold text-gray-900">
            {order.service || "Pesanan Tanpa Judul"}
          </div>
          <div 
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${statusConfig.color}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4 mb-4">
          <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
            {order.description || "Tidak ada deskripsi"}
          </p>

          {/* Improved deadline display */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center text-sm mb-1">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Deadline:</span>
            </div>
            <div className="ml-6 flex flex-col">
              <span className="font-semibold text-gray-800">
                {formatDeadlineDisplay(order.deadline)}
              </span>
              <div className={`mt-1 flex items-center text-xs ${timeInfo.color}`}>
                <Clock className="h-3 w-3 mr-1" />
                {timeInfo.text}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigate(`/edit-order/${order._id}`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center transition-colors"
              title="Edit Pesanan"
            >
              <Edit className="h-4 w-4" />
            </button>

            {order.file ? (
              <button
                onClick={() => handleDownloadFile(order._id)}
                disabled={downloadingId === order._id}
                className={`p-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center transition-colors ${
                  downloadingId === order._id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Unduh Berkas"
              >
                {downloadingId === order._id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="p-2 text-gray-400 flex items-center" title="Tidak ada berkas">
                <FileText className="h-4 w-4" />
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/orders/${order._id}`)}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all group-hover:translate-x-1"
          >
            Detail
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;