import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { useEffect } from "react";

const DashboardUser = () => {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/login");
    }
  }, [user, navigate]);

  const orders = [
    { id: 1, task: "Pembuatan Website", status: "Progress" },
    { id: 2, task: "Tugas Algoritma", status: "Selesai" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard User</h2>
      
      <Link to="/order" className="bg-green-600 text-white px-4 py-2 rounded-md">
        + Buat Pesanan Baru
      </Link>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Daftar Pesanan</h3>
        <div className="border p-4 rounded-md shadow-md bg-white">
          {orders.length === 0 ? (
            <p>Belum ada pesanan.</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className="p-2 border-b">
                  {order.task} - <span className="font-bold">{order.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
