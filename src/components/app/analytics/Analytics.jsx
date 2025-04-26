import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const Analytics = () => {
  // State for chart animations and data
  const [activeTab, setActiveTab] = useState('party');
  const [candidatesByParty, setCandidatesByParty] = useState([]);
  const [partyDataLoading, setPartyDataLoading] = useState(true);
  const [partyDataError, setPartyDataError] = useState(null);
  
  // State for regional data
  const [regionData, setRegionData] = useState([]);
  const [regionDataLoading, setRegionDataLoading] = useState(true);
  const [regionDataError, setRegionDataError] = useState(null);
  const [totalCentres, setTotalCentres] = useState(0);
  
  // State for position data
  const [candidatesByPosition, setCandidatesByPosition] = useState([]);
  const [positionDataLoading, setPositionDataLoading] = useState(true);
  const [positionDataError, setPositionDataError] = useState(null);
  
  // Monthly registration data
  const monthlyData = [
    { month: 'Jan', registrations: 23 },
    { month: 'Feb', registrations: 45 },
    { month: 'Mar', registrations: 38 },
    { month: 'Apr', registrations: 78 },
    { month: 'May', registrations: 56 },
    { month: 'Jun', registrations: 43 },
  ];
  
  // Fetch candidates by party from API
  useEffect(() => {
    const fetchCandidatesByParty = async () => {
      setPartyDataLoading(true);
      try {
        const result = await apiService.analytics.getCandidatesByParty();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          // Calculate total candidates
          const total = result.data.reduce((sum, party) => sum + party.count, 0);
          
          // Process the data and add colors
          const colors = ['#10B981', '#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#8B5CF6', '#2DD4BF', '#F97316'];
          
          const processedData = result.data.map((party, index) => ({
            name: party.name,
            count: party.count,
            percentage: total > 0 ? Math.round((party.count / total) * 100) : 0,
            color: colors[index % colors.length]
          }));
          
          setCandidatesByParty(processedData);
        } else {
          setPartyDataError('Failed to load party data');
        }
      } catch (error) {
        console.error('Error fetching candidates by party:', error);
        setPartyDataError('Error loading party data. Please try again later.');
      } finally {
        setPartyDataLoading(false);
      }
    };
    
    fetchCandidatesByParty();
  }, []);

  // Fetch centres by region from API
  useEffect(() => {
    const fetchCentresByRegion = async () => {
      setRegionDataLoading(true);
      try {
        const result = await apiService.analytics.getCentresByRegion();
        
        if (result.status === 'success' && result.data && Array.isArray(result.data.regions)) {
          // Set total centres
          setTotalCentres(result.data.total || 0);
          
          // Process the data and add colors
          const colors = ['#10B981', '#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#8B5CF6', '#2DD4BF', '#F97316'];
          
          const processedData = result.data.regions.map((item, index) => ({
            name: item.region,
            count: item.count,
            color: colors[index % colors.length]
          }));
          
          setRegionData(processedData);
        } else {
          setRegionDataError('Failed to load regional data');
        }
      } catch (error) {
        console.error('Error fetching centres by region:', error);
        setRegionDataError('Error loading regional data. Please try again later.');
      } finally {
        setRegionDataLoading(false);
      }
    };
    
    fetchCentresByRegion();
  }, []);
  
  // Fetch candidates by position from API
  useEffect(() => {
    const fetchCandidatesByPosition = async () => {
      setPositionDataLoading(true);
      try {
        const result = await apiService.analytics.getCandidatesByPosition();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          // Calculate total candidates
          const total = result.data.reduce((sum, position) => sum + position.count, 0);
          
          // Process the data and add colors
          const colors = ['#10B981', '#3B82F6', '#6366F1', '#EC4899', '#F59E0B', '#8B5CF6'];
          
          const processedData = result.data.map((position, index) => ({
            name: position.position,
            count: position.count,
            percentage: total > 0 ? Math.round((position.count / total) * 100) : 0,
            color: colors[index % colors.length]
          }));
          
          setCandidatesByPosition(processedData);
        } else {
          setPositionDataError('Failed to load position data');
        }
      } catch (error) {
        console.error('Error fetching candidates by position:', error);
        setPositionDataError('Error loading position data. Please try again later.');
      } finally {
        setPositionDataLoading(false);
      }
    };
    
    fetchCandidatesByPosition();
  }, []);
  
  // Get the total candidates
  const getTotalByParty = () => {
    return candidatesByParty.reduce((total, item) => total + item.count, 0);
  };
  
  const getTotalByPosition = () => {
    return candidatesByPosition.reduce((total, item) => total + item.count, 0);
  };

  // Find the max count for the bar chart scaling
  const getMaxRegionCount = () => {
    if (regionData.length === 0) return 50;
    return Math.max(...regionData.map(region => region.count));
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
    
    .region-name {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  // Function to render pie chart
  const renderPieChart = (data, total, title) => {
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        
        {/* Pie Chart */}
        <div className="relative w-56 h-56 mb-6">
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
        
        {/* Legend - Two column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full">
          {data.map((item, index) => (
            <div 
              key={item.name} 
              className="flex items-center group animate-fade-in" 
              style={{ animationDelay: `${200 + (index * 100)}ms` }}
            >
              <div className="w-4 h-4 rounded-sm mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <div className="relative flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block" title={item.name}>
                  {item.name}
                </span>
                {/* Tooltip for long names */}
                <div className="absolute left-0 -top-8 z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.name}
                </div>
              </div>
              <span className="ml-2 text-sm font-semibold text-gray-900 whitespace-nowrap flex-shrink-0">
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
          
          {partyDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : partyDataError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{partyDataError}</p>
                </div>
              </div>
            </div>
          ) : candidatesByParty.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-center">No party data available</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                {renderPieChart(candidatesByParty, getTotalByParty(), "Political Parties")}
              </div>
            </div>
          )}
        </div>
        
        {/* Candidates by Position - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidates by Position</h2>
          
          {positionDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : positionDataError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{positionDataError}</p>
                </div>
              </div>
            </div>
          ) : candidatesByPosition.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-center">No position data available</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="max-w-md w-full">
                {renderPieChart(candidatesByPosition, getTotalByPosition(), "Election Positions")}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Regions Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>Electoral Centres by Region</h2>
        
        {regionDataLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : regionDataError ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{regionDataError}</p>
              </div>
            </div>
          </div>
        ) : regionData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-gray-500 text-center">No regional data available</p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative h-96">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-32 flex flex-col justify-between text-xs text-gray-500 py-2">
                {[...Array(6)].map((_, i) => {
                  const maxCount = getMaxRegionCount();
                  const step = Math.ceil(maxCount / 5);
                  const value = (5 - i) * step;
                  return <span key={i}>{value}</span>;
                })}
              </div>
              
              {/* Chart grid lines */}
              <div className="absolute left-8 right-0 top-0 bottom-32 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-gray-100"></div>
                ))}
              </div>
              
              {/* Actual bar chart */}
              <div className="absolute left-10 right-0 top-0 bottom-32 flex items-end">
                <div className="flex items-end justify-around w-full h-full">
                  {regionData.map((region, index) => {
                    const maxCount = getMaxRegionCount();
                    const heightPercentage = (region.count / maxCount) * 100;
                    
                    return (
                      <div 
                        key={region.name} 
                        className="flex flex-col items-center group animate-fade-in" 
                        style={{ 
                          width: `${100 / Math.max(regionData.length, 1)}%`, 
                          maxWidth: "160px",
                          animationDelay: `${400 + (index * 100)}ms` 
                        }}
                      >
                        {/* Value label */}
                        <div className="mb-1 text-xs font-semibold text-gray-700">
                          {region.count}
                        </div>
                        
                        {/* Bar */}
                        <div className="relative w-full px-2">
                          <div 
                            className="w-full rounded-t transition-all duration-300 group-hover:opacity-90 region-bar"
                            style={{ 
                              height: `${heightPercentage}%`, 
                              backgroundColor: region.color,
                              minHeight: '24px',
                              transform: 'scaleY(0)',
                              animation: 'scaleYIn 0.5s ease-out forwards',
                              animationDelay: `${400 + (index * 100)}ms`
                            }}
                          >
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {region.name}: {region.count} centres
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Region name label */}
                        <div className="mt-2 px-1 w-full">
                          <div className="text-xs font-medium text-gray-600 text-center region-name" title={region.name}>
                            {region.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* X-axis */}
              <div className="absolute left-10 right-0 bottom-0 h-32 border-t border-gray-200">
                
              </div>
            </div>
            
            <div className="mt-2 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Source: National Electoral Commission</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Total Centres: {totalCentres}</span>
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-md border border-emerald-100 hover:bg-emerald-100 transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
      
      </div>
    </div>
  );
};

export default Analytics; 