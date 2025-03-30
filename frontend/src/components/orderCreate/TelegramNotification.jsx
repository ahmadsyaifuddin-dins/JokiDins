import React from 'react';
import { Check, Send } from 'lucide-react';
import TelegramLinkButton from '../TelegramLinkButton';

const TelegramNotification = ({ isCheckingTelegram, isTelegramLinked, onLinked }) => {
  if (isCheckingTelegram) return null;

  if (isTelegramLinked) {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center">
        <div className="bg-green-500 rounded-full p-1 mr-3">
          <Check className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-green-800 font-medium">
            Telegram sudah terhubung! Kamu akan menerima notifikasi status order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg transition-all">
      <div className="relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
        </div>
        <div className="relative p-6">
          <div className="flex items-start">
            <div className="hidden md:block bg-white bg-opacity-20 p-3 rounded-full mr-4">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">
                Aktifkan Notifikasi Telegram
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Dapatkan update real-time status order langsung ke Telegram kamu.
              </p>
              <div className="mt-2">
                <TelegramLinkButton onLinked={onLinked} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramNotification;