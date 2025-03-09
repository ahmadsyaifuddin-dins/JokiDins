import React from "react";
import {
  ArrowRight,
  Clock,
  MessageSquare,
  Shield,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = ({ isVisible, scrollY }) => {

  const featureCards = [
    {
      icon: <Clock className="w-8 h-8 text-blue-400" />,
      title: "Tepat Waktu",
      description:
        "Pengerjaan cepat dengan hasil maksimal. Deadline? Kami jamin selesai sesuai kesepakatan.",
      gradient: "from-blue-600 to-indigo-600",
      iconBg: "bg-blue-900/20",
    },
    {
      icon: <Star className="w-8 h-8 text-indigo-400" />,
      title: "Kualitas Terjamin",
      description:
        "Hasil kerja profesional dan terpercaya. Kami mengutamakan kualitas dalam setiap project.",
      gradient: "from-indigo-600 to-purple-600",
      iconBg: "bg-indigo-900/20",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Aman & Terpercaya",
      description:
        "Kerahasiaan data Anda terjamin. Privasi dan keamanan menjadi prioritas kami.",
      gradient: "from-purple-600 to-pink-600",
      iconBg: "bg-purple-900/20",
    },
  ];

  return (
        <section id="features-section" className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950/10 to-gray-950"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="w-full h-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                transform: `translateY(${scrollY * 0.05}px)`,
              }}
            ></div>
          </div>
          <div
            className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Konten fitur */}
            <div className="text-center mb-16">
              <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-blue-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-blue-900/10">
                Keunggulan
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Mengapa Memilih JokiDins?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Kualitas dan profesionalisme adalah prioritas utama kami
              </p>
            </div>
            {/* Mapping feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  className="relative group"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
                  ></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm ring-1 ring-gray-800 rounded-lg p-8 hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div
                      className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {card.title}
                    </h3>
                    <p className="text-gray-400">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Tombol CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              <Link to="/create-order" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-1">
                    Order Joki Sekarang
                    <ArrowRight className="w-5 h-5 self-center group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    Kontak Kami
                    <MessageSquare className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      );
    };

export default Features;
