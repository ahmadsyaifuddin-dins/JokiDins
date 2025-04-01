import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const PaymentList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentInputs, setPaymentInputs] = useState({});
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
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

  // Handle perubahan input nominal pembayaran untuk tiap order
  const handleInputChange = (orderId, value) => {
    setPaymentInputs(prev => ({
      ...prev,
      [orderId]: value,
    }));
  };

  // Handle submit pembayaran per order
  const handlePaymentUpdate = async (orderId, fixedAmount, paymentAmount) => {
    const token = localStorage.getItem("token");
    const paymentValue = Number(paymentInputs[orderId]);
    if (isNaN(paymentValue) || paymentValue <= 0) {
      toast.error("Masukkan nominal pembayaran yang valid");
      return;
    }

    const remaining = fixedAmount - paymentAmount;
    if (paymentValue > remaining) {
      toast.error(`Pembayaran melebihi sisa pembayaran: ${remaining}`);
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/payment`,
        { payment: paymentValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Pembayaran berhasil diupdate");
      // Reset input payment untuk order ini
      setPaymentInputs(prev => ({
        ...prev,
        [orderId]: "",
      }));
      // Refresh order list
      fetchOrders();
    } catch (err) {
      console.error("Error updating payment:", err);
      const errMsg = err.response?.data?.error || "Gagal memperbarui pembayaran";
      toast.error(errMsg);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Daftar Pembayaran Order Joki</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">Belum ada order joki yang ditemukan.</p>
        ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Paket</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Fixed Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Sudah Dibayar</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Sisa</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Bayar Sekarang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => {
                const remaining = order.fixedAmount - order.paymentAmount;
                return (
                  <tr key={order._id}>
                    <td className="py-3 px-4">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.packageName}</td>
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(order.fixedAmount)}
                    </td>
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(order.paymentAmount)}
                    </td>
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(remaining)}
                    </td>
                    <td className="py-3 px-4 capitalize">{order.paymentStatus}</td>
                    <td className="py-3 px-4">
                      {order.paymentStatus !== "lunas" && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={paymentInputs[order._id] || ""}
                            onChange={e => handleInputChange(order._id, e.target.value)}
                            placeholder="Nominal"
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                            min="1"
                            max={remaining}
                          />
                          <button
                            onClick={() =>
                              handlePaymentUpdate(order._id, order.fixedAmount, order.paymentAmount)
                            }
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      )}
                      {order.paymentStatus === "lunas" && (
                        <span className="text-green-600 font-semibold">Terlunaskan</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default PaymentList;
