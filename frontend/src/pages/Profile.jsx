import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import {
  User,
  LogOut,
  Mail,
  Cake,
  Phone,
  Edit,
  Camera,
  Key,
  MessageSquare,
  Shield,
  Calendar,
  ChevronRight,
  RefreshCw,
  VenusAndMars,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import ProfileSkeleton from "../loader/ProfileSkeleton";

const Profile = () => {
  const { user: contextUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("https://jokidins-production.up.railway.app/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contextUser) {
      fetchProfile();
    }
  }, [contextUser]);

  if (!contextUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="bg-orange-50 text-orange-700 p-6 rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-semibold mb-2">Akses Terbatas</h3>
          <p>Silakan login terlebih dahulu untuk melihat profil Anda.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  if (loading || !profile) {
    return <ProfileSkeleton />;
  }

  // Format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl mb-6">
          {/* Header Background with Pattern */}
          <div className="relative h-56 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg
                className="h-full w-full"
                viewBox="0 0 800 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h800v400H0z" fill="none" />
                <path
                  d="M800 400V0H0v400h800ZM90 310a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-30a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-40a50 50 0 0 0 0-100 50 50 0 0 0 0 100Z"
                  fill="currentColor"
                  fillOpacity=".1"
                />
              </svg>
            </div>

            {/* Profile Avatar */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white shadow-md hover:bg-blue-700 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Badges */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
                  profile.isVerified
                    ? "bg-green-500 text-white"
                    : "bg-amber-400 text-white"
                }`}
              >
                {profile.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
              </div>
            </div>
          </div>

          {/* User Name & Basic Info */}
          <div className=" pt-8 pb-4 px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
            <p className="mt-1 text-gray-500 text-sm">
              Bergabung {formatDate(profile.createdAt)}
            </p>

            {/* User Status Overview */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-medium text-blue-600">Email</span>
                <span className="text-gray-700 text-sm font-semibold">
                  {profile.isVerified ? "Terverifikasi" : "Belum"}
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 mb-1" />
                <span className="text-xs font-medium text-purple-600">
                  Telegram
                </span>
                <span className="text-gray-700 text-sm font-semibold">
                  {profile.telegramChatId ? "Terhubung" : "Belum"}
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
                <Phone className="w-6 h-6 text-amber-600 mb-1" />
                <span className="text-xs font-medium text-amber-600">
                  Nomor HP
                </span>
                <span className="text-gray-700 text-sm font-semibold">
                  {profile.phones?.length || 0} Tersimpan
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg">
                <Key className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-medium text-emerald-600">
                  Login Via
                </span>
                <span className="text-gray-700 text-sm font-semibold capitalize">
                  {profile.loginMethod}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informasi Pribadi
              </h3>
              <button
                onClick={() => navigate("/update-profile")}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start border-b border-gray-100 pb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium truncate">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start border-b border-gray-100 pb-4">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Nomor HP Tersimpan
                  </p>
                  {profile.phones && profile.phones.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.phones.map((p, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Belum ada nomor HP tersimpan
                    </p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start border-b border-gray-100 pb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <VenusAndMars className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Jenis Kelamin
                  </p>
                  <p className="text-gray-800 font-medium">
                    {profile.gender || "Belum disetel"}
                  </p>
                </div>
              </div>

              {/* Birthday */}
              <div className="flex items-start">
                <div className="bg-pink-100 p-3 rounded-lg mr-4">
                  <Cake className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Tanggal Lahir
                  </p>
                  <p className="text-gray-800 font-medium">
                    {profile.birthday
                      ? formatDate(profile.birthday)
                      : "Belum disetel"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-5">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Informasi Akun
            </h3>

            <div className="space-y-4">
              {/* Account Type */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Tipe Akun</p>
                  <p className="font-medium capitalize">
                    {profile.role === "user" ? "Customer" : profile.role}
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  Aktif
                </div>
              </div>

              {/* Login Method */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Metode Login</p>
                  <p className="font-medium capitalize">
                    {profile.loginMethod}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              {/* Joined Date */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Bergabung Sejak</p>
                  <p className="font-medium">{formatDate(profile.createdAt)}</p>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>

              {/* Telegram Connection */}
              <div className="py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Terhubung ke Telegram</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {profile.telegramChatId
                      ? "Sudah Terhubung"
                      : "Belum Terhubung"}
                  </p>
                  <div
                    className={`ml-2 rounded-full h-3 w-3 ${
                      profile.telegramChatId
                        ? "bg-green-500 active-indicator"
                        : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Refresh Profile */}
            <button
              onClick={() => window.location.reload()}
              className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Perbarui Data
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => navigate("/update-profile")}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <Edit className="w-5 h-5" />
            <span className="font-semibold">Update Profile</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
