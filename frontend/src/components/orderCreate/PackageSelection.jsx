import React from 'react';
import { Package, Check } from 'lucide-react';

const PackageSelection = ({ selectedPlanName, formatPriceRange, chosenPlan }) => {
  if (!selectedPlanName) return null;
  
  return (
    <div className="mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-md transition-all">
      <div className="relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
        </div>
        <div className="relative p-5">
          <div className="flex items-start">
            <div className="hidden md:block bg-white bg-opacity-20 p-3 rounded-full mr-4 flex-shrink-0 ">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-white font-bold text-lg">
                  {selectedPlanName}
                </h3>
                <div className="ml-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Terpilih
                </div>
              </div>
              {chosenPlan && (
                <div className="mt-2">
                  <div className="text-blue-100 text-sm">Rentang Harga:</div>
                  <div className="text-white font-semibold text-lg md:text-xl mt-1">
                    {formatPriceRange(chosenPlan)}
                  </div>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                <div className="text-blue-100 text-xs">
                  Silakan masukkan nominal pembayaran sesuai rentang harga paket
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelection;