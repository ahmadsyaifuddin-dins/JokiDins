import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen animate-pulse">
      <div className="max-w-3xl mx-auto">
        {/* Card Profil */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300">
          {/* Bagian Header (background) */}
          <div className="relative h-48 bg-gray-300 overflow-hidden">
            {/* Placeholder pattern (opsional) */}
            <div className="absolute inset-0 opacity-20">
              {/* SVG kosong atau pattern sederhana */}
              <svg className="h-full w-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h800v400H0z" fill="none" />
                <path
                  d="M800 400V0H0v400h800ZM90 310a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-30a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-40a50 50 0 0 0 0-100 50 50 0 0 0 0 100Z"
                  fill="currentColor"
                  fillOpacity=".1"
                />
              </svg>
            </div>
            {/* Avatar di tengah (absolute) */}
            <div className="absolute mt-8 left-1/2 transform -translate-x-1/2">
              <div className="relative w-32 h-32 rounded-full bg-gray-400 border-4 border-white shadow-lg flex items-center justify-center">
                {/* Inisial placeholder */}
                <div className="text-4xl font-bold text-white">&nbsp;</div>
              </div>
              {/* Tombol kamera placeholder */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-400 rounded-full shadow-md"></div>
            </div>
          </div>

          {/* Nama & Role (tengah) */}
          <div className="pt-20 px-8 text-center">
            {/* Placeholder untuk nama */}
            <div className="mx-auto h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            {/* Placeholder untuk role */}
            <div className="mx-auto h-4 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Detail Profil */}
          <div className="px-8 py-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              {/* Bergabung Sejak */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              {/* Nomor HP Tersimpan */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4 md:col-span-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                </div>
              </div>
              {/* Gender / Birthday (opsional) */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
