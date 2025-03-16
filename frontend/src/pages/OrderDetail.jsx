import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Package, Download, CheckCircle, AlertCircle, Loader, RefreshCw, ArrowLeft } from 'lucide-react';
import { formatDateDisplay, formatDeadlineDisplay, getTimeDifference, getCompletionTimeDifference } from '../utils/orderUtils';

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get(`https://jokidins-production.up.railway.app/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Gagal memuat detail pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    const token = localStorage.getItem('token');
    setIsDownloading(true);
    try {
      const response = await axios.get(
        `https://jokidins-production.up.railway.app/api/orders/${orderId}/file`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

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
      setIsDownloading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        lightColor: 'bg-amber-50',
        icon: <Clock className="h-5 w-5" />,
        label: 'Menunggu'
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        lightColor: 'bg-blue-50',
        icon: <RefreshCw className="h-5 w-5 animate-spin" />,
        label: 'Sedang Diproses'
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        lightColor: 'bg-green-50',
        icon: <CheckCircle className="h-5 w-5" />,
        label: 'Selesai'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        lightColor: 'bg-red-50',
        icon: <AlertCircle className="h-5 w-5" />,
        label: 'Dibatalkan'
      }
    };
    return configs[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      lightColor: 'bg-gray-50',
      icon: <AlertCircle className="h-5 w-5" />,
      label: status 
    };
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
            onClick={() => navigate('/OrderList')}
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

  const renderTimelineItem = (date, icon, title, description) => (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="rounded-full bg-blue-500 p-2 text-white">
          {icon}
        </div>
        <div className="h-full w-px bg-blue-200 my-1"></div>
      </div>
      <div className="pb-6">
        <p className="text-sm text-gray-500">{date}</p>
        <p className="font-medium text-gray-900">{title}</p>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button
          onClick={() => navigate('/OrderList')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali ke Daftar Pesanan</span>
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
          {/* Header Section */}
          <div className={`${statusConfig.lightColor} border-b border-gray-200 p-4 md:p-6`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Package className="h-6 w-6 text-gray-700" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
                  {order.service || 'Detail Pesanan'}
                </h1>
              </div>
              <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${statusConfig.color} self-start md:self-auto`}>
                <span className="flex-shrink-0">{statusConfig.icon}</span>
                <span className="font-medium">{statusConfig.label}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              ID Pesanan: <span className="font-mono font-medium text-gray-700">{orderId}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 md:p-6 space-y-6">
            {/* Deskripsi Pesanan */}
            <div className="transition-all hover:shadow-md rounded-xl">
              <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="inline-block w-1 h-4 bg-blue-500 mr-2 rounded"></span>
                Deskripsi Pesanan
              </h2>
              <div className="text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
                {order.description ? (
                  <p className="whitespace-pre-line">{order.description}</p>
                ) : (
                  <p className="italic text-gray-400">Tidak ada deskripsi</p>
                )}
              </div>
            </div>

            {/* Tenggat Waktu */}
            <div className="transition-all hover:shadow-md rounded-xl">
              <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="inline-block w-1 h-4 bg-amber-500 mr-2 rounded"></span>
                Tenggat Waktu
              </h2>
              <div className="flex items-center text-gray-600 bg-amber-50 rounded-xl p-4 border border-amber-100">
                <Calendar className="h-5 w-5 mr-3 text-amber-500" />
                <div>
                  <span className="font-medium">{formatDeadlineDisplay(order.deadline)}</span>
                  <span className={`ml-2 font-medium ${getTimeDifference(order.deadline).color}`}>
                    ({getTimeDifference(order.deadline).text})
                  </span>
                </div>
              </div>
            </div>

            {/* Berkas Lampiran */}
            <div className="transition-all hover:shadow-md rounded-xl">
              <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="inline-block w-1 h-4 bg-purple-500 mr-2 rounded"></span>
                Berkas Lampiran
              </h2>
              {order.file ? (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                        <FileText className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 break-words">{order.file.originalName}</p>
                        {order.file.size && (
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(order.file.size / 1024)} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadFile}
                      disabled={isDownloading}
                      className={`inline-flex items-center px-4 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isDownloading ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Mengunduh...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Unduh Berkas
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
                  <p className="italic text-gray-400">Tidak ada berkas yang dilampirkan</p>
                </div>
              )}
            </div>

            {/* Riwayat Pesanan */}
            <div className="transition-all hover:shadow-md rounded-xl">
              <h2 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="inline-block w-1 h-4 bg-blue-500 mr-2 rounded"></span>
                Riwayat Pesanan
              </h2>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="space-y-0">
                  {renderTimelineItem(
                    formatDateDisplay(order.createdAt),
                    <Package className="h-4 w-4" />,
                    "Pesanan Dibuat",
                    "Pesanan telah berhasil dibuat dan menunggu untuk diproses"
                  )}
                  
                  {order.status === 'processing' && renderTimelineItem(
                    formatDateDisplay(order.updatedAt),
                    <RefreshCw className="h-4 w-4" />,
                    "Sedang Diproses", 
                    "Pesanan Anda sedang dikerjakan oleh tim kami"
                  )}
                  
                  {order.status === 'completed' && (
                    <>
                      {renderTimelineItem(
                        "Dalam Proses",
                        <RefreshCw className="h-4 w-4" />,
                        "Sedang Diproses", 
                        "Pesanan Anda sedang dikerjakan oleh tim kami"
                      )}
                      {renderTimelineItem(
                        formatDateDisplay(order.updatedAt),
                        <CheckCircle className="h-4 w-4" />,
                        "Pesanan Selesai", 
                        `Pesanan Anda telah berhasil diselesaikan (${getCompletionTimeDifference(order).text})`
                      )}
                    </>
                  )}
                  
                  {order.status === 'cancelled' && renderTimelineItem(
                    formatDateDisplay(order.updatedAt),
                    <AlertCircle className="h-4 w-4" />,
                    "Pesanan Dibatalkan", 
                    "Pesanan ini telah dibatalkan"
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Dibuat pada
                </div>
                <p className="font-medium text-gray-800">
                  {formatDateDisplay(order.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  Terakhir diperbarui
                </div>
                <p className="font-medium text-gray-800">{formatDateDisplay(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
