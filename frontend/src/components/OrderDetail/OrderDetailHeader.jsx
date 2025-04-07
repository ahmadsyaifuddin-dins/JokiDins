import React from "react";
import { Package } from "lucide-react";

const OrderDetailHeader = ({ order, orderId, statusConfig }) => (
  <div className={`${statusConfig.lightColor} border-b border-gray-200 p-4 md:p-6`}>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-white shadow-sm">
          <Package className="h-6 w-6 text-gray-700" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
          {order.service || "Detail Pesanan"}
        </h1>
      </div>
      <div
        className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${statusConfig.color} self-start md:self-auto`}
      >
        <span className="flex-shrink-0">{statusConfig.icon}</span>
        <span className="font-medium">{statusConfig.label}</span>
      </div>
    </div>
    <div className="mt-4 text-sm text-gray-500">
      ID Pesanan:{" "}
      <span className="font-mono font-medium text-gray-700">{orderId}</span>
    </div>
  </div>
);

export default OrderDetailHeader;
