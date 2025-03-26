import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  ClipboardList,
  CreditCard,
  UserCheck,
  ServerCog,
  Wrench,
  Check,
} from "lucide-react";

const Timeline = () => {
  const timelineSteps = [
    {
      icon: ClipboardList,
      title: "Pesan Layanan",
      subtitle: "Pilih Layanan Favorit",
      description:
        "Tentukan layanan yang kamu butuhin, mulai dari konsultasi sampai solusi lainnya – gampang banget!",
      color: "#3B82F6", // Blue
    },
    {
      icon: CreditCard,
      title: "Konfirmasi Pembayaran",
      subtitle: "Transaksi Aman",
      description:
        "Pembayaran terenkripsi dengan beragam metode untuk keamanan maksimal, biar kamu tetap santai.",
      color: "#10B981", // Green
    },
    {
      icon: UserCheck,
      title: "Penentuan Profesional",
      subtitle: "Cocokkan dengan Ahli",
      description:
        "Tim ahli kami dipilih secara seksama untuk memastikan solusi yang tepat bagi kebutuhanmu.",
      color: "#6366F1", // Indigo
    },
    {
      icon: ServerCog,
      title: "Inisiasi Order",
      subtitle: "Persiapan Strategi",
      description:
        "Semua langkah awal sudah diatur dengan matang, mulai dari briefing hingga perencanaan strategi.",
      color: "#8B5CF6", // Purple
    },
    {
      icon: Wrench,
      title: "Proses Pengerjaan",
      subtitle: "Pantau Real-time",
      description:
        "Update langsung dari tim, pantau progres pengerjaan secara real-time tanpa ribet.",
      color: "#F43F5E", // Rose
    },
    {
      icon: Check,
      title: "Selesai & Verifikasi",
      subtitle: "Hasil Maksimal",
      description:
        "Verifikasi akhir untuk memastikan semua berjalan sesuai rencana dan kamu puas dengan hasilnya.",
      color: "#22C55E", // Emerald
    },
  ];

  return (
    <div className="bg-gray-950 text-white py-16 px-4">
      <div className="text-center mb-16">
        <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-blue-400 text-sm font-medium mb-4 inline-block shadow-lg shadow-blue-900/10">
          Timeline
        </span>
        <h2
          className="
        text-4xl md:text-5xl 
        font-bold 
        text-center 
        mb-6 
        bg-clip-text 
        text-transparent 
        bg-gradient-to-r 
        from-blue-400 
        to-indigo-500 
        py-2 
        leading-tight
      "
        >
          Perjalanan Layanan JokiDins
        </h2>
      </div>

      <VerticalTimeline
        layout="1-column-left"
        lineColor="#374151" // Dark gray line
      >
        {timelineSteps.map((step, index) => (
          <VerticalTimelineElement
            key={step.title}
            date={`Langkah ${index + 1}`}
            iconStyle={{
              background: step.color,
              color: "#ffffff",
              boxShadow: `0 0 0 4px ${step.color}40`, // Soft glow effect
            }}
            icon={<step.icon />}
            contentStyle={{
              background: "#1F2937", // Dark background
              color: "#ffffff",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "0.75rem",
              borderLeft: `4px solid ${step.color}`,
            }}
            contentArrowStyle={{
              borderRight: `7px solid ${step.color}`,
            }}
          >
            <h3 className="text-xl font-bold text-white">{step.title}</h3>
            <h4 className="text-sm text-gray-400 mb-2">{step.subtitle}</h4>
            <p className="text-gray-300">{step.description}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
