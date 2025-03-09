import { CheckCircle, Clock, MessageSquare, Users } from "lucide-react";
import React from "react";

const stats = [
    {
      label: "Project Selesai",
      value: "30+",
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
    },
    {
      label: "Klien Puas",
      value: "20+",
      icon: <Users className="w-6 h-6 text-blue-400" />,
    },
    {
      label: "Tahun Pengalaman",
      value: "2+",
      icon: <Clock className="w-6 h-6 text-purple-400" />,
    },
    {
      label: "Support 24/7",
      value: "100%",
      icon: <MessageSquare className="w-6 h-6 text-yellow-400" />,
    },
  ];

const Stats = () => {
  return (
    <section className="py-16 px-4 relative bg-gray-900/50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
