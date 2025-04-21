import React from 'react';

const Analytics = () => {
  // Centre data by region
  const regionData = [
    { name: 'North', count: 42, percentage: 27, color: '#10B981' },
    { name: 'South', count: 38, percentage: 24, color: '#3B82F6' },
    { name: 'East', count: 31, percentage: 20, color: '#6366F1' },
    { name: 'West', count: 27, percentage: 17, color: '#EC4899' },
    { name: 'Central', count: 18, percentage: 12, color: '#F59E0B' },
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
  
  // Voter turnout data (sample data)
  const turnoutData = [
    { age: '18-24', percentage: 65 },
    { age: '25-34', percentage: 78 },
    { age: '35-44', percentage: 82 },
    { age: '45-54', percentage: 88 },
    { age: '55-64', percentage: 74 },
    { age: '65+', percentage: 68 },
  ];
  
  // Accessibility data
  const accessibilityData = [
    { feature: 'Wheelchair Access', percentage: 72 },
    { feature: 'Accessible Parking', percentage: 68 },
    { feature: 'Elevator Access', percentage: 45 },
    { feature: 'Braille Signage', percentage: 32 },
    { feature: 'Hearing Assistance', percentage: 28 },
  ];

  // Simple pie chart calculation
  let cumulativePercentage = 0;

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <nav className="mb-5 text-base" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="#" className="text-gray-500 hover:text-gray-700">Dashboard</a>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-medium">Analytics Dashboard</span>
          </li>
        </ol>
      </nav>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Voting Information Analytics</h1>
        <div className="w-32 h-1 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-2">Visual insights into polling centers distribution and accessibility</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Regional Distribution - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribution by Region</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Pie Chart */}
            <div className="relative w-56 h-56 mb-4 md:mb-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Pie chart segments */}
                {regionData.map((region) => {
                  const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
                  cumulativePercentage += region.percentage;
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
                  const largeArcFlag = region.percentage > 50 ? 1 : 0;
                  const pathData = `
                    M 50 50
                    L ${x1} ${y1}
                    A 48 48 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                  `;
                  
                  return (
                    <path 
                      key={region.name}
                      d={pathData}
                      fill={region.color}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* Center circle for donut effect */}
                <circle cx="50" cy="50" r="20" fill="white" />
                </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">156</span>
                <span className="text-sm text-gray-500">Total Centers</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-3 md:ml-8 flex-1">
              {regionData.map((region) => (
                <div key={region.name} className="flex items-center">
                  <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: region.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{region.name}</span>
                  <span className="ml-auto text-sm font-semibold text-gray-900">
                    {region.count} ({region.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Monthly Registration Chart */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Center Registrations</h2>
          
          {/* Chart header with total and trend */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-gray-500">Total for period</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">283</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  12.4%
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-md border border-emerald-100">6M</button>
              <button className="px-3 py-1 bg-gray-50 text-gray-500 text-sm font-medium rounded-md border border-gray-100">YTD</button>
              <button className="px-3 py-1 bg-gray-50 text-gray-500 text-sm font-medium rounded-md border border-gray-100">1Y</button>
            </div>
          </div>

          {/* Bar chart */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            
            {/* Chart grid lines */}
            <div className="absolute left-8 right-0 top-0 bottom-8 flex flex-col justify-between">
              <div className="border-b border-gray-100 h-1/4"></div>
              <div className="border-b border-gray-100 h-1/4"></div>
              <div className="border-b border-gray-100 h-1/4"></div>
              <div className="border-b border-gray-100 h-1/4"></div>
            </div>
            
            {/* Actual chart */}
            <div className="h-64 flex items-end space-x-2 pl-8 pb-8 relative">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex flex-col items-center flex-1 relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {item.month}: {item.registrations} centers
                    </div>
                  </div>
                  
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md hover:from-emerald-700 hover:to-emerald-500 transition-all relative"
                    style={{ height: `${(item.registrations / 80) * 100}%` }}
                  >
                    {/* Hover effect highlight */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                  <div className="text-xs font-medium text-gray-500 mt-2">{item.month}</div>
          </div>
        ))}
            </div>
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Source: Electoral Commission Data</span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm inline-block mr-1"></span>
                Monthly Registration Count
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Voter Turnout by Age Group */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Expected Voter Turnout by Age</h2>
          
          <div className="space-y-4">
            {turnoutData.map((group) => (
              <div key={group.age} className="flex items-center">
                <span className="text-sm font-medium text-gray-600 w-20">{group.age}</span>
                <div className="flex-1 ml-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full"
                      style={{ width: `${group.percentage}%` }}
                ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {group.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Accessibility Features */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
          
          <div className="space-y-4">
            {accessibilityData.map((feature) => (
              <div key={feature.feature} className="flex items-center">
                <span className="text-sm font-medium text-gray-600 w-36">{feature.feature}</span>
                <div className="flex-1 ml-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${feature.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {feature.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Center Status Distribution */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Center Status Distribution</h2>
        
        <div className="flex flex-wrap justify-center space-x-6">
          {[
            { status: 'Active', count: 142, percentage: 91, color: '#10B981' },
            { status: 'Inactive', count: 8, percentage: 5, color: '#EF4444' },
            { status: 'Pending', count: 6, percentage: 4, color: '#F59E0B' },
          ].map((item) => (
            <div key={item.status} className="flex flex-col items-center mb-4">
              <div className="w-36 h-36 relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={item.color} 
                    strokeWidth="10"
                    strokeDasharray={`${item.percentage * 2.83} ${283 - (item.percentage * 2.83)}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</span>
                  <span className="text-sm text-gray-500">{item.status}</span>
              </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mt-2">{item.percentage}% of Centers</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Information System Coverage</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-emerald-600">156</div>
              <div className="text-lg text-gray-600 mt-1">Total Centers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600">578</div>
              <div className="text-lg text-gray-600 mt-1">Polling Stations</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600">12</div>
              <div className="text-lg text-gray-600 mt-1">Regions</div>
            </div>
          </div>
          
          <div className="mt-6 text-base text-gray-600">
            <p>The voting information system currently covers 156 polling centers across 12 regions, with a total of 578 individual polling stations. 91% of centers are currently active and ready for the upcoming election.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 