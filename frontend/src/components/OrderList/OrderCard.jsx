import React from "react";
import {
  Calendar,
  ExternalLink,
  Edit,
  RefreshCw,
  Download,
  FileText,
  Clock,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDeadlineDisplay } from "../../utils/orderUtils";

const OrderCard = ({
  order,
  getStatusConfig,
  timeInfo,
  downloadingId,
  handleDownloadFile,
}) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(order.status);

  // Simplified payment status helper
  const getPaymentStatusColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "lunas") return "text-green-600";
    if (statusLower === "sebagian") return "text-blue-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div className={`${statusConfig.bgColor} px-4 py-3 border-b border-gray-200`}>
        <div className="flex justify-between items-center">
          <div className="line-clamp-1 font-semibold text-gray-900">
            {order.service || "Pesanan Tanpa Judul"}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.color}`}>
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

          {/* Simple deadline display */}
          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-800">
                Deadline:
                <span className="font-semibold ml-1">{formatDeadlineDisplay(order.deadline)}</span>
              </div>
              <div className={`flex items-center text-xs ${timeInfo.color} mt-1`}>
                <Clock className="h-3 w-3 mr-1" />
                {timeInfo.text}
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist payment information section */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-2">
            <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">
              Informasi Pembayaran
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Paket</div>
            <div className="text-gray-800 font-medium text-right">{order.packageName || "-"}</div>
            
            <div className="text-gray-600">Status</div>
            <div className={`text-right font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus || "Belum Dibayar"}
            </div>
            
            <div className="text-gray-600">Nominal</div>
            <div className="text-gray-800 font-medium text-right">
              {order.paymentAmount
                ? `Rp ${order.paymentAmount.toLocaleString('id-ID')}`
                : "Rp 0"}
            </div>
            
            <div className="text-gray-600">Fixed Amount</div>
            <div className="text-gray-800 font-medium text-right">
              {order.fixedAmount
                ? `Rp ${order.fixedAmount.toLocaleString('id-ID')}`
                : "-"}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigate(`/edit-order/${order._id}`)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md flex items-center transition-colors"
              title="Edit Pesanan"
            >
              <Edit className="h-4 w-4" />
            </button>

            {order.file ? (
              <button
                onClick={() => handleDownloadFile(order._id)}
                disabled={downloadingId === order._id}
                className={`p-1.5 text-purple-600 hover:bg-purple-50 rounded-md flex items-center transition-colors ${
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
              <div className="p-1.5 text-gray-400 flex items-center" title="Tidak ada berkas">
                <FileText className="h-4 w-4" />
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/orders/${order._id}`)}
            className="text-blue-600 font-medium text-sm flex items-center"
          >
            Detail
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;