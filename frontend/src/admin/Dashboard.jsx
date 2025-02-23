import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  PlayCircle,
  CheckCircle,
  XCircleIcon,
  Trash2,
  RefreshCcw
} from "lucide-react";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Definisikan fungsi handler
const handleViewDetail = (orderId) => {
    navigate(`/admin/OrderDetail/${orderId}`);  // atau `/admin/orders/${orderId}` sesuai struktur route Anda
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Gagal memuat daftar order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Toast notification instead of alert
      const notification = document.getElementById("notification");
      notification.textContent = `Order berhasil diupdate menjadi: ${newStatus}`;
      notification.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg";
      notification.style.display = "block";

      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);

      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Gagal memperbarui status order");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Yakin ingin menghapus order ini?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Toast notification
      const notification = document.getElementById("notification");
      notification.textContent = "Order berhasil dihapus";
      notification.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg";
      notification.style.display = "block";

      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);

      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Gagal menghapus order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "processing":
        return <RefreshCcw className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border border-blue-200",
      completed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Menunggu",
      processing: "Diproses",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return labels[status] || status;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notification Toast */}
      <div id="notification" className="hidden"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-blue-900" />
            Dashboard Admin
          </h1>
          <p className="mt-2 text-gray-600">Kelola semua order yang masuk</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm mb-1">Total Order</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-yellow-600 text-sm mb-1">Menunggu</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-blue-600 text-sm mb-1">Diproses</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.processing}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-green-600 text-sm mb-1">Selesai</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-red-600 text-sm mb-1">Dibatalkan</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.cancelled}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari order..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="pending">Menunggu</option>
                <option value="processing">Diproses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Tidak ada order yang ditemukan.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email User
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user?.email || "Tidak ada email"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {/* View Detail Button */}
                          <button
                            onClick={() => handleViewDetail(order._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </button>

                          {/* Status Action Buttons */}
                          <div className="flex items-center gap-1">
                            {order.status !== "processing" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "processing")
                                }
                                title="Proses Order"
                                className="inline-flex items-center p-1.5 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                              >
                                <PlayCircle className="w-5 h-5" />
                              </button>
                            )}

                            {order.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "completed")
                                }
                                title="Selesaikan Order"
                                className="inline-flex items-center p-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}

                            {order.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "cancelled")
                                }
                                title="Batalkan Order"
                                className="inline-flex items-center p-1.5 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
                              >
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            )}

                            {/* Delete Button */}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
