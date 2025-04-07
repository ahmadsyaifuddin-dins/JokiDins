import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";
import OrderDetailHeader from "../components/OrderDetail/OrderDetailHeader";
import OrderDescription from "../components/OrderDetail/OrderDescription";
import OrderDeadline from "../components/OrderDetail/OrderDeadline";
import OrderAttachment from "../components/OrderDetail/OrderAttachment";
import OrderTimeline from "../components/OrderDetail/OrderTimeline";
import OrderTimestamps from "../components/OrderDetail/OrderTimestamps";
import OrderPaymentInfo from "../components/OrderDetail/OrderPaymentInfo";
import { API_BASE_URL } from "../config";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    const token = localStorage.getItem("token");
    setIsDownloading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/${orderId}/file`,
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
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Gagal mengunduh berkas");
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        lightColor: "bg-amber-50",
        icon: <AlertCircle className="h-5 w-5" />,
        label: "Menunggu",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        lightColor: "bg-blue-50",
        icon: <RefreshCw className="h-5 w-5 animate-spin" />,
        label: "Sedang Diproses",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        lightColor: "bg-green-50",
        icon: <AlertCircle className="h-5 w-5" />,
        label: "Selesai",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        lightColor: "bg-red-50",
        icon: <AlertCircle className="h-5 w-5" />,
        label: "Dibatalkan",
      },
    };
    return (
      configs[status] || {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        lightColor: "bg-gray-50",
        icon: <AlertCircle className="h-5 w-5" />,
        label: status,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 w-32 rounded" />
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 space-y-4">
              <div className="h-8 bg-gray-200 w-2/3 rounded" />
              <div className="h-4 bg-gray-200 w-24 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/OrderList")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Pesanan
          </button>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex flex-col md:flex-row items-center justify-center md:justify-between shadow-sm">
            <div className="flex items-center mb-4 md:mb-0">
              <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={fetchOrder}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate("/OrderList")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali ke Daftar Pesanan</span>
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
          <OrderDetailHeader order={order} orderId={orderId} statusConfig={statusConfig} />

          <div className="p-4 md:p-6 space-y-6">
            <OrderDescription description={order.description} />
            <OrderDeadline deadline={order.deadline} />
            <OrderPaymentInfo order={order} />
            <OrderTimeline order={order} />
            <OrderAttachment
              order={order}
              handleDownloadFile={handleDownloadFile}
              isDownloading={isDownloading}
            />
            <OrderTimestamps order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
