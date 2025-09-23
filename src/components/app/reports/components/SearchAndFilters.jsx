import React from 'react';

const SearchAndFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  typeFilter,
  setTypeFilter,
  priorityFilter,
  setPriorityFilter,
  filteredReports, 
  totalReports 
}) => {
  const filterOptions = [
    {
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'investigating', label: 'Investigating' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'dismissed', label: 'Dismissed' }
      ]
    },
    {
      label: 'Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'bribery_corruption', label: 'Bribery/Corruption' },
        { value: 'ballot_stuffing', label: 'Ballot Stuffing' },
        { value: 'voter_intimidation', label: 'Voter Intimidation' },
        { value: 'violence_threats', label: 'Violence/Threats' },
        { value: 'polling_station_closure', label: 'Polling Station Closure' },
        { value: 'accessibility_issues', label: 'Accessibility Issues' },
        { value: 'equipment_malfunction', label: 'Equipment Malfunction' }
      ]
    },
    {
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priority' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    }
  ];

  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterOptions.map((filter, index) => (
          <div key={index} className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-gray-300 px-4 py-3 pr-10 text-base font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilters;