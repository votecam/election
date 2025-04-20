import React from 'react';

const StatCard = ({ title, value, icon, iconBg, iconColor }) => {
  return (
    <div 
      className="bg-white rounded-md border border-gray-200 shadow-sm hover:border-emerald-100 transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500 relative overflow-hidden"
      tabIndex="0"
      role="region"
      aria-label={`${title} statistics card showing ${value}`}
    >
      {/* Large gray background decorative icon */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center opacity-[0.06] pointer-events-none" aria-hidden="true">
        <div className="w-48 h-48">
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
              <p className="text-3xl font-bold text-emerald-800 mt-1">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedStatsCard = () => {
  return (
    <div className="space-y-6">
      {/* Main stats grid with increased spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Candidates Card */}
        <StatCard 
          title="Total Candidates" 
          value="0" 
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        {/* Total Polling Centers Card */}
        <StatCard 
          title="Polling Centers" 
          value="0" 
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        
        {/* Total Feedback Card */}
        <StatCard 
          title="Feedback Received" 
          value="0" 
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default AdvancedStatsCard;