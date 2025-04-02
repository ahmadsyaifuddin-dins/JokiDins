import React from "react";
import { CreditCard, Package } from "lucide-react";
import { NumericFormat } from "react-number-format";

const PaymentListOrders = ({
  orders,
  paymentInputs,
  handleInputChange,
  handlePaymentUpdate,
  formatCurrency,
  getStatusBadge,
  resetFilters,
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-lg font-medium text-gray-700">
          Tidak ada order yang ditemukan
        </p>
        <p className="text-gray-500 mt-1">
          Coba ubah filter pencarian atau refresh halaman
        </p>
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {orders.map((order) => {
          const remaining = order.fixedAmount - order.paymentAmount;
          return (
            <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {order._id.slice(-8).toUpperCase()}
                  </span>
                  <h3 className="mt-2 font-medium">{order.packageName}</h3>
                </div>
                {getStatusBadge(order.paymentStatus)}
              </div>

              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="text-gray-500 text-sm">Total</div>
                <div className="text-right font-medium">
                  {formatCurrency(order.fixedAmount)}
                </div>

                <div className="text-gray-500 text-sm">Sudah Dibayar</div>
                <div className="text-right font-medium">
                  {formatCurrency(order.paymentAmount)}
                </div>

                <div className="text-gray-500 text-sm">Sisa</div>
                <div className="text-right font-medium">
                  {formatCurrency(remaining)}
                </div>
              </div>

              {order.paymentStatus !== "lunas" ? (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bayar Sekarang
                  </label>
                  <div className="flex gap-2">
                    <NumericFormat
                      value={paymentInputs[order._id] || ""}
                      onValueChange={({ value }) =>
                        handleInputChange(order._id, value)
                      }
                      thousandSeparator="."
                      decimalSeparator=","
                      placeholder="Nominal"
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() =>
                        handlePaymentUpdate(
                          order._id,
                          order.fixedAmount,
                          order.paymentAmount
                        )
                      }
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Bayar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <span className="text-green-600 font-semibold flex items-center justify-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Pembayaran Terlunaskan
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paket
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fixed Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sudah Dibayar
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sisa
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bayar Sekarang
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => {
                const remaining = order.fixedAmount - order.paymentAmount;
                return (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                        {order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {order.packageName}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(order.fixedAmount)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(order.paymentAmount)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatCurrency(remaining)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="py-4 px-4">
                      {order.paymentStatus !== "lunas" ? (
                        <div className="flex gap-2">
                          <NumericFormat
                            value={paymentInputs[order._id] || ""}
                            onValueChange={({ value }) =>
                              handleInputChange(order._id, value)
                            }
                            thousandSeparator="."
                            decimalSeparator=","
                            placeholder="Nominal"
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() =>
                              handlePaymentUpdate(
                                order._id,
                                order.fixedAmount,
                                order.paymentAmount
                              )
                            }
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <span className="text-green-600 font-semibold flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Terlunaskan
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PaymentListOrders;
