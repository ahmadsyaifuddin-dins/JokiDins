import React from "react";
import { Check, Star } from "lucide-react";
import { renderPriceRange } from "../../utils/pricingUtils";

const PricingCard = ({ plan, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(plan)}
      className={`cursor-pointer flex flex-col p-6 mx-2 mb-6 rounded-lg shadow-xl transition-transform duration-300 hover:scale-105 ${
        plan.popular
          ? "bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-blue-400"
          : "bg-gray-900 border border-gray-700"
      }`}
    >
      {plan.popular && (
        <div className="py-1 px-2 bg-blue-500 text-white text-sm font-bold tracking-wide rounded-full self-start mb-4 flex items-center">
          <Star className="mr-1" /> TERPOPULER
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">Paket {plan.name}</h3>
      <div className="mb-2">
        <div className="flex items-baseline">
          <span className="text-gray-300">{renderPriceRange(plan)}</span>
        </div>
      </div>
      {plan.priceNote && (
        <div className="mb-4">
          <span className="text-sm text-red-500 italic">{plan.priceNote}</span>
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
      <button
        onClick={(e) => {
          // Agar tombol tidak memicu event onClick di parent (kartu)
          e.stopPropagation();
          onSelect(plan);
        }}
        className={`py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
          plan.popular
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

export default PricingCard;
