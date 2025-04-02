import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import PaymentListHeader from "../components/PaymentList/PaymentListHeader";
import PaymentListFilters from "../components/PaymentList/PaymentListFilters";
import PaymentListOrders from "../components/PaymentList/PaymentListOrders";
import PaymentListSummary from "../components/PaymentList/PaymentListSummary";

const PaymentList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentInputs, setPaymentInputs] = useState({});
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Helper: Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper: Get status badge element
  const getStatusBadge = (status) => {
    switch (status) {
      case "lunas":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Lunas
          </span>
        );
      case "dicicil":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Dicicil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-red-800">
            Belum Dibayar
          </span>
        );
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Gagal memuat data order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 800);
  };

  // Filter logic
  useEffect(() => {
    let result = [...orders];
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.packageName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((order) => order.paymentStatus === statusFilter);
    }
    if (dateRange.from || dateRange.to) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (dateRange.from && dateRange.to) {
          const fromDate = new Date(dateRange.from);
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59);
          return orderDate >= fromDate && orderDate <= toDate;
        } else if (dateRange.from) {
          return orderDate >= new Date(dateRange.from);
        } else if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59);
          return orderDate <= toDate;
        }
        return true;
      });
    }
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highestAmount") {
      result.sort((a, b) => b.fixedAmount - a.fixedAmount);
    } else if (sortBy === "lowestAmount") {
      result.sort((a, b) => a.fixedAmount - b.fixedAmount);
    }
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateRange, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({ from: "", to: "" });
    setSortBy("newest");
  };

  // Handlers for payment input and update
  const handleInputChange = (orderId, value) => {
    setPaymentInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const handlePaymentUpdate = async (orderId, fixedAmount, paymentAmount) => {
    const token = localStorage.getItem("token");
    const paymentValue = Number(paymentInputs[orderId]);
    if (isNaN(paymentValue) || paymentValue <= 0) {
      toast.error("Masukkan nominal pembayaran yang valid");
      return;
    }
    const remaining = fixedAmount - paymentAmount;
    if (paymentValue > remaining) {
      toast.error(`Pembayaran melebihi sisa pembayaran: ${formatCurrency(remaining)}`);
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/payment`,
        { payment: paymentValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pembayaran berhasil diupdate");
      setPaymentInputs((prev) => ({ ...prev, [orderId]: "" }));
      fetchOrders();
    } catch (err) {
      console.error("Error updating payment:", err);
      const errMsg = err.response?.data?.error || "Gagal memperbarui pembayaran";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PaymentListHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onBack={() => navigate(-1)}
        />
        <PaymentListFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          resetFilters={resetFilters}
        />
        <PaymentListOrders
          orders={filteredOrders}
          paymentInputs={paymentInputs}
          handleInputChange={handleInputChange}
          handlePaymentUpdate={handlePaymentUpdate}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          resetFilters={resetFilters}
        />
        <PaymentListSummary orders={filteredOrders} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
};

export default PaymentList;
