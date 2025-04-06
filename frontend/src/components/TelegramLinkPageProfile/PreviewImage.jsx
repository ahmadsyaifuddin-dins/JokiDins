import { MessageCircle } from "lucide-react";

function PreviewImage() {
  return (
    <div className="mt-12 text-center">
      <h3 className="text-xl font-bold mb-6">
        Lihat Bagaimana Bot Telegram Bekerja
      </h3>
      <div className="flex justify-center">
        <div className="bg-gray-900/70 p-2 rounded-2xl shadow-xl inline-block">
          <div className="flex justify-center space-x-3">
            <div className="w-72 h-96 bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-700">
              <div className="h-16 bg-gray-700 flex items-center px-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">JokiDins Bot</div>
                  <div className="text-xs text-gray-400">online</div>
                </div>
              </div>
              <div className="p-3 h-80 overflow-hidden">
                <div className="bg-gray-700 rounded-lg rounded-tl-none p-2 mb-2 text-sm max-w-[85%] ml-1">
                  Hai, saya Bot JokiDins 😊
                </div>
                <div className="bg-blue-700 rounded-lg rounded-tr-none p-2 mb-2 text-sm max-w-[85%] ml-auto mr-1">
                  /start
                </div>
                <div className="bg-gray-700 rounded-lg rounded-tl-none p-2 mb-2 text-sm max-w-[85%] ml-1">
                  🎉 Selamat! Halo Nama mu! Akun Telegram kamu sudah
                  terhubung👍. Mulai sekarang, kamu akan menerima notifikasi
                  real-time tentang order dan update penting. Ketik /help untuk
                  melihat daftar perintah yang tersedia.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewImage;
