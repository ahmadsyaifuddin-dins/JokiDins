// OrderDetailComponents/OrderDetailHeader.jsx
import React from "react";
import { Package, User } from "lucide-react";

const OrderDetailHeader = ({ order, orderId }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        bgColor: "bg-amber-50",
        label: "Menunggu",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        bgColor: "bg-blue-50",
        label: "Diproses",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        bgColor: "bg-green-50",
        label: "Selesai",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        bgColor: "bg-red-50",
        label: "Dibatalkan",
      }
    };
    return configs[status] || { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      bgColor: "bg-gray-50", 
      label: status,
    };
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Package className="h-6 w-6 text-white opacity-90" />
              <h1 className="text-2xl font-bold">
                {order.service || "Detail Pesanan"}
              </h1>
            </div>
            <div className="flex items-center text-blue-100">
              <User className="h-5 w-5 mr-2 opacity-80" />
              <span className="font-medium">{order.user?.email || "Email tidak tersedia"}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`${statusConfig.color} rounded-lg px-4 py-2 text-sm inline-flex items-center justify-center`}>
              {statusConfig.label}
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm inline-flex items-center justify-center">
              Order ID: {orderId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHeader;