import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, User, Calendar, Trash } from "lucide-react";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        // Pastikan endpoint detail sesuai, misal GET /api/user/users/:id
        const res = await axios.get(`https://jokidins-production.up.railway.app/api/user/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail user:", err);
        setError("Gagal mengambil detail user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus akun pengguna ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://jokidins-production.up.railway.app/api/user/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Akun pengguna berhasil dihapus!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      alert("Gagal menghapus user.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Memuat detail user...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/admin/users")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Kembali ke Daftar Pengguna
      </button>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          {userDetail.avatar ? (
            <img
              src={userDetail.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {userDetail.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold">{userDetail.name}</h2>
          <p className="text-gray-600 capitalize">
            {userDetail.role === "user" ? "Kostumer" : userDetail.role}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-700" />
            <div>
              <p className="text-sm font-medium text-blue-700">Email</p>
              <p className="text-gray-700">{userDetail.email}</p>
            </div>
          </div>
          {/* Nomor HP */}
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-purple-700" />
            <div>
              <p className="text-sm font-medium text-purple-700">Nomor HP</p>
              <p className="text-gray-700">
                {userDetail.phones && userDetail.phones.length > 0
                  ? userDetail.phones.join(", ")
                  : "Not available"}
              </p>
            </div>
          </div>
          {/* User ID */}
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-green-700" />
            <div>
              <p className="text-sm font-medium text-green-700">ID Pengguna</p>
              <p className="text-gray-700">{userDetail._id}</p>
            </div>
          </div>
          {/* Join Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-indigo-700" />
            <div>
              <p className="text-sm font-medium text-indigo-700">Bergabung sejak</p>
              <p className="text-gray-700">
                {new Date(userDetail.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center space-x-2"
          >
            <Trash className="w-5 h-5" />
            <span>Hapus Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
