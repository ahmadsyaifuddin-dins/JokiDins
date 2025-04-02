import React from "react";

const PaymentListSummary = ({ orders, formatCurrency }) => {
  const totalOrders = orders.length;
  const ordersLunas = orders.filter((o) => o.paymentStatus === "lunas").length;
  const ordersBelumLunas = orders.filter((o) => o.paymentStatus !== "lunas")
    .length;

  const totalPayment = orders.reduce((acc, order) => acc + order.paymentAmount, 0);
  const averagePayment = totalOrders > 0 ? totalPayment / totalOrders : 0;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Ringkasan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Order</div>
          <div className="text-2xl font-bold mt-1">{totalOrders}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Order Lunas</div>
          <div className="text-2xl font-bold mt-1">{ordersLunas}</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-red-600 font-medium">
            Order Belum Lunas
          </div>
          <div className="text-2xl font-bold mt-1">{ordersBelumLunas}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">
            Total Pembayaran
          </div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(totalPayment)}
          </div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm text-indigo-600 font-medium">
            Rata-rata Pembayaran
          </div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(averagePayment)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentListSummary;
