import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy HH:mm', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data);
      setEditedOrder(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Gagal memuat detail order');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order-${id}-file`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Gagal mengunduh file');
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, editedOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(editedOrder);
      setIsEditing(false);
      alert('Order berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Gagal memperbarui order');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus order ini?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order berhasil dihapus!');
      navigate('/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Gagal menghapus order');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 w-1/3 rounded"/>
          <div className="h-48 bg-gray-200 rounded-lg"/>
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
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Kembali ke Daftar Order
        </button>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedOrder(order);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editedOrder.service}
                  onChange={(e) => setEditedOrder({...editedOrder, service: e.target.value})}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                order.service
              )}
            </h1>
            {isEditing ? (
              <select
                value={editedOrder.status}
                onChange={(e) => setEditedOrder({...editedOrder, status: e.target.value})}
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
              {isEditing ? (
                <textarea
                  value={editedOrder.description}
                  onChange={(e) => setEditedOrder({...editedOrder, description: e.target.value})}
                  className="border rounded px-3 py-2 w-full min-h-[100px]"
                />
              ) : (
                <p className="text-gray-600">{order.description}</p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Deadline</h2>
              {isEditing ? (
                <input
                  type="date"
                  value={editedOrder.deadline.split('T')[0]}
                  onChange={(e) => setEditedOrder({...editedOrder, deadline: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              ) : (
                <p className="text-gray-600">
                  {formatDate(order.deadline)}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">File</h2>
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

            <div>
              <h2 className="text-lg font-semibold mb-2">Informasi Tambahan</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Dibuat pada</p>
                  <p className="font-medium">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Terakhir diupdate</p>
                  <p className="font-medium">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;