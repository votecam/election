import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-48 mb-2"></div>
            <div className="h-1 bg-gray-200 animate-pulse rounded w-32 mb-3"></div>
            <div className="h-5 bg-gray-200 animate-pulse rounded w-64"></div>
          </div>
        </div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4 sm:px-6 lg:px-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mx-4 sm:mx-6 lg:mx-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
