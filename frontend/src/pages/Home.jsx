import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Book,
  Palette,
  ArrowRight,
  Clock,
  Star,
  Shield,
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Modern & Clean */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background dengan overlay gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/background.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-900/75"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 lg:p-12 max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <img
              src="/images/dinsy.jpg"
              alt="JokiDins Mascot"
              className="w-32 h-32 mx-auto rounded-full shadow-lg border-4 border-blue-100 mb-6"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
              JokiDins
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Solusi cerdas untuk tugas dan proyekmu. Kami hadir untuk membantu
              mewujudkan hasil terbaik!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-order">
                <button className="w-full sm:w-auto bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                  Order Joki
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="w-full sm:w-auto bg-white text-blue-900 px-8 py-3 rounded-lg font-medium border-2 border-blue-900 hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300">
                  Kontak Kami
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </section>

      {/* Features Section - With Icons & Better Visual Hierarchy */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-900 mb-4">
            Layanan Unggulan Kami
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan profesional untuk membantu
            menyelesaikan proyek dan tugas Anda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Website Development Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Pembuatan Website/WebApp
              </h3>
              <p className="text-gray-600">
                Website atau Web Application profesional dengan teknologi
                terkini untuk kebutuhan bisnis atau akademik Anda.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  Laravel
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  ReactJS
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  NextJS
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  NestJS
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  Svelte
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                 Solid JS
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                 Astro
                </span>
              </div>
            </div>

            {/* Academic Tasks Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Tugas Akademik
              </h3>
              <p className="text-gray-600">
                Bantuan profesional untuk tugas pemrograman, makalah, dan
                presentasi dengan kualitas terjamin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  PPT
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Makalah
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Merapikan Word
                </span>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Merapikan Excel
                </span>
              </div>
            </div>

            {/* Design Card */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                Desain Grafis
              </h3>
              <p className="text-gray-600">
                Desain kreatif untuk kebutuhan branding dan marketing material
                Anda.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Poster
                </span>
                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Banner
                </span>
                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Logo
                </span>
                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Kalender
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section - Modern Cards with Hover Effects */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-900 mb-4">
            Intip Platform Kami
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Temukan kemudahan dalam mengelola dan memantau progress proyek Anda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pesanan Preview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src="/images/platform/pesanan-preview.png"
                  alt="Dashboard"
                  className="w-full h-48 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Review Pesanan Kamu
                </h3>
                <p className="text-gray-600 mb-4">
                  Pantau progress dan kelola pesanan Anda dengan mudah melalui
                  dashboard intuitif kami.
                </p>
                <Link
                  to="/OrderList"
                  className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Lihat Pesanan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Progress Preview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src="/images/platform/dinsSphere.png"
                  alt="Progress"
                  className="w-full h-48 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Project Progress
                </h3> 
                <p className="text-gray-600 mb-4">
                  Lihat perkembangan project secara real-time dan terperinci.
                </p>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://dins-sphere.vercel.app",
                      "_blank",
                      "noopener noreferrer"
                    );
                  }}
                  className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Lihat Progress
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src="/images/platform/whatsapp_chat_dark.png"
                  alt="Chat"
                  className="w-full h-48 object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Chat</h3>
                <p className="text-gray-600 mb-4">
                  Diskusi langsung dengan tim kami untuk hasil yang maksimal.
                </p>
                <a
                  href={`https://wa.me/6285849910396?text=Mau%20Joki%20Kak`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Mulai Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Mengapa Memilih JokiDins?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tepat Waktu</h3>
              <p className="text-blue-100">
                Pengerjaan cepat dengan hasil maksimal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kualitas Terjamin</h3>
              <p className="text-blue-100">
                Hasil kerja profesional dan terpercaya
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aman & Terpercaya</h3>
              <p className="text-blue-100">Kerahasiaan data Anda terjamin</p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/create-order">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
