import React, { useState } from "react";
import {
  Eye,
  Trash2,
  Calendar,
  MoreVertical,
  Package,
  AlertTriangle,
  Clock,
  Check,
} from "lucide-react";
import {
  formatDate,
  calculateTimeLeft,
  formatDeadline,
} from "../utils/timeUtils";

// Fungsi util untuk mendapatkan badge color berdasarkan paymentStatus
const getPaymentBadgeColor = (paymentStatus) => {
  switch (paymentStatus) {
    case "belum dibayar":
      return "bg-yellow-100 text-yellow-900";
    case "dicicil":
      return "bg-blue-100 text-blue-900";
    case "lunas":
      return "bg-green-100 text-green-900";
    default:
      return "bg-gray-100 text-gray-900";
  }
};

const getPaymentStatusIcon = (paymentStatus) => {
  switch (paymentStatus) {
    case "belum dibayar":
      return AlertTriangle;
    case "dicicil":
      return Clock;
    case "lunas":
      return Check;
    default:
      return AlertTriangle;
  }
};

const DashboardOrdersTable = ({
  filteredOrders,
  getStatusBadgeColor,
  getStatusIcon,
  getStatusLabel,
  handleViewDetail,
  handleStatusChange,
  handleDelete,
  handlePaymentStatusChange, // handler baru untuk payment status
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (orderId) => {
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <div onClick={closeDropdowns} className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-t border-b border-gray-200">
          <tr>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Klien
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deskripsi
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nomor HP
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pembayaran
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status Order
            </th>
            <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order._id.slice(-10).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-gray-900">
                    {order.user?.name || "Nama tidak tersedia"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || "Email tidak tersedia"}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {order.description || "Tidak ada deskripsi"}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">
                    {Array.isArray(order.phone) && order.phone.length > 0
                      ? order.phone.join(", ")
                      : "Tidak ada nomor"}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1">
                    <div>
                      {React.createElement(
                        getPaymentStatusIcon(
                          order.paymentStatus || "belum dibayar"
                        ),
                        {
                          className: "w-4 h-4",
                        }
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      {order.paymentAmount
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(order.paymentAmount)
                        : "Rp0"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5 mr-1" />
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-700 overflow-hidden whitespace-pre">
                      {formatDeadline(order.deadline)}
                    </span>
                  </div>
                </td>

                {/* Kolom Aksi */}
                <td className="py-4 px-6 text-right relative">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(order._id);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Lihat Detail"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(order._id);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        title="Menu"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeDropdown === order._id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-200">
                              Ubah Status Order
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order._id, "pending");
                                setActiveDropdown(null);
                              }}
                              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-900"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {React.createElement(getStatusIcon("pending"), {
                                className: "w-3.5 h-3.5 mr-1",
                              })}
                              {getStatusLabel("pending")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order._id, "processing");
                                setActiveDropdown(null);
                              }}
                              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                                order.status === "processing"
                                  ? "bg-blue-100 text-blue-900"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {React.createElement(
                                getStatusIcon("processing"),
                                {
                                  className: "w-3.5 h-3.5 mr-1",
                                }
                              )}
                              {getStatusLabel("processing")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order._id, "completed");
                                setActiveDropdown(null);
                              }}
                              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-900"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {React.createElement(getStatusIcon("completed"), {
                                className: "w-3.5 h-3.5 mr-1",
                              })}
                              {getStatusLabel("completed")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order._id, "cancelled");
                                setActiveDropdown(null);
                              }}
                              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                                order.status === "cancelled"
                                  ? "bg-red-100 text-red-900"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {React.createElement(getStatusIcon("cancelled"), {
                                className: "w-3.5 h-3.5 mr-1",
                              })}
                              {getStatusLabel("cancelled")}
                            </button>
                            <div className="border-t border-gray-200 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(order._id);
                                  setActiveDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <div className="flex items-center">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Hapus Order
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="9" className="py-8 text-center text-gray-500">
                Tidak ada data pesanan yang sesuai dengan filter
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardOrdersTable;
