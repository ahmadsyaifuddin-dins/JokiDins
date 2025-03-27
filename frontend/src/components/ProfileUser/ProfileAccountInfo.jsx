import React from "react";
import { Shield, ChevronRight, Calendar, RefreshCw, Monitor } from "lucide-react";

const ProfileAccountInfo = ({ profile, formatDate }) => {
  return (
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
              {profile.role === "user" ? "Kostumer" : profile.role}
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
            <p className="font-medium capitalize">{profile.loginMethod}</p>
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
              {profile.telegramChatId ? "Terhubung" : "Belum Terhubung"}
            </p>
            <div className="flex items-center">
              {profile.telegramChatId && (
                <span className="text-xs text-green-600 mr-2 font-medium">
                  Terkoneksi
                </span>
              )}
              <div
                className={`rounded-full h-4 w-4 ${
                  profile.telegramChatId ? "bg-green-500" : "bg-gray-300"
                }`}
                style={
                  profile.telegramChatId
                    ? {
                        animation: "pulse-animation 0.7s infinite",
                        boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      }
                    : {}
                }
              ></div>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Browser</p>
              <p className="font-medium">
                {profile.deviceInfo?.browser || "Tidak diketahui"}
              </p>
            </div>
            <Monitor className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Sistem Operasi</p>
              <p className="font-medium">
                {profile.deviceInfo?.os || "Tidak diketahui"}
              </p>
            </div>
            <Monitor className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Platform</p>
              <p className="font-medium">
                {profile.deviceInfo?.platform || "Tidak diketahui"}
              </p>
            </div>
            <Monitor className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Refresh Profile Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Perbarui Data
      </button>
    </div>
  );
};

export default ProfileAccountInfo;
