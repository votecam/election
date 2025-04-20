import React, { useState, useRef, useEffect } from 'react';

const ManageCentre = () => {
  // Sample data - in a real application, this would come from an API
  const [centres, setCentres] = useState([
    { 
      id: 1, 
      name: 'Central Community Hall', 
      code: 'CCH001', 
      region: 'Central', 
      division: 'Urban',
      location: 'Downtown',
      stations: 5,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Eastern Regional School', 
      code: 'ERS002', 
      region: 'Eastern', 
      division: 'Rural',
      location: 'Hillside',
      stations: 3,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Northern Civic Center', 
      code: 'NCC003', 
      region: 'Northern', 
      division: 'Suburban',
      location: 'Riverside',
      stations: 4,
      status: 'inactive'
    },
    { 
      id: 4, 
      name: 'Western Public Library', 
      code: 'WPL004', 
      region: 'Western', 
      division: 'Urban',
      location: 'City Center',
      stations: 2,
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Southern Municipal Hall', 
      code: 'SMH005', 
      region: 'Southern', 
      division: 'Rural',
      location: 'Farmland',
      stations: 6,
      status: 'pending'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Handle search and filter
  const filteredCentres = centres.filter(centre => {
    const matchesSearch = centre.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         centre.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || centre.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setCentres(centres.map(centre => 
      centre.id === id ? {...centre, status: newStatus} : centre
    ));
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1.5 inline-flex text-base font-medium rounded-md bg-emerald-100 text-emerald-800">Active</span>;
      case 'inactive':
        return <span className="px-3 py-1.5 inline-flex text-base font-medium rounded-md bg-gray-100 text-gray-800">Inactive</span>;
      case 'pending':
        return <span className="px-3 py-1.5 inline-flex text-base font-medium rounded-md bg-amber-100 text-amber-800">Pending</span>;
      default:
        return <span className="px-3 py-1.5 inline-flex text-base font-medium rounded-md bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Get filter label
  const getFilterLabel = () => {
    switch (statusFilter) {
      case 'all':
        return 'All Statuses';
      case 'active':
        return 'Active Only';
      case 'inactive':
        return 'Inactive Only';
      case 'pending':
        return 'Pending Only';
      default:
        return 'All Statuses';
    }
  };

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
            <a href="#" className="text-gray-500 hover:text-gray-700">Centres</a>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-medium">Manage Centres</span>
          </li>
        </ol>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Polling Centres</h1>
        <p className="text-base text-gray-600 mt-1">View and manage polling centres across all regions</p>
        <div className="w-32 h-1 bg-emerald-600 rounded-sm mt-2"></div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search centres by name, code or region"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="inline-flex justify-between items-center w-48 px-4 py-3 text-base font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              id="filter-menu"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getFilterLabel()}
              <svg className="-mr-1 ml-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md bg-white border border-gray-200 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filter-menu">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-3 text-base hover:bg-gray-50`}
                    role="menuitem"
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('active');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-3 text-base hover:bg-gray-50`}
                    role="menuitem"
                  >
                    Active Only
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('inactive');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'inactive' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-3 text-base hover:bg-gray-50`}
                    role="menuitem"
                  >
                    Inactive Only
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'pending' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-3 text-base hover:bg-gray-50`}
                    role="menuitem"
                  >
                    Pending Only
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-3 text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Centre
          </button>
        </div>
      </div>
      
      {/* Data table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">#</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Centre Name</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Code</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Region/Division</th>
              <th scope="col" className="px-6 py-4 text-center text-base font-medium text-gray-700">Stations</th>
              <th scope="col" className="px-6 py-4 text-center text-base font-medium text-gray-700">Status</th>
              <th scope="col" className="px-6 py-4 text-right text-base font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredCentres.length > 0 ? (
              filteredCentres.map((centre, index) => (
                <tr key={centre.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="text-base font-medium text-gray-900">{centre.name}</div>
                    <div className="text-base text-gray-500 mt-1">{centre.location}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700">{centre.code}</td>
                  <td className="px-6 py-5">
                    <div className="text-base text-gray-900">{centre.region}</div>
                    <div className="text-base text-gray-500 mt-1">{centre.division}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-base font-medium text-gray-900">{centre.stations}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    {getStatusBadge(centre.status)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={() => {/* View details */}}
                      >
                        <svg className="h-4 w-4 mr-1.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={() => {/* Edit centre */}}
                      >
                        <svg className="h-4 w-4 mr-1.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      {centre.status === 'active' ? (
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                          onClick={() => handleStatusChange(centre.id, 'inactive')}
                        >
                          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none"
                          onClick={() => handleStatusChange(centre.id, 'active')}
                        >
                          <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-500">No centres found</p>
                    <p className="text-base text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-base text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCentres.length}</span> of{' '}
                <span className="font-medium">{filteredCentres.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex" aria-label="Pagination">
                <button disabled className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-base font-medium text-gray-500 hover:bg-gray-50 opacity-50 cursor-not-allowed">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-emerald-500 bg-emerald-50 text-base font-medium text-emerald-600">
                  1
                </button>
                <button disabled className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-base font-medium text-gray-500 hover:bg-gray-50 opacity-50 cursor-not-allowed">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCentre;