import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError('Gagal memuat data order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return labels[status] || status;
  };

  const handleDownloadFile = async (orderId) => {
    const token = localStorage.getItem('token');
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
      alert('Gagal mengunduh file');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-gray-200 rounded-lg"/>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Order</h1>
        <button
          onClick={() => navigate('/create-order')}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Buat Order Baru
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Belum ada order</p>
          <button
            onClick={() => navigate('/create-order')}
            className="text-blue-600 hover:text-blue-800"
          >
            Buat order pertama Anda
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {order.service}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {order.description || 'Tidak ada deskripsi'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">Deadline:</span>
                    <span className="font-medium">
                      {format(new Date(order.deadline), 'dd MMMM yyyy HH:mm', { locale: id })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  {order.file ? (
                    <button
                      onClick={() => handleDownloadFile(order._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Download File
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">Tidak ada file</span>
                  )}
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;