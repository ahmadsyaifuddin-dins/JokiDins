import React from "react";
import { useNavigate } from "react-router-dom";
import PricingCard from "../components/Pricing/PricingCard";
import { pricingPlans } from "../utils/pricingData";

const PricingPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    // Kita bisa encode nama paket, atau jika ada id, gunakan itu
    navigate(`/orderCreate?plan=${encodeURIComponent(plan.name)}`);
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
            <PricingCard key={index} plan={plan} onSelect={handleSelectPlan} />
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
