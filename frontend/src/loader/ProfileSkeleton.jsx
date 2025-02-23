import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section Skeleton */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              {/* Name Skeleton */}
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
              {/* Role Skeleton */}
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Profile Details Skeleton */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Join Date Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Gender Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Birthday Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4 mt-8">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;