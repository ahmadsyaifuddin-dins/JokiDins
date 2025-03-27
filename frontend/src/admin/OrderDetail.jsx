import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  User,
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock4
} from "lucide-react";
import { formatDateDisplay, formatDeadlineDisplay } from "../utils/orderUtils";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(` https://jokidins-production.up.railway.app/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
      setSelectedStatus(res.data.status);
      setError(null);
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setError("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        ` https://jokidins-production.up.railway.app/api/orders/${orderId}/file`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order-${orderId}-file`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading file:", err);
      showError("Gagal mengunduh berkas");
    }
  };

  const handleStatusChange = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        ` https://jokidins-production.up.railway.app/api/orders/${orderId}`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status pesanan berhasil diperbarui");
      fetchOrderDetail();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Gagal memperbarui status pesanan");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: "Hapus pesanan?",
      text: "Anda tidak dapat mengembalikan pesanan ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });

    if (!confirmDelete.isConfirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(` https://jokidins-production.up.railway.app/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Pesanan berhasil dihapus.");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.erorr("Gagal menghapus pesanan.");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        bgColor: "bg-amber-50",
        label: "Menunggu",
        icon: <Clock4 className="h-5 w-5 text-amber-600 mr-2" />
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        bgColor: "bg-blue-50",
        label: "Diproses",
        icon: <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        bgColor: "bg-green-50",
        label: "Selesai",
        icon: <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        bgColor: "bg-red-50",
        label: "Dibatalkan",
        icon: <XCircle className="h-5 w-5 text-red-600 mr-2" />
      }
    };
    return configs[status] || { 
      color: "bg-gray-100 text-gray-800 border-gray-200", 
      bgColor: "bg-gray-50", 
      label: status,
      icon: <Clock className="h-5 w-5 text-gray-600 mr-2" />
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-700 font-medium">Memuat detail pesanan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center w-fit text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </button>
          
          <div className={`px-4 py-2 w-fit rounded-lg shadow-sm border ${statusConfig.color} flex items-center`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header Section with Accent Background */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="h-6 w-6 text-white opacity-90" />
                  <h1 className="text-2xl font-bold">
                    {order.service || "Detail Pesanan"}
                  </h1>
                </div>
                <div className="flex items-center text-blue-100">
                  <User className="h-5 w-5 mr-2 opacity-80" />
                  <span className="font-medium">{order.user?.email || "Email tidak tersedia"}</span>
                </div>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Order ID: {orderId}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Deskripsi Pesanan
                  </h2>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">
                      {order.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                {/* File Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Berkas Lampiran
                  </h2>
                  {order.file ? (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{order.file.originalName}</p>
                          <p className="text-sm text-gray-500">Klik tombol unduh untuk mengunduh berkas</p>
                        </div>
                        <div className="hidden md:block">
                          <button
                            onClick={handleDownloadFile}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Unduh Berkas
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                      <p className="text-gray-500">
                        Tidak ada berkas yang dilampirkan
                      </p>
                    </div>
                  )}
                  {order.file && (
                    <div className="block md:hidden mt-4">
                      <button
                        onClick={handleDownloadFile}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Unduh Berkas
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {/* Status Update Section */}
                <div className={`${statusConfig.bgColor} rounded-xl p-6 border border-gray-100 shadow-sm`}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    {statusConfig.icon}
                    Perbarui Status
                  </h2>
                  <div className="space-y-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="processing">Diproses</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                    <button
                      onClick={handleStatusChange}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Perbarui Status
                    </button>
                  </div>
                </div>

                {/* Deadlines and Timestamps */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Tenggat & Waktu
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2 text-amber-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">Tenggat Waktu</span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {formatDeadlineDisplay(order.deadline)}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2 text-blue-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">Dibuat pada</span>
                      </div>
                      <p className="text-gray-700">
                        {formatDateDisplay(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2 text-green-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">Terakhir diperbarui</span>
                      </div>
                      <p className="text-gray-700">
                        {formatDateDisplay(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Section */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-100 shadow-sm">
                  <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Tindakan Berbahaya
                  </h2>
                  <p className="text-red-600 mb-4 text-sm">
                    Perhatian: Tindakan ini tidak dapat dikembalikan dan akan menghapus pesanan secara permanen.
                  </p>
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Hapus Pesanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
