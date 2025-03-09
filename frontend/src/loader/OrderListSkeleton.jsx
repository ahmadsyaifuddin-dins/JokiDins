import React from "react";

const OrderListSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header skeleton untuk Order List */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        {/* Grid skeleton order cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse"
            >
              {/* Header skeleton card */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              </div>
              {/* Content skeleton card */}
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                {/* Footer action skeleton */}
                <div className="mt-4 flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderListSkeleton;
