import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import {
  User,
  LogOut,
  Mail,
  Users,
  Cake,
  Clock,
  Phone,
  Edit,
  Camera,
  Key,
  MessageSquare,
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
        const res = await axios.get(
          "https://jokidins-production.up.railway.app/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header Background with Pattern */}
          <div className="relative h-48 bg-gradient-to-r from-blue-800 to-indigo-900 overflow-hidden">
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
            <div className="absolute mt-8 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md hover:bg-blue-700 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* User Name & Role */}
          <div className="pt-20 px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
            <div className="mt-1 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="capitalize">
                {profile.role === "user" ? "Customer" : profile.role}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                <Mail className="w-6 h-6 text-blue-700" />
                <div className="truncate">
                  <p className="text-sm font-medium text-blue-700">Email</p>
                  <p className="text-gray-700 font-medium truncate max-w-[250px]">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                <Clock className="w-6 h-6 text-indigo-700" />
                <div>
                  <p className="text-sm font-medium text-indigo-700">
                    Bergabung sejak
                  </p>
                  <p className="text-gray-700 font-medium">
                    {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Saved Phone Numbers */}
              {profile.phones && profile.phones.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md md:col-span-2">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-700">
                      Nomor HP Tersimpan
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.phones.map((p, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Terverifikasi */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                <Mail className="w-6 h-6 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Email Terverifikasi
                  </p>
                  <p className="text-gray-700 font-medium">
                    {profile.isVerified ? "Sudah" : "Belum"}
                  </p>
                </div>
              </div>

              {/* Terhubung ke Telegram */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                <MessageSquare className="w-6 h-6 text-blue-700" />
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Terhubung ke Telegram
                  </p>
                  <p className="text-gray-700 font-medium">
                    {profile.telegramChatId ? "Sudah" : "Belum"}
                  </p>
                </div>
              </div>

              {/* Metode Login */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                <Key className="w-6 h-6 text-indigo-700" />
                <div>
                  <p className="text-sm font-medium text-indigo-700">
                    Metode Login
                  </p>
                  <p className="text-gray-700 font-medium capitalize">
                    {profile.loginMethod}
                  </p>
                </div>
              </div>

              {/* Gender */}
              {profile.gender && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                  <Users className="w-6 h-6 text-teal-700" />
                  <div>
                    <p className="text-sm font-medium text-teal-700">
                      Jenis Kelamin
                    </p>
                    <p className="text-gray-700 font-medium">{profile.gender}</p>
                  </div>
                </div>
              )}

              {/* Birthday */}
              {profile.birthday && (
                <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 transform transition-all duration-300 hover:shadow-md">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Cake className="w-6 h-6 text-pink-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-pink-700">
                      Tanggal Lahir
                    </p>
                    <p className="text-gray-700 font-medium">
                      {new Date(profile.birthday).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => navigate("/update-profile")}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Edit className="w-5 h-5" />
                <span>Update Profile</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Content or Stats (Optional) */}
        {/* ... */}
      </div>
    </div>
  );
};

export default Profile;
