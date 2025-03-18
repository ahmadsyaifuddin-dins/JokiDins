import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Hourglass, 
  X 
} from "lucide-react";

/**
 * Fungsi untuk memfilter order berdasarkan kata kunci dan status
 */
export const filterOrders = (orders, searchTerm, filterStatus) => {
  return orders.filter((order) => {
    // Filter berdasarkan status
    const statusMatch = filterStatus === "all" || order.status === filterStatus;

    // Filter berdasarkan kata kunci
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = order.customerName?.toLowerCase().includes(searchLower);
    const idMatch = order._id?.toLowerCase().includes(searchLower);
    const emailMatch = order.customerEmail?.toLowerCase().includes(searchLower);
    const descMatch = order.description?.toLowerCase().includes(searchLower);
    const keywordMatch = searchTerm === "" || nameMatch || idMatch || emailMatch || descMatch;

    return statusMatch && keywordMatch;
  });
};

/**
 * Fungsi untuk menghitung statistik order
 */
export const getOrderStats = (orders) => {
  const total = orders.length;
  const pending = orders.filter((order) => order.status === "pending").length;
  const processing = orders.filter((order) => order.status === "processing").length;
  const completed = orders.filter((order) => order.status === "completed").length;
  const cancelled = orders.filter((order) => order.status === "cancelled").length;

  return {
    total,
    pending,
    processing,
    completed,
    cancelled,
  };
};

/**
 * Fungsi untuk mendapatkan ikon status
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return Clock;
    case "processing":
      return Hourglass;
    case "completed":
      return CheckCircle;
    case "cancelled":
      return AlertTriangle;
    default:
      return X;
  }
};

/**
 * Fungsi untuk mendapatkan warna badge status
 */
export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Fungsi untuk mendapatkan label status
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Menunggu";
    case "processing":
      return "Dikerjakan";
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return "Tidak Diketahui";
  }
};