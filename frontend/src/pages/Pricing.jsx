import React from 'react';
import { Check } from 'lucide-react';

const PricingPage = () => {
  const pricingPlans = [
    {
      name: "Basic",
      priceStart: "Rp50",
      priceStartSmall: ".000",
      priceEnd: "120",
      priceEndSmall: ".000",
      priceNote: "(bisa nego)",
      features: [
        "Pengerjaan tugas ringan",
        "1 kali revisi",
        "Estimasi selesai 2-3 hari",
        "Sesuai kesepakatan kesulitan"
      ],
      buttonText: "Pesan Sekarang",
      popular: false
    },
    {
      name: "Standard",
      priceStart: "Rp120",
      priceStartSmall: ".000",
      priceEnd: "250",
      priceEndSmall: ".000",
      priceNote: "(bisa nego)",
      features: [
        "Pengerjaan tugas menengah",
        "2 kali revisi",
        "Estimasi selesai 2-5 hari"
      ],
      buttonText: "Pesan Sekarang",
      popular: true
    },
    {
      name: "Premium",
      priceStart: "Rp500",
      priceStartSmall: ".000",
      priceEnd: "750",
      priceEndSmall: ".000",
      priceNote: "",
      features: [
        "Pengerjaan tugas kompleks (mini project)",
        "3 kali revisi",
        "Estimasi selesai 5-7 hari"
      ],
      buttonText: "Pesan Sekarang",
      popular: false
    },
    {
      name: "Ultimate",
      priceStart: "Rp750",
      priceStartSmall: ".000",
      priceEnd: "3,5",
      priceEndSmall: " Juta",
      priceNote: "",
      features: [
        "Pengerjaan project besar (web app/portfolio)",
        "Revisi bebas",
        "Estimasi selesai 1-2 minggu"
      ],
      buttonText: "Pesan Sekarang",
      popular: false
    }
  ];

  // Card component for each pricing plan
  const PricingCard = ({ plan }) => {
    return (
      <div className={`flex flex-col p-6 mx-2 mb-6 rounded-lg shadow-xl transition-transform duration-300 hover:scale-105 ${
        plan.popular 
          ? 'bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-400' 
          : 'bg-gray-900 border border-gray-700'
      }`}>
        {plan.popular && (
          <div className="py-1 px-4 bg-blue-500 text-white text-sm font-bold tracking-wide rounded-full self-start mb-4">
            TERPOPULER
          </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2">Paket {plan.name}</h3>
        <div className="mb-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">{plan.priceStart}</span>
            <span className="text-xl text-gray-400">{plan.priceStartSmall}</span>
            <span className="mx-1 text-gray-400"> - </span>
            <span className="text-3xl font-bold text-white">{plan.priceEnd}</span>
            <span className="text-xl text-gray-400">{plan.priceEndSmall}</span>
          </div>
        </div>
        {plan.priceNote && (
          <div className="mb-4">
            <span className="text-sm text-blue-400 italic">{plan.priceNote}</span>
          </div>
        )}
        <ul className="mb-8 space-y-4 flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check size={20} className="text-blue-400 mr-2 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        <button className={`py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
          plan.popular 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}>
          {plan.buttonText}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
            Pilih Paket JokiDins
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Solusi cepat dan tepat buat tugas atau project kuliahmu!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 max-w-2xl mx-auto">
            Semua paket mencakup konsultasi selama proses pengerjaan. Hubungi kami untuk penawaran khusus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;