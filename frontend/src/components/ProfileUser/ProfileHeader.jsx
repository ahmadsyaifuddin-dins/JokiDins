import React, { useRef, useState } from "react";
import { Mail, MessageSquare, Phone, Key, Camera } from "lucide-react";
import axios from "axios";

const ProfileHeader = ({ profile, formatDate, navigate, updateAvatar = () => {} }) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Trigger file input ketika tombol kamera di klik
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Handler file input untuk upload avatar
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Bro, pilih file gambar ya!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file); // Pastikan field 'photo' sesuai di backend

    try {
      setIsUploading(true);
      // Panggil endpoint upload di backend dengan onUploadProgress
      const res = await axios.post("https://jokidins-production.up.railway.app/avatar/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      if (res.data && res.data.url) {
        updateAvatar(res.data.url);
        alert("Avatar berhasil diupload!");
      }
    } catch (error) {
      console.error("Upload avatar gagal:", error);
      alert("Upload avatar gagal!");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl mb-6">
      {/* Header Background */}
      <div className="relative h-56 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
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
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Camera className="w-5 h-5" />
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Upload Progress Indicator */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Status Badge */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-md ${
              profile.isVerified ? "bg-green-500 text-white" : "bg-amber-400 text-white"
            }`}
          >
            {profile.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
          </div>
        </div>
      </div>

      {/* User Name & Info */}
      <div className="pt-8 pb-4 px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
        <p className="mt-1 text-gray-500 text-sm">Bergabung {formatDate(profile.createdAt)}</p>
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
            <span className="text-xs font-medium text-purple-600">Telegram</span>
            <span className="text-gray-700 text-sm font-semibold">
              {profile.telegramChatId ? "Terhubung" : "Belum"}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
            <Phone className="w-6 h-6 text-amber-600 mb-1" />
            <span className="text-xs font-medium text-amber-600">Nomor HP</span>
            <span className="text-gray-700 text-sm font-semibold">
              {profile.phones?.length || 0} Tersimpan
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg">
            <Key className="w-6 h-6 text-emerald-600 mb-1" />
            <span className="text-xs font-medium text-emerald-600">Login Via</span>
            <span className="text-gray-700 text-sm font-semibold capitalize">
              {profile.loginMethod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
