// components/OrderTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const OrderTable = ({ orders, onStatusChange, onSetFixedAmount, loading }) => {
  const formatCurrency = (amount) => {
    return amount
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
      : "Rp0";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Lunas
          </span>
        );
      case "dicicil":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Dicicil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Belum Dibayar
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Order ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Klien
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Jenis Paket
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Nominal Diinput
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Nominal Fixed
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Status Pembayaran
            </th>
            <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="text-sm font-medium text-gray-900">
                  {order._id.slice(-8).toUpperCase()}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900">
                  {order.user?.name || "Not Available"}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900">
                  {order.packageName ? (
                    <Link to="/pricing" className="text-blue-600 hover:underline">
                      {order.packageName}
                    </Link>
                  ) : (
                    "Not Available"
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900">
                  {formatCurrency(order.paymentAmount)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`text-sm ${order.fixedAmount ? 'font-medium text-blue-600' : 'text-gray-500'}`}>
                  {formatCurrency(order.fixedAmount)}
                </div>
              </td>
              <td className="py-3 px-4">
                {getStatusBadge(order.paymentStatus)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end space-x-2">
                  <div className="dropdown dropdown-top dropdown-end">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onStatusChange(order._id, "belum dibayar")}
                        className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded hover:bg-yellow-200 text-xs transition-colors"
                      >
                        Belum Dibayar
                      </button>
                      <button
                        onClick={() => onStatusChange(order._id, "dicicil")}
                        className="px-3 py-1 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-xs transition-colors"
                      >
                        Dicicil
                      </button>
                      <button
                        onClick={() => onStatusChange(order._id, "lunas")}
                        className="px-3 py-1 bg-green-100 text-green-900 rounded hover:bg-green-200 text-xs transition-colors"
                      >
                        Lunas
                      </button>
                      <button
                        onClick={() => onSetFixedAmount(order._id)}
                        className="px-3 py-1 flex items-center space-x-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 text-xs transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Set Fixed</span>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" className="py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium">Tidak ada order yang ditemukan</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Silahkan refresh halaman atau periksa kembali nanti
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};