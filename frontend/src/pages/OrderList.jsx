import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  FileText, 
  Download, 
  ExternalLink, 
  PlusCircle, 
  RefreshCw, 
  AlertCircle,
  Edit,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import OrderListSkeleton from '../loader/OrderListSkeleton';
import OrderListError from '../error/OrderListError';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        bgColor: 'bg-amber-50',
        icon: <Clock className="h-4 w-4" />,
        label: 'Menunggu'
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        bgColor: 'bg-blue-50',
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
        label: 'Diproses'
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        bgColor: 'bg-green-50',
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Selesai'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-50',
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Dibatalkan'
      }
    };
    return configs[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      bgColor: 'bg-gray-50',
      icon: <AlertCircle className="h-4 w-4" />,
      label: status 
    };
  };

  const handleDownloadFile = async (orderId) => {
    const token = localStorage.getItem('token');
    setDownloadingId(orderId);
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/file`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order-${orderId}-file`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Gagal mengunduh berkas');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDateDisplay = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getTimeDifference = (deadline) => {
    const now = new Date();
    const deadlineDate = parseISO(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Terlambat', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Hari ini', color: 'text-amber-600' };
    } else if (diffDays === 1) {
      return { text: 'Besok', color: 'text-amber-600' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} hari lagi`, color: 'text-amber-600' };
    } else {
      return { text: `${diffDays} hari lagi`, color: 'text-green-600' };
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedAndFilteredOrders = () => {
    return orders
      .filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false;
        }

        // Search filter
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
        // Sort logic
        if (sortBy === 'deadline') {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'status') {
          const statusOrder = { completed: 3, processing: 2, pending: 1, cancelled: 0 };
          const orderA = statusOrder[a.status] || 0;
          const orderB = statusOrder[b.status] || 0;
          return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
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
          onClick={() => navigate('/create-order')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Buat Pesanan Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua</option>
                  <option value="pending">Menunggu</option>
                  <option value="processing">Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Sort Button */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="deadline-asc">Deadline (Terdekat)</option>
                  <option value="deadline-desc">Deadline (Terjauh)</option>
                  <option value="createdAt-desc">Terbaru</option>
                  <option value="createdAt-asc">Terlama</option>
                  <option value="status-desc">Status (A-Z)</option>
                  <option value="status-asc">Status (Z-A)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sortedAndFilteredOrders().length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Belum ada pesanan {searchTerm && 'yang sesuai dengan pencarian'}</p>
          <button
            onClick={() => navigate('/create-order')}
            className="text-blue-600 hover:text-blue-800 flex items-center mx-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Buat pesanan pertama Anda
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">Menampilkan {sortedAndFilteredOrders().length} pesanan</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredOrders().map(order => {
              const statusConfig = getStatusConfig(order.status);
              const timeInfo = getTimeDifference(order.deadline);
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className={`${statusConfig.bgColor} px-4 py-3 border-b border-gray-200`}>
                    <div className="flex justify-between items-center">
                      <div className="line-clamp-1 font-semibold text-gray-900">
                        {order.service || 'Pesanan Tanpa Judul'}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
                        {order.description || 'Tidak ada deskripsi'}
                      </p>
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500 mr-2">Deadline:</span>
                        <span className="font-medium flex items-center">
                          {formatDateDisplay(order.deadline)} 
                          <span className={`ml-2 text-xs ${timeInfo.color}`}>({timeInfo.text})</span>
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/edit-order/${order._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center transition-colors"
                          title="Edit Pesanan"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        {order.file ? (
                          <button
                            onClick={() => handleDownloadFile(order._id)}
                            disabled={downloadingId === order._id}
                            className={`p-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center transition-colors ${
                              downloadingId === order._id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="Unduh Berkas"
                          >
                            {downloadingId === order._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </button>
                        ) : (
                          <div className="p-2 text-gray-400 flex items-center" title="Tidak ada berkas">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center group-hover:translate-x-1 transition-transform"
                      >
                        Detail
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
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