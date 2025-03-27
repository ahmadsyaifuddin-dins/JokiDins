import React, { useRef, useState } from "react";
import { Mail, MessageSquare, Phone, Key, Camera } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileHeader = ({
  profile,
  formatDate,
  navigate,
  updateAvatar = () => {},
}) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarPreview, setLocalAvatarPreview] = useState(null);

  // Trigger file input ketika tombol kamera diklik
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Fungsi untuk membersihkan preview
  const clearAvatarPreview = () => {
    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
      setLocalAvatarPreview(null);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler file input untuk upload avatar
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (misalnya 1.5MB)
    const maxSizeInBytes = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > maxSizeInBytes) {
      toast.error("Ukuran file terlalu besar. Maksimal 1.5MB.");
      clearAvatarPreview();
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("Bro, pilih file gambar ya!");
      clearAvatarPreview();
      return;
    }

    // Buat preview lokal sebelum upload
    const objectUrl = URL.createObjectURL(file);
    setLocalAvatarPreview(objectUrl);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://jokidins-production.up.railway.app/avatar/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (res.data && res.data.url) {
        // Panggil updateAvatar dengan parameter tambahan
        updateAvatar(res.data.url, true);
        toast.success("Avatar berhasil diupload!");
        
        // Bersihkan preview lokal
        clearAvatarPreview();
      }
    } catch (error) {
      console.error("Upload avatar gagal:", error);
      
      // Kembalikan tampilan avatar asli dan hapus preview
      clearAvatarPreview();

      const errorMsg =
        error.response?.data?.details ||
        error.response?.data?.error ||
        "Upload avatar gagal! Cek koneksi atau file yang diupload.";

      if (
        error.response?.status === 400 &&
        (error.response?.data?.details?.includes("melebihi batas") ||
          error.response?.data?.error?.includes("melebihi batas"))
      ) {
        toast.error("Ukuran file terlalu besar. Maksimal 1.5MB.");
      } else {
        toast.error(errorMsg);
      }
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
            {/* Gunakan preview lokal jika ada, jika tidak gunakan avatar dari profile */}
            {localAvatarPreview || profile.avatar ? (
              <img
                src={localAvatarPreview || profile.avatar}
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

        {/* Bagian lain tetap sama */}
      </div>
    </div>
  );
};

export default ProfileHeader;