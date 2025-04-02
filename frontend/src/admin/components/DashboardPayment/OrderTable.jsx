// components/OrderTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  User,
  Package,
  DollarSign,
} from "lucide-react";

export const OrderTable = ({
  orders,
  onStatusChange,
  onSetFixedAmount,
  loading,
}) => {
  const formatCurrency = (amount) => {
    return amount
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
      : "Rp0";
  };

  const getAvatar = (order) => {
    // Jika ada avatar, kembalikan null agar kita bisa render image tag secara terpisah
    if (order.user?.avatar) {
      return null; // Kita akan handle rendering gambar di JSX
    }
    // Jika tidak ada avatar tapi ada nama, gunakan huruf pertama nama
    else if (order.user?.name) {
      return order.user.name[0].toUpperCase();
    }
    // Default fallback
    return "😺";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Lunas
          </span>
        );
      case "dicicil":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Dicicil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Belum Dibayar
          </span>
        );
    }
  };

  // if (loading) {
  //   return (
  //     <div className="p-8 flex justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Order ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-500" />
                Klien
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              <div className="flex items-center ">
                <Package className="w-4 h-4 mr-1 text-gray-500" />
                <span className="truncate md:whitespace-normal">
                  Jenis Paket
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                <span className="truncate md:whitespace-normal">
                  Nominal Diinput
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                <span className="truncate md:whitespace-normal">
                  Nominal Fixed
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              <div className="flex items-center">
                <span className="truncate md:whitespace-normal">
                  Status Pembayaran
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-blue-50 transition-colors">
              <td className="py-4 px-4">
                <div className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">
                  {order._id.slice(-8).toUpperCase()}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    {order.user?.avatar ? (
                      <img
                        src={order.user.avatar}
                        alt={order.user?.name || "User avatar"}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      getAvatar(order)
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {order.user?.name || "Not Available"}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {order.user?._id?.slice(-6) || "N/A"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {order.packageName ? (
                    <Link
                      to="/pricing"
                      className="text-blue-600 hover:underline flex items-center group"
                    >
                      <span className="truncate">{order.packageName}</span>
                      <ArrowRight className="w-3 h-3 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ) : (
                    "Not Available"
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-gray-900 font-medium">
                  {formatCurrency(order.paymentAmount)}
                </div>
              </td>
              <td className="py-4 px-4">
                <div
                  className={`text-sm font-medium ${
                    order.fixedAmount
                      ? "text-blue-600 bg-blue-50 px-2 py-1 rounded"
                      : "text-gray-400 italic"
                  }`}
                >
                  {formatCurrency(order.fixedAmount) || "Belum diatur"}
                </div>
              </td>
              <td className="py-4 px-4">
                {getStatusBadge(order.paymentStatus)}
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex justify-end space-x-2">
                  <div className="dropdown dropdown-top dropdown-end">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          onStatusChange(order._id, "belum dibayar")
                        }
                        className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full hover:bg-yellow-200 text-xs transition-colors"
                      >
                        Belum Dibayar
                      </button>
                      <button
                        onClick={() => onStatusChange(order._id, "dicicil")}
                        className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 text-xs transition-colors"
                      >
                        Dicicil
                      </button>
                      <button
                        onClick={() => onStatusChange(order._id, "lunas")}
                        className="px-3 py-1 bg-green-100 text-green-900 rounded-full hover:bg-green-200 text-xs transition-colors"
                      >
                        Lunas
                      </button>
                      <button
                        onClick={() => onSetFixedAmount(order._id)}
                        className="px-3 py-1 flex items-center space-x-1 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 text-xs transition-colors"
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
                  <p className="text-lg font-medium">
                    Tidak ada order yang ditemukan
                  </p>
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
