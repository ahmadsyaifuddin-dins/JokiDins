import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ProfileSkeleton from "../loader/ProfileSkeleton";
import ProfileHeader from "../components/ProfileUser/ProfileHeader";
import ProfilePersonalInfo from "../components/ProfileUser/ProfilePersonalInfo";
import ProfileAccountInfo from "../components/ProfileUser/ProfileAccountInfo";
import ProfileActions from "../components/ProfileUser/ProfileActions";
import { API_BASE_URL } from '../config';

const Profile = () => {
  const { user: contextUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Inject style animasi pulse
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse-animation {
        0% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
        }
        70% {
          box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Jika belum login
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

  // Fungsi format tanggal
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
        <ProfileHeader profile={profile} formatDate={formatDate} navigate={navigate} />

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
