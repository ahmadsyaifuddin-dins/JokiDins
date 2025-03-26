import { Book, Code, Palette } from "lucide-react";
import React from "react";

const Services = ({ isVisible }) => {
  const serviceCards = [
        {
          icon: <Code className="w-7 h-7 text-blue-400" />,
          title: "Web & Aplikasi Web Profesional",
          description:
            "Website dan aplikasi web yang responsif dan kekinian, dirancang khusus buat mendongkrak bisnismu. Gak ribet, tapi tetap profesional sesuai banget buat bisnis, kampus, atau organisasi kamu",
          tags: ["Laravel", "ReactJS", "VueJS", "NextJS", "NestJS", "Svelte", "Astro"],
          color: "blue",
          bgFrom: "from-blue-900/20",
          bgTo: "to-indigo-900/20",
          tagBg: "bg-blue-950/70",
          tagText: "text-blue-400",
          iconBg: "bg-blue-900/30",
        },
        {
          icon: <Book className="w-7 h-7 text-green-400" />,
          title: "Tugas Akademik",
          description:
            "Dari coding, makalah, sampai presentasi, kami siap bantu dengan solusi yang tepat dan berkualitas. Fokus pada hasil, tanpa basa-basi biar tugas kamu kelar dengan hasil maksimal",
          tags: ["PPT", "Makalah", "Rapikan Word", "Rapikan Excel"],
          color: "green",
          bgFrom: "from-green-900/20",
          bgTo: "to-teal-900/20",
          tagBg: "bg-green-950/70",
          tagText: "text-green-400",
          iconBg: "bg-green-900/30",
        },
        {
          icon: <Palette className="w-7 h-7 text-purple-400" />,
          title: "Desain Grafis",
          description:
            "Ciptain identitas visual yang nendang buat brand kamu! Mulai dari logo sampai marketing material, desain kami menggabungkan kreativitas dan sentuhan modern yang bikin kamu beda dari yang lain",
          tags: ["Poster", "Banner", "Logo", "Kalender"],
          color: "purple",
          bgFrom: "from-purple-900/20",
          bgTo: "to-pink-900/20",
          tagBg: "bg-purple-950/70",
          tagText: "text-purple-400",
          iconBg: "bg-purple-900/30",
        },
      ];

  return (
    <section id="services-section" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-50"></div>

      {/* Enhanced floating elements */}
      <div className="absolute top-1/3 left-1/6 w-8 h-8 bg-blue-500 rounded-full animate-float opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/5 w-6 h-6 bg-indigo-500 rounded-full animate-float-delayed opacity-50"></div>
      <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-blue-400 rounded-full animate-float-slow opacity-40"></div>

      <div
        className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 transform ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`} 
      >
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-blue-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-blue-900/10">
            Layanan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 py-2 leading-tight">
            Layanan Unggulan Kami
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan profesional untuk membantu
            menyelesaikan proyek dan tugas Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceCards.map((card, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow-xl hover:shadow-${card.color}-900/20 transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card.bgFrom} ${card.bgTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <div
                className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <h3
                className={`text-2xl font-bold text-white mb-4 relative group-hover:text-${card.color}-400 transition-colors duration-300`}
              >
                {card.title}
              </h3>
              <p className="text-gray-400 mb-6 relative">{card.description}</p>
              <div className="flex flex-wrap gap-2 relative">
                {card.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`text-sm ${card.tagBg} ${card.tagText} px-3 py-1 rounded-full border border-gray-700 group-hover:border-${card.color}-500/30 transition-colors duration-300`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;