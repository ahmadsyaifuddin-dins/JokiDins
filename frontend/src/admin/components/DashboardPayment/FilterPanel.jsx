// components/DashboardPayment/FilterPanel.jsx
import React from "react";
import { Calendar, DollarSign, Check } from "lucide-react";

export const FilterPanel = ({ filters, updateFilter, clearFilters }) => {
  // Payment status options
  const paymentStatusOptions = [
    "dicicil", 
    "lunas", 
    "belum bayar"
  ];

  // Handle checkbox change for payment status
  const handleStatusChange = (status) => {
    const updatedStatuses = filters.paymentStatus.includes(status)
      ? filters.paymentStatus.filter(s => s !== status)
      : [...filters.paymentStatus, status];
    
    updateFilter('paymentStatus', updatedStatuses);
  };

  // Handle fixed amount filter change
  const handleFixedAmountChange = (value) => {
    updateFilter('hasFixedAmount', value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search filter */}
        <div className="space-y-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Pencarian
          </label>
          <input
            type="text"
            id="search"
            placeholder="Nama, Order ID, Nama Paket..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Price range filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              Rentang Harga
            </div>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Terinput"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.priceRange.min}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                updateFilter('priceRange', { ...filters.priceRange, min: value });
              }}
            />
            <span className="text-gray-500 flex items-center">-</span>
            <input
              type="text"
              placeholder="Fixed"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.priceRange.max}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                updateFilter('priceRange', { ...filters.priceRange, max: value });
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Berdasarkan Nominal Diinput dan Nominal Fixed  
          </p>
        </div>

        {/* Date range filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Rentang Tanggal
            </div>
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.dateRange.startDate || ''}
              onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, startDate: e.target.value })}
            />
            <span className="text-gray-500 flex items-center">-</span>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.dateRange.endDate || ''}
              onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, endDate: e.target.value })}
            />
          </div>
        </div>
        
        {/* Fixed Amount filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Check size={16} className="mr-1" />
              Fixed Amount
            </div>
          </label>
          <div className="flex space-x-2">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={filters.hasFixedAmount === null ? '' : filters.hasFixedAmount ? 'yes' : 'no'}
              onChange={(e) => {
                const val = e.target.value;
                handleFixedAmountChange(val === '' ? null : val === 'yes');
              }}
            >
              <option value="">Semua</option>
              <option value="yes">Dengan Fixed Amount</option>
              <option value="no">Tanpa Fixed Amount</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Payment Status Checkboxes */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status Pembayaran
        </label>
        <div className="flex flex-wrap gap-2">
          {paymentStatusOptions.map((status) => (
            <label
              key={status}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                filters.paymentStatus.includes(status)
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.paymentStatus.includes(status)}
                onChange={() => handleStatusChange(status)}
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};