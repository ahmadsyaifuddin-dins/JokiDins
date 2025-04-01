// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardList, AlertCircle, RefreshCw, Search, Trash2, Trash2Icon } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import DashboardFilters from "./components/DashboardFilters";
import DashboardSort from "./components/DashboardSort";
import DashboardOrdersTable from "./components/DashboardOrdersTable";
import {
  filterOrders,
  getOrderStats,
  getStatusIcon,
  getStatusBadgeColor,
  getStatusLabel,
} from "../admin/utils/dashboardUtils";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleViewDetail = (orderId) => {
    navigate(`/admin/OrderDetail/${orderId}`);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(
        `Status order berhasil diubah menjadi: ${getStatusLabel(newStatus)}`,
        "success"
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      showNotification("Gagal memperbarui status order", "error");
    }
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = await Swal.fire({
      title: "Hapus order?",
      text: "Anda tidak dapat mengembalikan order ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });
    if (!confirmDelete.isConfirmed) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order berhasil dihapus");
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Gagal menghapus order");
    }
  };

  // Handler baru untuk hapus semua order
  const handleDeleteAll = async () => {
    const confirmDeleteAll = await Swal.fire({
      title: "Hapus semua order?",
      text: "Semua order akan dihapus. Tindakan ini tidak dapat diurungkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus Semua",
    });
    if (!confirmDeleteAll.isConfirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Semua order berhasil dihapus");
      fetchOrders();
    } catch (err) {
      console.error("Error deleting all orders:", err);
      toast.error("Gagal menghapus semua order");
    }
  };

  const showNotification = (message, type = "success") => {
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.className =
      type === "success"
        ? "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 flex items-center"
        : "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 flex items-center";
    const icon = document.createElement("span");
    icon.className = "mr-2";
    icon.innerHTML =
      type === "success"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    notification.prepend(icon);
    notification.style.display = "flex";
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)";
      setTimeout(() => {
        notification.style.display = "none";
      }, 300);
    }, 3000);
  };

  const filteredOrders = filterOrders(orders, searchTerm, filterStatus);
  const stats = getOrderStats(orders);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "deadline") {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Memuat data order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              Dashboard Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Selamat datang kembali! Kelola semua order yang masuk.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-4 py-2 
                bg-white hover:bg-gray-50 text-gray-700 font-medium 
                rounded-lg border border-gray-300 shadow-sm 
                transition-all duration-200 ease-in-out
                w-full sm:w-auto
                group"
            >
              <RefreshCw
                className={`w-5 h-5 transition-colors duration-200 
                  ${
                    refreshing
                      ? "animate-spin text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600"
                  }`}
              />
              <span className="hidden sm:inline">Muat Ulang</span>
            </button>
            <button
              onClick={handleDeleteAll}
              className="flex items-center justify-center gap-2 px-4 py-2 
                bg-red-600 hover:bg-red-700 text-white font-medium 
                rounded-lg border border-red-600 shadow-sm 
                transition-all duration-200 ease-in-out
                w-full sm:w-auto
                group"
            >
              <Trash2Icon className="w-5 h-5 text-white group-hover:animate-pulse" />
              <span className="hidden sm:inline">Hapus Semua Order</span>
            </button>
          </div>
        </div>

        <DashboardStats stats={stats} />

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-medium">Terjadi kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <DashboardFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              <DashboardSort
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />
            </div>
          </div>

          {sortedOrders.length === 0 ? (
            <div className="p-12 text-center border-t border-gray-200">
              <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Tidak ada order yang ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <DashboardOrdersTable
              filteredOrders={sortedOrders}
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
    </div>
  );
};

export default Dashboard;
