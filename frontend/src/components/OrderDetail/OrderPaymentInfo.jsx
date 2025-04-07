import React from "react";
import { CreditCard, CheckCircle, AlertCircle, DollarSign, Package } from "lucide-react";

const PaymentInfoCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100 flex items-center space-x-3">
    <div className="p-2 bg-green-50 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const OrderPaymentInfo = ({ order }) => {
  const getPaymentStatusConfig = (status) => {
    const paymentStatus = status || "belum dibayar";
    const configs = {
      "paid": {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      },
      "belum dibayar": {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      }
    };
    
    return configs[paymentStatus] || {
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    };
  };

  const formatCurrency = (amount) => {
    return amount
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
      : "Rp0";
  };

  const statusConfig = getPaymentStatusConfig(order.paymentStatus);

  return (
    <div className="transition-all hover:shadow-md rounded-xl">
      <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <span className="inline-block w-1 h-4 bg-green-500 mr-2 rounded"></span>
        Informasi Pembayaran
      </h2>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PaymentInfoCard 
            label="Paket" 
            value={order.packageName || "-"} 
            icon={<Package className="h-4 w-4 text-green-600" />}
          />
          
          <PaymentInfoCard 
            label="Nominal Pembayaran" 
            value={formatCurrency(order.paymentAmount)} 
            icon={<DollarSign className="h-4 w-4 text-green-600" />}
          />
          
          <PaymentInfoCard 
            label="Fixed Amount" 
            value={order.fixedAmount ? formatCurrency(order.fixedAmount) : "Belum di-set"} 
            icon={<CreditCard className="h-4 w-4 text-green-600" />}
          />
          
          <div className={`bg-white rounded-lg p-3 shadow-sm border ${statusConfig.borderColor} flex items-center space-x-3 capitalize`}>
            <div className={`p-2 ${statusConfig.bgColor} rounded-full`}>
              {statusConfig.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Status Pembayaran</p>
              <p className={`font-semibold ${statusConfig.textColor}`}>
                {order.paymentStatus || "Belum dibayar"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentInfo;