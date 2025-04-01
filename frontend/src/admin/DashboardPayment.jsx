// DashboardPayment.jsx
import React, { useEffect, useState } from "react";
import { ClipboardList, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Header } from "./components/DashboardPayment/Header";
import { ErrorAlert } from "./components/DashboardPayment/ErrorAlert";
import { OrderTable } from "./components/DashboardPayment/OrderTable";
import { FixedAmountModal } from "./components/DashboardPayment/FixedAmountModal";

const API_BASE_URL = "https://jokidins-production.up.railway.app/api";

const DashboardPayment = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch semua order dari backend
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Gagal memuat data order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 800);
  };

  // Fungsi untuk mengupdate fixedAmount
  const handleSetFixedAmount = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const submitFixedAmount = async (fixedAmount) => {
    if (!selectedOrderId) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/orders/${selectedOrderId}/fixed-amount`,
        { fixedAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Fixed amount updated & notifikasi email terkirim!");
      fetchOrders();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating fixed amount:", err);
      toast.error("Gagal mengupdate fixed amount");
    }
  };

  // Handler untuk mengubah paymentStatus
  const handlePaymentStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_BASE_URL}/orders/${orderId}`,
        { paymentStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status pembayaran diubah menjadi ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error("Gagal memperbarui status pembayaran");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
        />

        {error && <ErrorAlert message={error} />}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <OrderTable 
            orders={orders} 
            onStatusChange={handlePaymentStatusChange}
            onSetFixedAmount={handleSetFixedAmount}
            loading={loading}
          />
        </div>
      </div>

      <FixedAmountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitFixedAmount}
      />
    </div>
  );
};

export default DashboardPayment;