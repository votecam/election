import React from 'react';

const Analytics = () => {
  // Sample analytics data
  const stats = {
    centresRegistered: 156,
    activeCentres: 142,
    totalPollingStations: 578,
    totalVotersRegistered: 67842,
    regionsReporting: 12,
    averageVotersPerCentre: 435
  };
  
  // Sample performance data for chart
  const performanceData = [
    { month: 'Jan', registrations: 23 },
    { month: 'Feb', registrations: 45 },
    { month: 'Mar', registrations: 38 },
    { month: 'Apr', registrations: 78 },
    { month: 'May', registrations: 56 },
    { month: 'Jun', registrations: 43 },
  ];
  
  // Distribution by region data
  const regionData = [
    { name: 'North', count: 42, percentage: 27 },
    { name: 'South', count: 38, percentage: 24 },
    { name: 'East', count: 31, percentage: 20 },
    { name: 'West', count: 27, percentage: 17 },
    { name: 'Central', count: 18, percentage: 12 },
  ];

  return (
    <div className="w-full max-w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Key metrics and statistics for the election system</p>
      </header>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Total Centres Registered', value: stats.centresRegistered, icon: 'building', color: 'blue' },
          { title: 'Active Polling Centres', value: stats.activeCentres, icon: 'check-circle', color: 'green' },
          { title: 'Total Polling Stations', value: stats.totalPollingStations, icon: 'location-marker', color: 'purple' },
          { title: 'Voters Registered', value: stats.totalVotersRegistered.toLocaleString(), icon: 'users', color: 'emerald' },
          { title: 'Regions Reporting', value: stats.regionsReporting, icon: 'globe', color: 'amber' },
          { title: 'Avg. Voters Per Centre', value: stats.averageVotersPerCentre, icon: 'chart-bar', color: 'indigo' },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 bg-${metric.color}-100 text-${metric.color}-600`}>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {metric.icon === 'building' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                  {metric.icon === 'check-circle' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {metric.icon === 'location-marker' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                  {metric.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {metric.icon === 'globe' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {metric.icon === 'chart-bar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <h3 className="mt-2 text-3xl font-semibold text-gray-900">{metric.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chart and Distribution sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Registration Performance Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Registration Performance</h2>
          
          {/* Simple chart representation (for a real app, use a chart library like Chart.js or Recharts) */}
          <div className="h-64 flex items-end space-x-2">
            {performanceData.map((item) => (
              <div key={item.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-colors"
                  style={{ height: `${(item.registrations / 80) * 100}%` }}
                ></div>
                <div className="text-xs font-medium text-gray-500 mt-2">{item.month}</div>
                <div className="text-sm font-semibold text-gray-700">{item.registrations}</div>
              </div>
            ))}
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            Registration performance over the last 6 months
          </p>
        </div>
        
        {/* Distribution by Region */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Distribution by Region</h2>
          
          <div className="space-y-4">
            {regionData.map((region) => (
              <div key={region.name} className="flex items-center">
                <span className="text-sm font-medium text-gray-600 w-20">{region.name}</span>
                <div className="flex-1 ml-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {region.count} ({region.percentage}%)
                </span>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Distribution of polling centres across regions
          </p>
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {[
            { type: 'registration', action: 'New polling centre registered', details: 'Central School District', time: '2 hours ago' },
            { type: 'update', action: 'Centre information updated', details: 'Eastern Regional Office', time: '5 hours ago' },
            { type: 'voter', action: 'Voter data imported', details: '1,250 new records added', time: 'Yesterday' },
            { type: 'system', action: 'System backup completed', details: 'All data securely stored', time: 'Yesterday' },
            { type: 'registration', action: 'New polling centre registered', details: 'Northern Community Hall', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="px-6 py-4 flex items-start hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <span className={`inline-flex p-2 rounded-md ${
                  activity.type === 'registration' ? 'bg-emerald-100 text-emerald-600' : 
                  activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'voter' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {activity.type === 'registration' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {activity.type === 'update' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                    {activity.type === 'voter' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                    {activity.type === 'system' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />}
                  </svg>
                </span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <div className="ml-6 flex-shrink-0">
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center justify-center">
            View all activity
            <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 