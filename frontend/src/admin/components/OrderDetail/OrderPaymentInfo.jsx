// OrderDetailComponents/OrderPaymentInfo.jsx
import React from "react";
import { CreditCard, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";

const OrderPaymentInfo = ({ order }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };
  
  const getPaymentStatusConfig = (status) => {
    const statusMap = {
      "paid": {
        label: "Sudah Dibayar",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-100",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
      },
      "unpaid": {
        label: "Belum Dibayar",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-100",
        icon: <AlertCircle className="h-5 w-5 text-amber-600" />
      }
    };
    
    const paymentStatus = status || "unpaid";
    return statusMap[paymentStatus] || statusMap.unpaid;
  };
  
  const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
  
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          Informasi Pembayaran
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Paket</h3>
            <p className="text-gray-800 font-semibold">
              {order.packageName || "Tidak ada paket"}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Nominal Pembayaran</h3>
            <p className="text-gray-800 font-semibold">
              {order.paymentAmount ? formatCurrency(order.paymentAmount) : "Rp0"}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fixed Amount</h3>
            <p className="text-gray-800 font-semibold">
              {order.fixedAmount ? formatCurrency(order.fixedAmount) : "Belum di-set"}
            </p>
          </div>
          
          <div className={`${paymentStatusConfig.bgColor} rounded-lg p-4 border ${paymentStatusConfig.borderColor}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status Pembayaran</h3>
            <div className="flex items-center">
              {paymentStatusConfig.icon}
              <span className={`ml-2 font-semibold ${paymentStatusConfig.color}`}>
                {paymentStatusConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentInfo;