import React from 'react';

// Stats Card Component - Compact version for single row layout
const StatsCard = ({ title, value, icon, iconBg, iconColor, loading }) => {
  return (
    <div 
      className="bg-white rounded-md border border-gray-200 shadow-sm hover:border-emerald-100 transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500 relative overflow-hidden"
      tabIndex="0"
      role="region"
      aria-label={`${title} statistics card showing ${value}`}
    >
      {/* Large gray background decorative icon */}
      <div className="absolute right-[-20px] bottom-[-30px] opacity-[0.04] pointer-events-none" aria-hidden="true">
        <div className="w-24 h-24">
          {React.cloneElement(icon, { className: "w-full h-full text-gray-500" })}
        </div>
      </div>
          
      <div className="p-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div 
            className={`w-10 h-10 rounded-md flex items-center justify-center ${iconBg} shadow-sm mb-3`}
            aria-hidden="true"
          >
            {icon}
          </div>
          
          {/* Title and Value */}
          <h3 className="text-base font-medium text-gray-700 mb-1">{title}</h3>
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-emerald-800">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ stats, loading }) => {
  // Provide default values to prevent errors - matching the incidents API response structure
  const safeStats = {
    total: stats?.total || 0,
    pending: stats?.pending || 0,
    investigating: stats?.investigating || 0,
    resolved: stats?.resolved || 0,
    dismissed: stats?.dismissed || 0,
    critical: stats?.critical || 0,
    high: stats?.high || 0,
    medium: stats?.medium || 0,
    low: stats?.low || 0,
    today: stats?.today || 0,
    thisWeek: stats?.thisWeek || 0,
    thisMonth: stats?.thisMonth || 0
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <StatsCard
        title="Total Incidents"
        value={safeStats.total.toString()}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      <StatsCard
        title="Pending"
        value={safeStats.pending.toString()}
        iconBg="bg-amber-100"
        iconColor="text-amber-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatsCard
        title="Investigating"
        value={safeStats.investigating.toString()}
        iconBg="bg-blue-100"
        iconColor="text-blue-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
      <StatsCard
        title="Resolved"
        value={safeStats.resolved.toString()}
        iconBg="bg-green-100"
        iconColor="text-green-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
      />
      <StatsCard
        title="Dismissed"
        value={safeStats.dismissed.toString()}
        iconBg="bg-red-100"
        iconColor="text-red-700"
        loading={loading}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        }
      />
    </div>
  );
};

export default StatsCards;
