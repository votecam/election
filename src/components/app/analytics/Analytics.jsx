import React, { useState } from 'react';

const Analytics = () => {
  // State for chart animations
  const [activeTab, setActiveTab] = useState('party');
  
  // Candidate data by party
  const candidatesByParty = [
    { name: 'PDGE', count: 156, percentage: 45, color: '#10B981' },
    { name: 'CSDI', count: 89, percentage: 26, color: '#3B82F6' },
    { name: 'APP', count: 56, percentage: 16, color: '#6366F1' },
    { name: 'PS', count: 27, percentage: 8, color: '#EC4899' },
    { name: 'Others', count: 17, percentage: 5, color: '#F59E0B' },
  ];
  
  // Candidate data by position
  const candidatesByPosition = [
    { name: 'President', count: 8, percentage: 2, color: '#10B981' },
    { name: 'Parliamentary', count: 125, percentage: 36, color: '#3B82F6' },
    { name: 'Municipal', count: 212, percentage: 62, color: '#6366F1' },
  ];
  
  // Monthly registration data
  const monthlyData = [
    { month: 'Jan', registrations: 23 },
    { month: 'Feb', registrations: 45 },
    { month: 'Mar', registrations: 38 },
    { month: 'Apr', registrations: 78 },
    { month: 'May', registrations: 56 },
    { month: 'Jun', registrations: 43 },
  ];
  
  // Get the total candidates
  const getTotalByParty = () => {
    return candidatesByParty.reduce((total, item) => total + item.count, 0);
  };
  
  const getTotalByPosition = () => {
    return candidatesByPosition.reduce((total, item) => total + item.count, 0);
  };

  // CSS for animations
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pieSliceIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes scaleYIn {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-pie-slice {
      animation: pieSliceIn 0.5s ease-out forwards;
    }
    
    .pie-chart-container {
      transition: all 0.3s ease-in-out;
    }
    
    .tab-button {
      transition: all 0.3s ease;
    }
    
    .tab-button:hover {
      transform: translateY(-2px);
    }
    
    .tab-button.active {
      background-color: #10B981;
      color: white;
    }
    
    .region-bar {
      transition: all 0.3s ease;
    }
    
    .region-bar:hover {
      filter: brightness(1.1);
      transform: scaleY(1.05);
    }
  `;

  // Function to render pie chart
  const renderPieChart = (data, total, title) => {
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-between animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Pie Chart */}
        <div className="relative w-56 h-56 mb-4 md:mb-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Pie chart segments */}
            {data.map((item, index) => {
              const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
              cumulativePercentage += item.percentage;
              const endAngle = cumulativePercentage * 3.6;
              
              // Convert angles to radians
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              // Calculate path coordinates
              const x1 = 50 + 48 * Math.cos(startRad);
              const y1 = 50 + 48 * Math.sin(startRad);
              const x2 = 50 + 48 * Math.cos(endRad);
              const y2 = 50 + 48 * Math.sin(endRad);
              
              // Create path command
              const largeArcFlag = item.percentage > 50 ? 1 : 0;
              const pathData = `
                M 50 50
                L ${x1} ${y1}
                A 48 48 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
              
              return (
                <path 
                  key={item.name}
                  d={pathData}
                  fill={item.color}
                  stroke="#ffffff"
                  strokeWidth="1"
                  className="animate-pie-slice"
                  style={{ animationDelay: `${100 + (index * 100)}ms` }}
                />
              );
            })}
            {/* Center circle for donut effect */}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-sm text-gray-500">Candidates</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3 md:ml-8 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          {data.map((item, index) => (
            <div 
              key={item.name} 
              className="flex items-center animate-fade-in" 
              style={{ animationDelay: `${200 + (index * 100)}ms` }}
            >
              <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="ml-auto text-sm font-semibold text-gray-900">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Add animation styles */}
      <style>{animationStyles}</style>
      
      <header className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800">Voting Information Analytics</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-2">Visual insights into polling centers, candidates, and voting data</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Candidates by Party - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidates by Party</h2>
          {renderPieChart(candidatesByParty, getTotalByParty(), "Political Parties")}
        </div>
        
        {/* Candidates by Position - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidates by Position</h2>
          {renderPieChart(candidatesByPosition, getTotalByPosition(), "Election Positions")}
        </div>
      </div>
      
      {/* Regions Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>Regional Analytics</h2>
        
        <div className="mt-4">
          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>50</span>
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
            
            {/* Chart grid lines */}
            <div className="absolute left-8 right-0 top-0 bottom-10 flex flex-col justify-between">
              <div className="border-b border-gray-100"></div>
              <div className="border-b border-gray-100"></div>
              <div className="border-b border-gray-100"></div>
              <div className="border-b border-gray-100"></div>
              <div className="border-b border-gray-100"></div>
            </div>
            
            {/* Actual bar chart */}
            <div className="absolute left-10 right-0 top-0 bottom-10 flex items-end">
              <div className="flex items-end justify-around w-full h-full">
                {[
                  { name: 'Bioko Norte', count: 42, color: '#10B981' },
                  { name: 'Bioko Sur', count: 38, color: '#3B82F6' },
                  { name: 'Annobón', count: 31, color: '#6366F1' },
                  { name: 'Centro Sur', count: 27, color: '#EC4899' },
                  { name: 'Kié-Ntem', count: 35, color: '#F59E0B' },
                  { name: 'Litoral', count: 45, color: '#8B5CF6' },
                  { name: 'Wele-Nzas', count: 29, color: '#2DD4BF' }
                ].map((region, index) => (
                  <div 
                    key={region.name} 
                    className="flex flex-col items-center group animate-fade-in" 
                    style={{ 
                      width: '12%', 
                      animationDelay: `${400 + (index * 100)}ms` 
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {region.name}: {region.count} centers
                      </div>
                    </div>
                    
                    <div className="relative w-full">
                      <div 
                        className="w-full rounded-t transition-all duration-300 group-hover:opacity-90 region-bar"
                        style={{ 
                          height: `${(region.count / 50) * 100}%`, 
                          backgroundColor: region.color,
                          minHeight: '24px',
                          transform: 'scaleY(0)',
                          animation: 'scaleYIn 0.5s ease-out forwards',
                          animationDelay: `${400 + (index * 100)}ms`
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                          {region.count}
                        </div>
                      </div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="mt-2 text-xs font-medium text-gray-600 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {region.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Source: National Electoral Commission</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Total Centers: 247</span>
                <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-md border border-emerald-100 hover:bg-emerald-100 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      

      <div className="grid grid-cols-1 gap-6 mb-6">
      
      </div>
    </div>
  );
};

export default Analytics; 