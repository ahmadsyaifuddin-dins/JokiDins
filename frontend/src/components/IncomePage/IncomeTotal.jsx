import React from "react";

const IncomeTotal = ({ total, startDate, endDate }) => {
  // Format total ke format rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-800/30 to-emerald-800/30 border border-emerald-700/30">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-3 md:mb-0">
          <h3 className="text-slate-300 text-sm font-medium">Total Pendapatan JokiDins</h3>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            {formatRupiah(total)}
          </p>
        </div>
        <div className="p-3 bg-emerald-500/20 rounded-full">
         {/* Logo Rupiah sederhana */}
         <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="6" y="15" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="currentColor">Rp</text>
          </svg>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">Periode</div>
          <div className="text-sm font-medium text-slate-300">
            {startDate && endDate 
              ? `${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`
              : "Semua waktu"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTotal;
