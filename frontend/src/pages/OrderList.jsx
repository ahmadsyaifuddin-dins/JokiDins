import React, { useEffect, useState } from "react";
import { Package, PlusCircle, Clock, RefreshCw, CheckCircle, AlertCircle, FilePlus2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderListSkeleton from "../loader/OrderListSkeleton";
import OrderListError from "../error/OrderListError";
import OrderListHeader from "../components/OrderList/OrderListHeader";
import OrderCard from "../components/OrderList/OrderCard";
import { getTimeDifference, getCompletionTimeDifference } from "../utils/orderUtils";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(" https://jokidins-production.up.railway.app/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Gagal memuat data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        bgColor: "bg-amber-50",
        icon: <Clock className="h-4 w-4" />,
        label: "Menunggu",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        bgColor: "bg-blue-50",
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        label: "Diproses",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        bgColor: "bg-green-50",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Selesai",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        bgColor: "bg-red-50",
        icon: <AlertCircle className="h-4 w-4" />,
        label: "Dibatalkan",
      },
    };
    return (
      configs[status] || {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        bgColor: "bg-gray-50",
        icon: <AlertCircle className="h-4 w-4" />,
        label: status,
      }
    );
  };

  const handleDownloadFile = async (orderId) => {
    const token = localStorage.getItem("token");
    setDownloadingId(orderId);
    try {
      const response = await axios.get(` https://jokidins-production.up.railway.app/api/orders/${orderId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order-${orderId}-file`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Gagal mengunduh berkas");
    } finally {
      setDownloadingId(null);
    }
  };

  const sortedAndFilteredOrders = () => {
    return orders
      .filter((order) => {
        // Filter berdasarkan status
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false;
        }
        // Filter berdasarkan search
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            (order.service && order.service.toLowerCase().includes(searchLower)) ||
            (order.description && order.description.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "createdAt") {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "status") {
          const statusOrder = { completed: 3, processing: 2, pending: 1, cancelled: 0 };
          const orderA = statusOrder[a.status] || 0;
          const orderB = statusOrder[b.status] || 0;
          return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
        }
        return 0;
      });
  };

  if (loading) {
    return <OrderListSkeleton />;
  }

  if (error) {
    return <OrderListError error={error} fetchOrders={fetchOrders} />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-2 text-blue-600" />
              Daftar Pesanan
            </h1>
            <p className="text-gray-500 mt-1">Kelola semua pesanan Anda di satu tempat</p>
          </div>
          <button
            onClick={() => navigate("/orderCreate")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
          >
            <FilePlus2 className="h-5 w-5 mr-2" />
            Buat Pesanan Baru
          </button>
        </div>

        <OrderListHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />

        {sortedAndFilteredOrders().length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Belum ada pesanan {searchTerm && "yang sesuai dengan pencarian"}
            </p>
            <button
              onClick={() => navigate("/orderCreate")}
              className="text-blue-600 hover:text-blue-800 flex items-center mx-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Buat pesanan pertama Anda
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Menampilkan {sortedAndFilteredOrders().length} pesanan
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedAndFilteredOrders().map((order) => {
                const timeInfo =
                  order.status === "completed" && order.completedAt
                    ? getCompletionTimeDifference(order)
                    : getTimeDifference(order.deadline);
                return (
                  <OrderCard
                    key={order._id}
                    order={order}
                    getStatusConfig={getStatusConfig}
                    timeInfo={timeInfo}
                    downloadingId={downloadingId}
                    handleDownloadFile={handleDownloadFile}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
