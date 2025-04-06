import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileSkeleton from "../loader/ProfileSkeleton";
import ProfileHeader from "../components/ProfileUser/ProfileHeader";
import ProfilePersonalInfo from "../components/ProfileUser/ProfilePersonalInfo";
import ProfileAccountInfo from "../components/ProfileUser/ProfileAccountInfo";
import ProfileActions from "../components/ProfileUser/ProfileActions";
import TelegramLinkPageProfile from "../components/TelegramLinkPageProfile";
import { API_BASE_URL } from '../config';
import { BellRing, AlertTriangle, X } from "lucide-react"; // Import icon components

const Profile = () => {
  const { user: contextUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTelegramBanner, setShowTelegramBanner] = useState(true);
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
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

  // Fungsi untuk update avatar
  const updateAvatar = (newAvatarUrl, isImmediate = false) => {
    if (isImmediate) {
      setProfile((prev) => ({ ...prev, avatar: newAvatarUrl }));
    } else {
      const separator = newAvatarUrl.includes("?") ? "&" : "?";
      setProfile((prev) => ({ ...prev, avatar: `${newAvatarUrl}${separator}t=${Date.now()}` }));
    }
  };

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
        {/* Enhanced Telegram Connection Banner */}
        {!profile.telegramChatId && showTelegramBanner && (
          <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-start">
              <div className="flex items-start">
                <BellRing className="w-6 h-6 text-white mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white">Aktifkan Notifikasi Telegram</h3>
                  <p className="text-blue-100 mt-1">
                    Dapatkan update pesanan real-time langsung ke Telegram kamu
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTelegramBanner(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="flex items-start mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Akun kamu belum terhubung dengan Telegram
                    </p>
                  </div>
                  <ul className="text-sm text-gray-600 ml-7 space-y-1 list-disc">
                    <li>Dapatkan notifikasi status pesanan secara real-time</li>
                    <li>Terima update promo dan informasi penting lainnya</li>
                    <li>Tidak akan melewatkan pesanan atau informasi penting</li>
                  </ul>
                </div>
                
                <div className="flex-shrink-0">
                  <Link to="/TelegramLinkPageProfile">
                    <button
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300"
                    >
                      Hubungkan Sekarang
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProfileHeader
          profile={profile}
          formatDate={formatDate}
          navigate={navigate}
          updateAvatar={updateAvatar}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfilePersonalInfo profile={profile} formatDate={formatDate} navigate={navigate} />
          <ProfileAccountInfo profile={profile} formatDate={formatDate} />
        </div>

        <ProfileActions navigate={navigate} />
      </div>
    </div>
  );
};

export default Profile;