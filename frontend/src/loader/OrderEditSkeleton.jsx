// src/components/OrderEditSkeleton.jsx
import React from 'react';

const OrderEditSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-pulse">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4">
            {/* Tombol kembali */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-4 w-4 bg-gray-300 rounded-full" />
              <div className="h-4 w-32 bg-gray-300 rounded" />
            </div>
            <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
            <div className="h-4 w-48 bg-gray-300 rounded" />
          </div>
          {/* Form Skeleton */}
          <div className="p-6 space-y-6">
            {/* Service Input Skeleton */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joki Apa
              </label>
              <div className="h-10 w-full bg-gray-300 rounded" />
            </div>
            {/* Description Input Skeleton */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Joki
              </label>
              <div className="h-24 w-full bg-gray-300 rounded" />
            </div>
            {/* Deadline Input Skeleton */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (Tanggal &amp; Waktu)
              </label>
              <div className="h-10 w-full bg-gray-300 rounded" />
            </div>
            {/* Tombol Update & Cancel Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="h-10 w-full md:w-1/2 bg-gray-300 rounded" />
              <div className="h-10 w-full md:w-1/2 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEditSkeleton;
