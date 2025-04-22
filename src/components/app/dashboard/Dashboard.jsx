import React from 'react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import CandidatesList from './CandidatesList';

const Dashboard = () => {
  return (
    <div className="w-full max-w-full">
      <header className="mt-8 relative">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Admin</h1>
        {/* <div className="h-1 w-32 bg-emerald-500 rounded mt-2"></div> */}
        <p className="text-lg text-gray-600 mb-4 mt-2">Election Information System</p>
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