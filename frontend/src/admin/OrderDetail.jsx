import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from '../config';

// Component imports
import OrderDetailHeader from "../admin/components/OrderDetail/OrderDetailHeader";
import OrderStatusSection from "../admin/components/OrderDetail/OrderStatusSection";
import OrderDescription from "../admin/components/OrderDetail/OrderDescription";
import OrderAttachments from "../admin/components/OrderDetail/OrderAttachments";
import OrderTimelines from "../admin/components/OrderDetail/OrderTimelines";
import OrderDangerZone from "../admin/components/OrderDetail/OrderDangerZone";
import OrderPaymentInfo from "../admin/components/OrderDetail/OrderPaymentInfo";
import ErrorMessage from "../admin/common/ErrorMessage";
import LoadingSpinner from "../admin/common/LoadingSpinner";

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
      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
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
    } catch (err) {
      console.error("Error downloading file:", err);
      setError("Gagal mengunduh berkas");
    }
  };

  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}`,
        { status: newStatus || selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedStatus(newStatus || selectedStatus);
      fetchOrderDetail();
      return true;
    } catch (err) {
      console.error("Error updating status:", err);
      return false;
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/dashboard");
      return true;
    } catch (err) {
      console.error("Error deleting order:", err);
      return false;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat detail pesanan..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onBack={() => navigate("/admin/dashboard")} 
      />
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - 8 columns on large screens */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Section */}
            <OrderDetailHeader 
              order={order} 
              orderId={orderId} 
            />

            {/* Description Section */}
            <OrderDescription description={order.description} />

            {/* File Attachment Section */}
            <OrderAttachments 
              file={order.file} 
              handleDownloadFile={handleDownloadFile} 
            />

            {/* Payment Information */}
            <OrderPaymentInfo order={order} />
          </div>

          {/* Sidebar - 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Management */}
            <OrderStatusSection 
              status={order.status}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              handleStatusChange={handleStatusChange}
            />

            {/* Timeline Information */}
            <OrderTimelines 
              deadline={order.deadline}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />

            {/* Danger Zone */}
            <OrderDangerZone handleDelete={handleDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;