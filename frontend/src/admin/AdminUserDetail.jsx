import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Trash, 
  ArrowLeft, 
  Check, 
  X, 
  Shield, 
  Clock, 
  ExternalLink, 
  Send,
  SendIcon
} from "lucide-react";

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
        const res = await axios.get(
          `https://jokidins-production.up.railway.app/api/user/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    const confirmDelete = await Swal.fire({
      title: "Hapus akun pengguna?",
      text: "Anda tidak dapat mengembalikan akun pengguna ini setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://jokidins-production.up.railway.app/api/user/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Berhasil!", "Akun pengguna berhasil dihapus.", "success");
      navigate("/admin/users");
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      Swal.fire("Gagal", "Gagal menghapus user.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat detail user...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="bg-red-100 p-4 rounded-full inline-block">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">Error</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Kembali ke Daftar Pengguna
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="text-blue-600 hover:text-blue-800 transition flex items-center space-x-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar Pengguna</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center space-x-2 font-medium border border-red-200"
          >
            <Trash className="w-5 h-5" />
            <span>Hapus Akun</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header Section with Colored Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              {userDetail.avatar ? (
                <img
                  src={userDetail.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-xl border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-blue-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md">
                  {userDetail.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute top-6 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              <span className="capitalize flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                {userDetail.role === "user" ? "Kostumer" : userDetail.role}
              </span>
            </div>
          </div>

          {/* User Info Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{userDetail.name}</h1>
                <p className="text-gray-500 mt-1">ID: {userDetail._id}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">
                  Bergabung pada {formatDate(userDetail.createdAt)}
                </span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

            {/* User Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Email */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Email</span>
                </div>
                <p className="text-gray-800 break-all pl-2 border-l-2 border-blue-200">
                  {userDetail.email}
                </p>
                <div className="mt-4 flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center 
                    ${userDetail.isVerified 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"}`}
                  >
                    {userDetail.isVerified 
                      ? <><Check className="w-3 h-3 mr-1" /> Terverifikasi</> 
                      : <><X className="w-3 h-3 mr-1" /> Belum Terverifikasi</>}
                  </div>
                </div>
              </div>

              {/* Nomor HP */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Nomor HP</span>
                </div>
                <p className="text-gray-800 pl-2 border-l-2 border-purple-200">
                  {userDetail.phones && userDetail.phones.length > 0
                    ? userDetail.phones.join(", ")
                    : "Tidak tersedia"}
                </p>
              </div>

              {/* Telegram Account */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <SendIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Telegram</span>
                </div>
                <div className="pl-2 border-l-2 border-blue-200">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center
                    ${userDetail.telegramChatId 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"}`}
                  >
                    {userDetail.telegramChatId 
                      ? <><Check className="w-3 h-3 mr-1" /> Terhubung</> 
                      : <><X className="w-3 h-3 mr-1" /> Tidak Terhubung</>}
                  </div>
                  {userDetail.telegramChatId && (
                    <p className="mt-2 text-gray-600 text-sm">
                      Chat ID: {userDetail.telegramChatId}
                    </p>
                  )}
                </div>
              </div>

              {/* Login Method */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-700">Metode Login</span>
                </div>
                <div className="pl-2 border-l-2 border-indigo-200">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {userDetail.loginMethod || "Email/Password"}
                    {userDetail.googleId && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        Google ID: {userDetail.googleId}
                      </span>
                    )}       
                  </span>
                </div>
              </div>

              {/* Created At */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-700">Tanggal Bergabung</span>
                </div>
                <p className="text-gray-800 pl-2 border-l-2 border-amber-200">
                  {formatDate(userDetail.createdAt)}
                </p>
              </div>

              {/* Updated At (if available) */}
              {userDetail.updatedAt && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Terakhir Diperbarui</span>
                  </div>
                  <p className="text-gray-800 pl-2 border-l-2 border-green-200">
                    {formatDate(userDetail.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <button
                disabled
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed"
              >
                Edit Profil Pengguna
              </button>
              <button
                disabled
                className="w-full sm:w-auto border border-blue-200 text-blue-600 px-6 py-3 rounded-lg opacity-50 cursor-not-allowed"
              >
                Lihat Aktivitas Pengguna
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;