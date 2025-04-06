// TelegramLinkPageProfile.jsx
import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useUserProfile } from "../hooks/orderCreate/useUserProfile";
import ConfettiEffect from "../components/TelegramLinkPageProfile/ConfettiEffect";
import AlreadyConnectedSection from "../components/TelegramLinkPageProfile/AlreadyConnectedSection";
import BenefitsCards from "../components/TelegramLinkPageProfile/BenefitsCards";
import TokenGeneratorCard from "../components/TelegramLinkPageProfile/TokenGeneratorCard";
import PreviewImage from "../components/TelegramLinkPageProfile/PreviewImage";

const TelegramLinkPageProfile = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { isTelegramLinked, isCheckingTelegram } = useUserProfile();

  useEffect(() => {
    document.title = "Hubungkan Telegram | JokiDins";
    if (isTelegramLinked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    // Cleanup saat unmount
    return () => {
      setShowConfetti(false);
    };
  }, [isTelegramLinked]);

  if (isCheckingTelegram) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-lg text-gray-300">
            Mengecek status koneksi Telegram...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <ConfettiEffect showConfetti={showConfetti} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isTelegramLinked
              ? "🎉 Akun Anda Sudah Terhubung dengan Telegram!"
              : "Hubungkan JokiDins dengan Telegram"}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {isTelegramLinked
              ? "Anda telah berhasil menghubungkan akun JokiDins dengan Telegram dan akan menerima notifikasi secara real-time"
              : "Dapatkan notifikasi order dan update terbaru langsung ke aplikasi Telegram Anda"}
          </p>
        </div>
        {isTelegramLinked ? (
          <AlreadyConnectedSection />
        ) : (
          <>
            <BenefitsCards />
            <TokenGeneratorCard />
            <PreviewImage/>
          </>
        )}
      </div>
    </div>
  );
};

export default TelegramLinkPageProfile;
