import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { ErrorIcon, Toaster, toast,  } from 'react-hot-toast';
import OrderEditSkeleton from '../loader/OrderEditSkeleton';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data order berdasarkan ID
  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const order = res.data;
        setService(order.service);
        setDescription(order.description);
        // Format deadline agar cocok dengan input type datetime-local (YYYY-MM-DDTHH:MM)
        const dt = new Date(order.deadline);
        const formattedDeadline = dt.toISOString().slice(0, 16);
        setDeadline(formattedDeadline);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Gagal memuat data order.");
        toast.error("Gagal memuat data order.", {
          icon: <ArrowLeft className="h-5 w-5 text-red-500" />
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle update order
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        service,
        description,
        deadline
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order berhasil diperbarui!", {
      });
      setTimeout(() => {
        navigate('/OrderList');
      }, 1500);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Gagal memperbarui order.", {
      });
    }
  };

  // Handle cancel order (ubah status menjadi "cancelled")
  const handleCancel = async () => {
    if (!window.confirm("Apakah kamu yakin ingin membatalkan order ini?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status: "cancelled"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order telah dibatalkan.", {
      });
      setTimeout(() => {
        navigate('/OrderList');
      }, 1500);
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Gagal membatalkan order.", {
      });
    }
  };

  // Render component
  if (loading) return <OrderEditSkeleton />;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#333333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem"
          }
        }}
      />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header dengan gradient */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4">
            <button
              onClick={() => navigate('/OrderList')}
              className="flex items-center text-white hover:text-blue-100 mb-4 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Daftar Pesanan</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Edit Order</h1>
            <p className="text-blue-100 mt-1">Perbarui detail order kamu di bawah ini</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Service Input */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Joki Apa
                </label>
                <input
                  id="service"
                  type="text"
                  placeholder="Bikin PPT, Bikin Aplikasi Web, dll"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-colors"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Joki
                </label>
                <textarea
                  id="description"
                  placeholder="Jelaskan detail kebutuhan kamu"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-colors resize-none"
                />
              </div>

              {/* Deadline Input */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (Tanggal & Waktu)
                </label>
                <input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-colors"
                />
              </div>

              {/* Tombol Update & Cancel */}
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <button
                  type="submit"
                  className="bg-blue-900 text-white py-2 px-4 rounded-lg 
                             hover:bg-blue-800 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Update Order
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg 
                             hover:bg-red-700 focus:outline-none focus:ring-2 
                             focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Batalkan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEdit;
