// PaymentStatusDashboard.jsx - with Revised Filter Logic
import React, { useEffect, useState } from "react";
import { ClipboardList, RefreshCw, List, Grid, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Header } from "./components/DashboardPayment/Header";
import { ErrorAlert } from "./components/DashboardPayment/ErrorAlert";
import { OrderTable } from "./components/DashboardPayment/OrderTable";
import { OrderGrid } from "./components/DashboardPayment/OrderGrid";
import { FixedAmountModal } from "./components/DashboardPayment/FixedAmountModal";
import { ViewToggle } from "./components/DashboardPayment/ViewToggle";
import { FilterPanel } from "./components/DashboardPayment/FilterPanel";
import {API_BASE_URL} from '../config';

const PaymentStatusDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: [],
    dateRange: {
      startDate: null,
      endDate: null
    },
    priceRange: {
      min: "",
      max: ""
    },
    hasFixedAmount: null // null = all, true = only with fixed amount, false = only without fixed amount
  });
  
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Fetch semua order dari backend
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
      setFilteredOrders(res.data);
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
  
  // Apply filters whenever filters state or orders change
  useEffect(() => {
    applyFilters();
  }, [filters, orders]);
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.paymentStatus.length > 0) count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.hasFixedAmount !== null) count++;
    
    setActiveFilterCount(count);
  }, [filters]);

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
        `${API_BASE_URL}/api/orders/${selectedOrderId}/fixed-amount`,
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
        `${API_BASE_URL}/api/orders/${orderId}`,
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

  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "grid" : "table");
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Update a specific filter field
  const updateFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      paymentStatus: [],
      dateRange: {
        startDate: null,
        endDate: null
      },
      priceRange: {
        min: "",
        max: ""
      },
      hasFixedAmount: null
    });
  };
  
  // Apply all filters to the orders - REVISED VERSION
  const applyFilters = () => {
    if (!orders || orders.length === 0) {
      setFilteredOrders([]);
      return;
    }
    
    let result = [...orders];
    
    // Apply search filter - REVISED for name, orderId, packageName
    if (filters.search && filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter(order => {
        // Convert all fields to strings with fallbacks
        const customerName = String(order.customerName || order.name || "").toLowerCase();
        const orderId = String(order.orderId || order._id || "").toLowerCase();
        const packageName = String(order.packageName || "").toLowerCase();
        
        return customerName.includes(searchLower) || 
               orderId.includes(searchLower) || 
               packageName.includes(searchLower);
      });
    }
    
    // Apply payment status filter
    if (filters.paymentStatus.length > 0) {
      result = result.filter(order => 
        filters.paymentStatus.includes(order.paymentStatus)
      );
    }
    
    // Apply date range filter
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      result = result.filter(order => {
        if (!order.createdAt) return false;
        
        const orderDate = new Date(order.createdAt);
        
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          return orderDate >= new Date(filters.dateRange.startDate) && 
                 orderDate <= new Date(filters.dateRange.endDate);
        } else if (filters.dateRange.startDate) {
          return orderDate >= new Date(filters.dateRange.startDate);
        } else if (filters.dateRange.endDate) {
          return orderDate <= new Date(filters.dateRange.endDate);
        }
        
        return true;
      });
    }
    
    // Apply price range filter - REVISED to use fixedAmount and paymentAmount
    if ((filters.priceRange.min !== "" && filters.priceRange.min !== null) || 
        (filters.priceRange.max !== "" && filters.priceRange.max !== null)) {
      
      result = result.filter(order => {
        // Get the appropriate amount based on what's available
        const fixedAmount = parseFloat(order.fixedAmount || 0);
        const paymentAmount = parseFloat(order.paymentAmount || 0);
        
        // Use the appropriate amount for comparison
        let amountToCompare = 0;
        if (fixedAmount > 0) {
          amountToCompare = fixedAmount;
        } else {
          amountToCompare = paymentAmount;
        }
        
        // Parse filter values as floats
        const minPrice = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const maxPrice = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        
        // Do the comparison
        return amountToCompare >= minPrice && amountToCompare <= maxPrice;
      });
    }
    
    // Apply fixed amount filter
    if (filters.hasFixedAmount !== null) {
      result = result.filter(order => {
        const fixedAmount = parseFloat(order.fixedAmount || 0);
        
        if (filters.hasFixedAmount) {
          return fixedAmount > 0;
        } else {
          return fixedAmount <= 0;
        }
      });
    }
    
    setFilteredOrders(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header 
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
        />

        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-700 mr-4">
              {filteredOrders.length} Order Ditemukan
            </h2>
            <button
              onClick={toggleFilters}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <Filter size={16} className="mr-2" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-indigo-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="ml-2 flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>
          <ViewToggle 
            viewMode={viewMode} 
            onToggle={toggleViewMode} 
          />
        </div>

        {showFilters && (
          <FilterPanel 
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
          />
        )}

        {error && <ErrorAlert message={error} />}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {viewMode === "table" ? (
            <OrderTable 
              orders={filteredOrders} 
              onStatusChange={handlePaymentStatusChange}
              onSetFixedAmount={handleSetFixedAmount}
              loading={loading}
            />
          ) : (
            <OrderGrid 
              orders={filteredOrders} 
              onStatusChange={handlePaymentStatusChange}
              onSetFixedAmount={handleSetFixedAmount}
              loading={loading}
            />
          )}
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

export default PaymentStatusDashboard;