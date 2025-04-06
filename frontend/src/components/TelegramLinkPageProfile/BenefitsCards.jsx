// BenefitsCards.jsx
import React from "react";
import { Bell, MessageCircle, Clock } from "lucide-react";

const BenefitsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 shadow-lg border border-blue-800/30 hover:translate-y-[-5px] transition-all duration-300">
        <Bell className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Notifikasi Real-time</h3>
        <p className="text-gray-300">
          Dapatkan update status pesanan secara instan tanpa perlu membuka website
        </p>
      </div>
      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 shadow-lg border border-blue-800/30 hover:translate-y-[-5px] transition-all duration-300">
        <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Komunikasi Mudah</h3>
        <p className="text-gray-300">
          Terhubung langsung dengan tim support kami melalui platform Telegram
        </p>
      </div>
      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 shadow-lg border border-blue-800/30 hover:translate-y-[-5px] transition-all duration-300">
        <Clock className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Hemat Waktu</h3>
        <p className="text-gray-300">
          Akses informasi pesanan kapan saja tanpa perlu login ke website
        </p>
      </div>
    </div>
  );
};

export default BenefitsCards;
