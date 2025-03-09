import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Platform = ({isVisible}) => {
  const platformCards = [
    {
      image: "/images/platform/pesanan-preview.png",
      title: "Review Pesanan Kamu",
      description:
        "Pantau progress dan kelola pesanan Anda dengan mudah melalui dashboard intuitif kami.",
      link: "/OrderList",
      linkText: "Lihat Pesanan",
      color: "blue",
      isExternal: false,
    },
    {
      image: "/images/platform/dinsSphere.png",
      title: "Project Progress",
      description:
        "Lihat perkembangan project secara real-time dan terperinci.",
      link: "https://dins-sphere.vercel.app",
      linkText: "Lihat Progress",
      color: "indigo",
      isExternal: true,
    },
    {
      image: "/images/platform/whatsapp_chat_dark.png",
      title: "Chat",
      description:
        "Diskusi langsung dengan tim kami untuk hasil yang maksimal.",
      link: "https://wa.me/6285849910396?text=Mau%20Joki%20Kak",
      linkText: "Mulai Chat",
      color: "green",
      isExternal: true,
    },
  ];

  return (
    <section id="platform-section" className="py-24 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-900/10 via-transparent to-transparent opacity-50"></div>

      <div
        className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 transform ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-indigo-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-indigo-900/10">
            Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Intip Platform Kami
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Temukan kemudahan dalam mengelola dan memantau progress proyek Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {platformCards.map((card, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-xl hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-500 transform hover:-translate-y-2"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/50 to-gray-900 opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-contain scale-105 group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay glow effect on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-${card.color}-500/20 to-${card.color}-600/20 transition-opacity duration-500`}
                ></div>
              </div>
              <div className="p-6 border-t border-gray-800">
                <h3
                  className={`text-xl font-bold text-white group-hover:text-${card.color}-400 transition-colors duration-300 mb-2`}
                >
                  {card.title}
                </h3>
                <p className="text-gray-400 mb-4">{card.description}</p>
                {card.isExternal ? (
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-${card.color}-400 hover:text-${card.color}-300 transition-colors group/link`}
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <Link
                    to={card.link}
                    className={`inline-flex items-center text-${card.color}-400 hover:text-${card.color}-300 transition-colors group/link`}
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platform;
