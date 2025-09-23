import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const StatCard = ({ title, value, icon, iconBg, iconColor, loading }) => {
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

const AdvancedStatsCard = () => {
  const [stats, setStats] = useState({
    candidates: 0,
    centers: 0,
    feedback: 0,
    users: 0,
    reports: 0,
    admins: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch candidates count using the candidates API - get total count from pagination
        try {
          const candidatesResponse = await apiService.candidates.getAll(1, 1); // Just get 1 item to get pagination info
          if (candidatesResponse && candidatesResponse.pagination && candidatesResponse.pagination.total) {
            setStats(prev => ({ ...prev, candidates: candidatesResponse.pagination.total }));
          } else if (candidatesResponse && candidatesResponse.candidates) {
            // Fallback: if no pagination, try to get a larger sample
            const largeResponse = await apiService.candidates.getAll(1, 1000);
            if (largeResponse && largeResponse.candidates) {
              setStats(prev => ({ ...prev, candidates: largeResponse.candidates.length }));
            }
          }
        } catch (candidatesError) {
          console.error('Error fetching candidates data:', candidatesError);
        }
        
        // Fetch centers count - get total count from pagination
        try {
          const centersResponse = await apiService.centres.getAllCentres(1, 1); // Just get 1 item to get pagination info
          if (centersResponse && centersResponse.pagination && centersResponse.pagination.total) {
            setStats(prev => ({ ...prev, centers: centersResponse.pagination.total }));
          } else if (centersResponse && centersResponse.centres) {
            // Fallback: if no pagination, try to get a larger sample
            const largeResponse = await apiService.centres.getAllCentres(1, 1000);
            if (largeResponse && largeResponse.centres) {
              setStats(prev => ({ ...prev, centers: largeResponse.centres.length }));
            }
          }
        } catch (centersError) {
          console.error('Error fetching centers data:', centersError);
        }
        
        // Fetch feedback count - get total count from pagination
        try {
          const feedbackResponse = await apiService.feedback.getAllFeedback(1, 1); // Just get 1 item to get pagination info
          if (feedbackResponse && feedbackResponse.data && feedbackResponse.data.pagination && feedbackResponse.data.pagination.total) {
            setStats(prev => ({ ...prev, feedback: feedbackResponse.data.pagination.total }));
          } else if (feedbackResponse && feedbackResponse.data && feedbackResponse.data.feedbacks) {
            // Fallback: if no pagination, try to get a larger sample
            const largeResponse = await apiService.feedback.getAllFeedback(1, 1000);
            if (largeResponse && largeResponse.data && largeResponse.data.feedbacks) {
              setStats(prev => ({ ...prev, feedback: largeResponse.data.feedbacks.length }));
            }
          }
        } catch (feedbackError) {
          console.error('Error fetching feedback data:', feedbackError);
        }
        
        // Fetch citizens count - get total count from pagination
        try {
          const citizensResponse = await apiService.users.getAllCitizens(1, 1); // Just get 1 item to get pagination info
          console.log('Citizens API Response:', citizensResponse); // Debug log
          
          if (citizensResponse && citizensResponse.data && citizensResponse.data.pagination && citizensResponse.data.pagination.total) {
            setStats(prev => ({ ...prev, users: citizensResponse.data.pagination.total }));
          } else if (citizensResponse && citizensResponse.data && citizensResponse.data.users) {
            // Fallback: if no pagination, try to get a larger sample
            const largeResponse = await apiService.users.getAllCitizens(1, 1000);
            if (largeResponse && largeResponse.data && largeResponse.data.users) {
              setStats(prev => ({ ...prev, users: largeResponse.data.users.length }));
            }
          }
        } catch (citizensError) {
          console.error('Error fetching citizens data:', citizensError);
        }
        
        // Fetch reports count - get total count from pagination
        try {
          const reportsResponse = await apiService.incidents.getAll(1, 1); // Just get 1 item to get pagination info
          console.log('Reports API Response:', reportsResponse); // Debug log
          
          if (reportsResponse && reportsResponse.data && reportsResponse.data.pagination && reportsResponse.data.pagination.total) {
            setStats(prev => ({ ...prev, reports: reportsResponse.data.pagination.total }));
          } else if (reportsResponse && reportsResponse.data && reportsResponse.data.incidents) {
            // Fallback: if no pagination, try to get a larger sample
            const largeResponse = await apiService.incidents.getAll(1, 1000);
            if (largeResponse && largeResponse.data && largeResponse.data.incidents) {
              setStats(prev => ({ ...prev, reports: largeResponse.data.incidents.length }));
            }
          }
        } catch (reportsError) {
          console.error('Error fetching reports data:', reportsError);
        }
        
        // Fetch admins count (mock data for now since we don't have an admins API yet)
        try {
          // For now, we'll use mock data since admins API might not be implemented yet
          setStats(prev => ({ ...prev, admins: 3 })); // Mock count for admin users
        } catch (adminsError) {
          console.error('Error fetching admins data:', adminsError);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      {/* First row - Original 3 stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Candidates Card */}
        <StatCard 
          title="Total Candidates" 
          value={stats.candidates.toString()} 
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        {/* Total Polling Centers Card */}
        <StatCard 
          title="Polling Centers" 
          value={stats.centers.toString()} 
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        
        {/* Total Feedback Card */}
        <StatCard 
          title="Feedback Received" 
          value={stats.feedback.toString()} 
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />
      </div>
      
      {/* Second row - New 3 stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Citizens Card */}
        <StatCard 
          title="Total Citizens" 
          value={stats.users.toString()} 
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        
        {/* Total Reports Card */}
        <StatCard 
          title="Total Reports" 
          value={stats.reports.toString()} 
          iconBg="bg-red-100"
          iconColor="text-red-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        
        {/* Total Admins Card */}
        <StatCard 
          title="Total Admins" 
          value={stats.admins.toString()} 
          iconBg="bg-indigo-100"
          iconColor="text-indigo-700"
          loading={loading}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default AdvancedStatsCard;