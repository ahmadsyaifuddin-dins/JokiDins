import React from "react";
import { Eye, PlayCircle, CheckCircle, XCircle, Trash2 } from "lucide-react";

const DashboardOrdersTable = ({
  filteredOrders,
  getStatusBadgeColor,
  getStatusIcon,
  getStatusLabel,
  handleViewDetail,
  handleStatusChange,
  handleDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kostumer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Layanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nomor HP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order._id.slice(-5).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-600">{order.user?.name || "Tidak ada nama"}</span>
                    <span className="text-xs text-gray-500">{order.user?.email || ""}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {Array.isArray(order.phone) && order.phone.length > 0 ? order.phone.join(", ") : "Tidak ada nomor"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(order._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>
                    <div className="flex items-center gap-1">
                      {order.status !== "processing" && (
                        <button
                          onClick={() => handleStatusChange(order._id, "processing")}
                          title="Proses Order"
                          className="inline-flex items-center p-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </button>
                      )}
                      {order.status !== "completed" && (
                        <button
                          onClick={() => handleStatusChange(order._id, "completed")}
                          title="Selesaikan Order"
                          className="inline-flex items-center p-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => handleStatusChange(order._id, "cancelled")}
                          title="Batalkan Order"
                          className="inline-flex items-center p-1.5 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        title="Hapus Order"
                        className="inline-flex items-center p-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOrdersTable;
