import React from "react";

const IncomeTotal = ({ total }) => {
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
          <h3 className="text-slate-300 text-sm font-medium">Total Pendapatan</h3>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            {formatRupiah(total)}
          </p>
        </div>
        <div className="p-3 bg-emerald-500/20 rounded-full">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
      {/* <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">Periode</div>
          <div className="text-sm font-medium text-slate-300">
            {startDate && endDate 
              ? `${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`
              : "Semua waktu"}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default IncomeTotal;