import React from "react";
import { Clock, RefreshCcw, CheckCircle, XCircle } from "lucide-react";

/**
 * Filter orders berdasarkan searchTerm dan filterStatus.
 */
export const filterOrders = (orders, searchTerm, filterStatus) => {
  return orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      (order.service && order.service.toLowerCase().includes(searchLower)) ||
      (order.user?.email &&
        order.user.email.toLowerCase().includes(searchLower)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchLower));
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
};

/**
 * Hitung statistik order.
 */
export const getOrderStats = (orders) => ({
  total: orders.length,
  pending: orders.filter((o) => o.status === "pending").length,
  processing: orders.filter((o) => o.status === "processing").length,
  completed: orders.filter((o) => o.status === "completed").length,
  cancelled: orders.filter((o) => o.status === "cancelled").length,
});

/**
 * Mengembalikan ikon status.
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "processing":
      return <RefreshCcw className="w-4 h-4 text-blue-600" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

/**
 * Mengembalikan kelas warna badge berdasarkan status.
 */
export const getStatusBadgeColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border border-blue-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border border-gray-200";
};

/**
 * Mengembalikan label status yang friendly.
 */
export const getStatusLabel = (status) => {
  const labels = {
    pending: "Menunggu",
    processing: "Diproses",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status] || status;
};
