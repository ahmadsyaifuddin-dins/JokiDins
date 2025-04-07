import React from "react";
import { Package, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { formatDateDisplay, getCompletionTimeDifference } from "../../utils/orderUtils";

const renderTimelineItem = (date, icon, title, description) => (
  <div className="flex" key={title + date}>
    <div className="flex flex-col items-center mr-4">
      <div className="rounded-full bg-blue-500 p-2 text-white">{icon}</div>
      <div className="h-full w-px bg-blue-200 my-1"></div>
    </div>
    <div className="pb-6">
      <p className="text-sm text-gray-500">{date}</p>
      <p className="font-medium text-gray-900">{title}</p>
      {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
    </div>
  </div>
);

const OrderTimeline = ({ order }) => (
  <div className="transition-all hover:shadow-md rounded-xl">
    <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      <span className="inline-block w-1 h-4 bg-blue-500 mr-2 rounded"></span>
      Riwayat Pesanan
    </h2>
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <div className="space-y-0">
        {renderTimelineItem(
          formatDateDisplay(order.createdAt),
          <Package className="h-4 w-4" />,
          "Pesanan Dibuat",
          "Pesanan telah berhasil dibuat dan menunggu untuk diproses"
        )}

        {order.status === "processing" &&
          renderTimelineItem(
            formatDateDisplay(order.updatedAt),
            <RefreshCw className="h-4 w-4" />,
            "Sedang Diproses",
            "Pesanan Anda sedang dikerjakan oleh tim kami"
          )}

        {order.status === "completed" && (
          <>
            {renderTimelineItem(
              "Dalam Proses",
              <RefreshCw className="h-4 w-4" />,
              "Sedang Diproses",
              "Pesanan Anda sedang dikerjakan oleh tim kami"
            )}
            {renderTimelineItem(
              formatDateDisplay(order.updatedAt),
              <CheckCircle className="h-4 w-4" />,
              "Pesanan Selesai",
              `Pesanan Anda telah berhasil diselesaikan (${getCompletionTimeDifference(order).text})`
            )}
          </>
        )}

        {order.status === "cancelled" &&
          renderTimelineItem(
            formatDateDisplay(order.updatedAt),
            <AlertCircle className="h-4 w-4" />,
            "Pesanan Dibatalkan",
            "Pesanan ini telah dibatalkan"
          )}
      </div>
    </div>
  </div>
);

export default OrderTimeline;
