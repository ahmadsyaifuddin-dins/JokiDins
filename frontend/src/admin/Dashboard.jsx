import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardList, AlertCircle } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import DashboardFilters from "./components/DashboardFilters";
import DashboardOrdersTable from "./components/DashboardOrdersTable";
import {
  filterOrders,
  getOrderStats,
  getStatusIcon,
  getStatusBadgeColor,
  getStatusLabel,
} from "../admin/utils/dashboardUtils";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get("https://jokidins-production.up.railway.app/api/orders", {
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

  const handleViewDetail = (orderId) => {
    navigate(`/admin/OrderDetail/${orderId}`);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `https://jokidins-production.up.railway.app/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      await axios.delete(`https://jokidins-production.up.railway.app/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  // Gunakan fungsi dari dashboardUtils untuk filtering dan statistik
  const filteredOrders = filterOrders(orders, searchTerm, filterStatus);
  const stats = getOrderStats(orders);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div id="notification" className="hidden"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-blue-900" />
            Dashboard Admin
          </h1>
          <p className="mt-2 text-gray-600">Kelola semua order yang masuk</p>
        </div>

        <DashboardStats stats={stats} />

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            Tidak ada order yang ditemukan.
          </div>
        ) : (
          <DashboardOrdersTable
            filteredOrders={filteredOrders}
            getStatusBadgeColor={getStatusBadgeColor}
            getStatusIcon={getStatusIcon}
            getStatusLabel={getStatusLabel}
            handleViewDetail={handleViewDetail}
            handleStatusChange={handleStatusChange}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
