import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, FileText, Package, Download } from 'lucide-react';

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy HH:mm', { locale: localeID });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
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
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}/file`,
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
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Menunggu'
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Sedang Diproses'
      },
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Selesai'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Dibatalkan'
      }
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 w-32 rounded" />
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-8 bg-gray-200 w-2/3 rounded" />
              <div className="h-4 bg-gray-200 w-24 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-4">
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            {error}
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
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Pesanan
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-gray-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {order.service || 'Detail Pesanan'}
                </h1>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${statusConfig.color}`}>
                {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Deskripsi Pesanan</h2>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                {order.description || 'Tidak ada deskripsi'}
              </p>
            </div>

            {/* Deadline */}
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">Tenggat Waktu</h2>
              <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-4">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                {formatDateTime(order.deadline)}
              </div>
            </div>

            {/* File */}
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
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

            {/* Timestamps */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;