// AlreadyConnectedSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Gift, MessageCircle, Check } from "lucide-react";

const AlreadyConnectedSection = () => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Surprise Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl overflow-hidden border border-indigo-500/30 transform transition-all duration-500 hover:scale-105">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-indigo-600/30 rounded-full flex items-center justify-center">
              <Gift className="w-12 h-12 text-indigo-300" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center mb-4">
            Kejutan Untukmu!
          </h3>
          <p className="text-indigo-200 text-center mb-6">
            Terima kasih telah menggunakan layanan notifikasi Telegram kami!
            Sebagai apresiasi, kami berikan diskon 5% untuk order berikutnya.
          </p>
          <div className="bg-indigo-800/50 border border-indigo-600/30 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-indigo-300 mb-2">Gunakan kode promo:</p>
              <p className="text-2xl font-mono font-bold text-white">TELE5</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders/new"
              className="flex-1 bg-gray-500 text-gray-300 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg opacity-50 cursor-not-allowed"
            >
              Buat Order Baru
            </Link>
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-500 text-gray-300 hover:text-gray-300 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center border border-gray-500 opacity-50 cursor-not-allowed"
            >
              Putuskan Koneksi Telegram
            </button>
          </div>
        </div>
      </div>

      {/* Connected Telegram Preview */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold mb-6">
          Status Koneksi Telegram Anda
        </h3>
        <div className="flex justify-center">
          <div className="bg-gray-900/70 p-2 rounded-2xl shadow-xl inline-block">
            <div className="w-72 bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-700 pb-4">
              <div className="h-16 bg-gray-700 flex items-center px-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">JokiDins Bot</div>
                  <div className="text-xs text-green-400 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    Terhubung
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-600/20 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-bold mb-1">Koneksi Aktif</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Anda akan menerima notifikasi order dan update terbaru
                </p>
                <div className="text-xs text-gray-500">
                  Terhubung sejak: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlreadyConnectedSection;
