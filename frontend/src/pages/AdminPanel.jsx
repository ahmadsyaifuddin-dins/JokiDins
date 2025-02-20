import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { useState } from "react";
const AdminPanel = () => {
  const [orders, setOrders] = useState([
    { id: 1, task: "Pembuatan Website", customer: "Ahmad", status: "Progress" },
    { id: 2, task: "Tugas Algoritma", customer: "Siti", status: "Pending" },
  ]);

  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>
      
      <div className="border p-4 rounded-md shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-2">Daftar Pesanan</h3>
        {orders.length === 0 ? (
          <p>Tidak ada pesanan.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Pesanan</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="text-center">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.task}</td>
                  <td className="p-2 border">{order.customer}</td>
                  <td className="p-2 border">
                    <select
                      className="border p-1"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Progress">Progress</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
