import React from 'react';

// Stats Card Component - Following dashboard StatsCard style
const StatsCard = ({ title, value, icon, iconBg, iconColor, loading }) => {
  return (
    <div 
      className="bg-white rounded-md border border-gray-200 shadow-sm hover:border-emerald-100 transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500 relative overflow-hidden"
      tabIndex="0"
      role="region"
      aria-label={`${title} statistics card showing ${value}`}
    >
      {/* Large gray background decorative icon */}
      <div className="absolute right-[-35px] bottom-[-50px] opacity-[0.06] pointer-events-none" aria-hidden="true">
        <div className="w-36 h-36">
          {React.cloneElement(icon, { className: "w-full h-full text-gray-500" })}
        </div>
      </div>
          
      <div className="p-6 relative z-10">
        <div className="flex items-start">
          {/* Left side - Icon with title */}
          <div className="flex items-center">
            <div 
              className={`w-14 h-14 rounded-md flex items-center justify-center ${iconBg} shadow-sm`}
              aria-hidden="true"
            >
            {icon}
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-700">{title}</h3>
              {loading ? (
                <div className="w-16 h-9 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <p className="text-3xl font-bold text-emerald-800 mt-1">{value}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Reports"
        value={stats.total.toString()}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      <StatsCard
        title="Pending Reports"
        value={stats.pending.toString()}
        iconBg="bg-amber-100"
        iconColor="text-amber-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatsCard
        title="Approved Reports"
        value={stats.approved.toString()}
        iconBg="bg-green-100"
        iconColor="text-green-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
      />
      <StatsCard
        title="Rejected Reports"
        value={stats.rejected.toString()}
        iconBg="bg-red-100"
        iconColor="text-red-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        }
      />
    </div>
  );
};

export default StatsCards;
