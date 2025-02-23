import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { ArrowLeft, Download, AlertTriangle, Clock, Calendar, FileText, User, Package } from "lucide-react";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMMM yyyy", { locale: localeID });
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMMM yyyy HH:mm", { locale: localeID });
    } catch (err) {
      console.error("Error formatting dateTime:", err);
      return dateString;
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
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
        `http://localhost:5000/api/orders/${orderId}/file`,
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
      alert("Gagal mengunduh berkas");
    }
  };

  const handleStatusChange = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Status pesanan berhasil diperbarui menjadi: ${selectedStatus}`);
      fetchOrderDetail();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Gagal memperbarui status pesanan");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Pesanan berhasil dihapus!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Gagal menghapus pesanan");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        label: "Menunggu"
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Diproses"
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Selesai"
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Dibatalkan"
      }
    };
    return configs[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: status };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Memuat...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="h-5 w-5 text-gray-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {order.service || "Detail Pesanan"}
                  </h1>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  <span>{order.user?.email || "Email tidak tersedia"}</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${statusConfig.color}`}>
                {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Status Update Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Perbarui Status</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="pending">Menunggu</option>
                  <option value="processing">Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
                <button
                  onClick={handleStatusChange}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Perbarui
                </button>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Deskripsi Pesanan</h2>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                {order.description || "Tidak ada deskripsi"}
              </p>
            </div>

            {/* Deadline Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Tenggat Waktu</h2>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                {formatDate(order.deadline)}
              </div>
            </div>

            {/* File Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Berkas Lampiran</h2>
              {order.file ? (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{order.file.originalName}</span>
                  </div>
                  <button
                    onClick={handleDownloadFile}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Unduh
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 rounded-lg p-4">
                  Tidak ada berkas yang dilampirkan
                </p>
              )}
            </div>

            {/* Timestamps Section */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Dibuat pada
                </div>
                <p className="font-medium">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Terakhir diperbarui
                </div>
                <p className="font-medium">{formatDateTime(order.updatedAt)}</p>
              </div>
            </div>

            {/* Delete Section */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hapus Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;