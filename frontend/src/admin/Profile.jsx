import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { User, LogOut, Mail, Users, Cake, Clock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import ProfileSkeleton from '../loader/ProfileSkeleton'; // Add this import

const Profile = () => {
  // Ambil user dari context
  const { user: contextUser } = useContext(AuthContext);
  
  // Bikin state "profile" buat data hasil fetch server
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Jika ingin fetch data terbaru dari server:
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
      }
    };

    // Bisa kasih kondisi, misal hanya fetch kalau contextUser ada
    if (contextUser) {
      fetchProfile();
    }
  }, [contextUser]);

  // Kalau user di context belum ada (belum login), handle di sini
  if (!contextUser) {
    return <div>Silakan login dulu.</div>;
  }

  // Jika masih nunggu fetch data dari server
  if (!profile) {
  return <ProfileSkeleton />;
}
  // Setelah profile didapat, tampilkan
  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500 capitalize mt-1">
                {profile.role === "user" ? "Customer" : profile.role}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-900" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700 font-medium md:truncate max-w-[250px]">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-900" />
              <div>
                <p className="text-sm text-gray-500">Bergabung sejak</p>
                <p className="text-gray-700 font-medium">
                  {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {profile.gender && (
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-900" />
                <div>
                  <p className="text-sm text-gray-500">Jenis Kelamin</p>
                  <p className="text-gray-700 font-medium">{profile.gender}</p>
                </div>
              </div>
            )}

            {profile.birthday && (
              <div className="flex items-center space-x-3">
                <Cake className="w-5 h-5 text-blue-900" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
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
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/update-profile")}
              className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-lg hover:bg-blue-950 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
