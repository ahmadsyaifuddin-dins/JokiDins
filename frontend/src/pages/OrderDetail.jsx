import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const OrderDetail = () => {
  const { id: orderId } = useParams(); // rename param "id" -> "orderId"
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ganti nama "id" → "localeID" agar tidak bentrok
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: localeID });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

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
      setError('Gagal memuat detail order');
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
      alert('Gagal mengunduh file');
    }
  };

  // Badge warna status
  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 w-1/3 rounded" />
          <div className="h-48 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tombol kembali ke daftar order */}
      <button
        onClick={() => navigate('/orders')}
        className="text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Kembali ke Daftar Order
      </button>

      {/* Konten Detail Order */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Service name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {order.service || 'Detail Order'}
        </h1>

        {/* Status */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Deskripsi</h2>
          <p className="text-gray-600">{order.description}</p>
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Deadline</h2>
          <p className="text-gray-600">{formatDate(order.deadline)}</p>
        </div>

        {/* File */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">File</h2>
          {order.file ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{order.file.originalName}</span>
              <button
                onClick={handleDownloadFile}
                className="text-blue-600 hover:text-blue-800"
              >
                Download
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada file yang dilampirkan</p>
          )}
        </div>

        {/* Info Tambahan */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Dibuat pada</p>
              <p className="font-medium">{formatDateTime(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Terakhir diupdate</p>
              <p className="font-medium">{formatDateTime(order.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
