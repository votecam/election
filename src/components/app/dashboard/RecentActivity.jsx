import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const fetchActivities = async () => {
    try {
      const response = await apiService.activities.getAll();
      // Sort activities by timestamp in descending order (newest first)
      const sortedActivities = response.data
        .map(activity => {
          const timestamp = activity.timestamp ? new Date(activity.timestamp) : null;
          const timeAgo = activity.timeAgo || (timestamp ? getTimeAgo(timestamp) : '');
          return {
            ...activity,
            timestamp,
            timeAgo
          };
        })
        // Filter out activities with invalid timestamp or timeAgo
        .filter(a => a.timestamp && !isNaN(a.timestamp) && a.timeAgo)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // Take only the 5 most recent

      console.log('Sorted activities:', sortedActivities.map(a => ({
        type: a.type,
        title: a.title,
        timestamp: a.timestamp,
        timeAgo: a.timeAgo
      })));

      setActivities(sortedActivities);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivities();

    // Set up interval to refresh every minute
    const intervalId = setInterval(fetchActivities, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format time display
  const formatTimeAgo = (timeAgo) => {
    if (timeAgo === '0 seconds ago' || timeAgo === '0 second ago') {
      return 'Just now';
    }
    return timeAgo;
  };

  // Icon mapping for different activity types
  const getActivityIcon = (type) => {
    switch(type) {
      case 'notification':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
      case 'setting':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'centre':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L12 14.197l-4.419 2.617A1 1 0 016 16V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'candidate':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-purple-50 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'user':
        return (
          <div className="p-1.5 sm:p-2 rounded-full bg-amber-50 text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

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
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        {/* Activity List - No scrolling */}
        <div className="flex-grow">
          {activities.slice(0, 5).map((activity, index) => (
            <div 
              key={index} 
              className={`px-4 sm:px-6 py-3 sm:py-4 ${index !== Math.min(4, activities.length - 1) ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}
            >
              <div className="flex items-start">
                {/* Activity icon */}
                <div className="flex-shrink-0 mr-3 sm:mr-4">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity details */}
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-medium text-gray-800 truncate">{activity.title}</p>
                  <p className="text-sm sm:text-base text-gray-500 mt-0.5 truncate">{activity.description}</p>
                </div>
                
                {/* Date */}
                <div className="ml-2 sm:ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-gray-50 text-gray-600">
                    {formatTimeAgo(activity.timeAgo)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;