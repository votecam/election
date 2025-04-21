import React from 'react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import CandidatesList from './CandidatesList';

const Dashboard = () => {
  return (
    <div className="w-full max-w-full">
       {/* Breadcrumb Navigation - Hidden on mobile */}
       <div className="hidden lg:flex items-center ml-2">
              <div className="flex items-center text-base text-gray-500">
                <span className="font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors">Dashboard</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-500">Overview</span>
              </div>
            </div>
      <header className="mt-8 relative">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Admin</h1>
        <div className="h-1 w-32 bg-emerald-500 rounded mt-2"></div>
        <p className="text-lg text-gray-600 mb-4 mt-2">Election  Information System</p>
      </header>
      
      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCard />
      </div>
      
      {/* Main Content Grid - Recent Activity (col-7) and Candidates List (col-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Recent Activity - col-7 */}
        <div className="lg:col-span-7">
          <RecentActivity />
        </div>
        
        {/* Candidates List - col-3 */}
        <div className="lg:col-span-3">
          <CandidatesList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 