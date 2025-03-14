// admin/components/DashboardStats.jsx
import React from "react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-gray-500 text-sm mb-1">Total Order</div>
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-yellow-600 text-sm mb-1">Menunggu</div>
        <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-blue-600 text-sm mb-1">Diproses</div>
        <div className="text-2xl font-bold text-gray-900">{stats.processing}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-green-600 text-sm mb-1">Selesai</div>
        <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-red-600 text-sm mb-1">Dibatalkan</div>
        <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
      </div>
    </div>
  );
};

export default DashboardStats;
