import React from "react";

const IncomeForm = ({ nominal, setNominal, handleSubmit, error, success }) => {
  // Format input pendapatan menjadi format rupiah saat diketik
  const handleNominalChange = (e) => {
    // Hapus semua karakter non-digit
    const value = e.target.value.replace(/\D/g, "");
    
    // Format dengan pemisah ribuan
    if (value === "") {
      setNominal("");
    } else {
      const formattedValue = new Intl.NumberFormat("id-ID").format(value);
      setNominal(formattedValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nominal"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Nominal Pendapatan
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">Rp</span>
          </div>
          <input
            type="text"
            id="nominal"
            name="nominal"
            value={nominal}
            onChange={handleNominalChange}
            placeholder="0"
            className="block w-full pl-10 pr-4 py-3 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400"
            required
          />
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-900/40 border border-red-700/50 rounded-md flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-2 p-2 bg-emerald-900/40 border border-emerald-700/50 rounded-md flex items-start">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-emerald-400 text-sm">{success}</span>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Tambah Pendapatan
      </button>
    </form>
  );
};

export default IncomeForm;