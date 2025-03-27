import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 mb-6 animate-pulse">
          {/* Header Background with Pattern */}
          <div className="relative h-56 bg-gray-300 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg
                className="h-full w-full"
                viewBox="0 0 800 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h800v400H0z" fill="none" />
                <path
                  d="M800 400V0H0v400h800ZM90 310a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-30a50 50 0 0 0 0-100 50 50 0 0 0 0 100Zm290-40a50 50 0 0 0 0-100 50 50 0 0 0 0 100Z"
                  fill="currentColor"
                  fillOpacity=".1"
                />
              </svg>
            </div>

            {/* Profile Avatar Skeleton */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-gray-400 border-4 border-white shadow-lg"></div>
                <div className="absolute bottom-0 right-0 bg-gray-400 p-2.5 rounded-full shadow-md w-10 h-10"></div>
              </div>
            </div>

            {/* Quick Status Badges Skeleton */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="px-3 py-1.5 rounded-full bg-gray-400 w-24 h-6"></div>
            </div>
          </div>

          {/* User Name & Basic Info Skeleton */}
          <div className="pt-8 pb-4 px-8 text-center">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-36 mx-auto"></div>
            
            {/* User Status Overview Skeleton */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col items-center p-3 bg-gray-100 rounded-lg">
                  <div className="w-6 h-6 bg-gray-300 rounded-full mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {/* Personal Information Skeleton */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-6 bg-gray-300 rounded w-36"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
                <div className="h-4 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Info Items Skeleton */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start border-b border-gray-100 pb-4">
                  <div className="bg-gray-200 p-3 rounded-lg mr-4 w-11 h-11"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                    {item === 2 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Account Information Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center mb-5">
              <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-36"></div>
            </div>
            
            <div className="space-y-4">
              {/* Account Items Skeleton */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
            
            {/* Refresh Button Skeleton */}
            <div className="w-full mt-8 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 animate-pulse">
          <div className="flex-1 h-12 bg-gray-300 rounded-xl"></div>
          <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;