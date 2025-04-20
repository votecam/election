import React from 'react';

const RecentActivity = () => {
  // Sample activity data - would be fetched from API in production
  // Limiting to 5 visible activities
  const activities = [
    {
      id: 1,
      action: 'Added new polling center',
      name: 'Central Community Hall',
      date: 'Today at 9:30 AM',
      type: 'create'
    },
    {
      id: 2,
      action: 'Registered new candidate',
      name: 'Michael Thompson',
      date: 'Yesterday',
      type: 'create'
    },
    {
      id: 3,
      action: 'Uploaded voter data',
      name: '1,250 voter records',
      date: 'Yesterday',
      type: 'upload'
    },
    {
      id: 4,
      action: 'Updated polling center',
      name: 'Eastern Regional School',
      date: 'May 13',
      type: 'update'
    },
    {
      id: 5,
      action: 'System backup',
      name: 'Database backup completed',
      date: 'May 13',
      type: 'system'
    }
  ];

  // Icon mapping for different activity types
  const getActivityIcon = (type) => {
    switch(type) {
      case 'create':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        );
      case 'upload':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'approve':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-green-50 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-amber-50 text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-gray-50 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 relative overflow-hidden">
      {/* Enhanced Elegant Watermark */}
      <div className="absolute -bottom-16 -right-16 pointer-events-none z-0 hidden sm:block">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-50 via-emerald-100 to-transparent opacity-30"></div>
      </div>
      <div className="absolute -top-24 -left-24 pointer-events-none z-0 hidden sm:block">
        <div className="w-72 h-72 rounded-full bg-gradient-to-br from-gray-50 via-gray-100 to-transparent opacity-40"></div>
      </div>
      
      {/* Center subtle pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center hidden sm:flex">
        <div className="w-full h-full max-w-md max-h-md opacity-[0.03]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="activity-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,10 l 20,0" stroke="#333" strokeWidth="0.5" fill="none" />
                <path d="M 10,0 l 0,20" stroke="#333" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#activity-grid)" />
          </svg>
        </div>
      </div>
      
      {/* Additional decorative dot pattern */}
      <div className="absolute top-10 right-10 pointer-events-none z-0 hidden sm:block">
        <svg width="80" height="80" viewBox="0 0 80 80" opacity="0.07">
          <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Activity</h3>
          <div className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition-colors">
            View all
          </div>
        </div>
        
        {/* Activity List - No scrolling */}
        <div className="flex-grow">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`px-4 sm:px-6 py-3 sm:py-4 ${index !== activities.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}
            >
              <div className="flex items-start">
                {/* Activity icon */}
                <div className="flex-shrink-0 mr-3 sm:mr-4">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity details */}
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-medium text-gray-800 truncate">{activity.action}</p>
                  <p className="text-sm sm:text-base text-gray-500 mt-0.5 truncate">{activity.name}</p>
                </div>
                
                {/* Date */}
                <div className="ml-2 sm:ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-gray-50 text-gray-600">
                    {activity.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer with "View more" button */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-50 mt-auto">
          <button className="w-full flex items-center justify-center text-sm sm:text-base font-medium text-emerald-600 hover:text-emerald-700 py-1.5 transition-colors">
            View all activity
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;