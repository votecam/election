import React, { useState, useRef, useEffect } from 'react';

const ManageCentre = () => {
  // Sample data - in a real application, this would come from an API
  const [centres, setCentres] = useState([
    { 
      id: 1, 
      name: 'Central Community Hall', 
      region: 'Central', 
      division: 'Urban',
      location: 'Downtown',
      stations: 5,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Eastern Regional School', 
      region: 'Eastern', 
      division: 'Rural',
      location: 'Hillside',
      stations: 3,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Northern Civic Center', 
      region: 'Northern', 
      division: 'Suburban',
      location: 'Riverside',
      stations: 4,
      status: 'inactive'
    },
    { 
      id: 4, 
      name: 'Western Public Library', 
      region: 'Western', 
      division: 'Urban',
      location: 'City Center',
      stations: 2,
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Southern Municipal Hall', 
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
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Also close any open action menus when clicking outside
      const menuButtons = document.querySelectorAll('[id^="action-menu-"]');
      const clickedOnMenu = Array.from(menuButtons).some(el => el.contains(event.target));
      
      if (!clickedOnMenu) {
        setOpenMenuId(null);
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
                         centre.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.location.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // Handle opening/closing menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Determine if menu should display above (for bottom rows)
  const getMenuPosition = (centreId, index, total) => {
    // If in the last 2 rows, show menu above
    return index >= total - 2 ? { bottom: '100%', right: 0 } : { top: '100%', right: 0 };
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Centres</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-base text-gray-600 mt-1">View and manage polling centres across all regions</p>
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
                className="block w-full pl-10 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Search centres by name, region or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          
        <div className="flex flex-row items-center justify-end space-x-2 sm:space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="inline-flex justify-between items-center w-36 sm:w-48 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              id="filter-menu"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getFilterLabel()}
              <svg className={`-mr-1 ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white border border-gray-200 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filter-menu">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
                    role="menuitem"
                  >
                    All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('active');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
                    role="menuitem"
                  >
                    Active Only
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('inactive');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'inactive' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
                    role="menuitem"
                  >
                    Inactive Only
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setIsDropdownOpen(false);
                    }}
                    className={`${statusFilter === 'pending' ? 'bg-emerald-600 text-white' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm hover:bg-gray-50`}
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
            className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
          >
            <svg className="-ml-0.5 sm:-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline">Add</span><span className="hidden sm:inline"> New Centre</span>
          </button>
        </div>
      </div>
      
      {/* Data table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">#</th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Centre Name</th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Region/Division</th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Stations</th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Status</th>
                  <th scope="col" className="px-2 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCentres.length > 0 ? (
                  filteredCentres.map((centre, index) => (
                    <tr key={centre.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm text-gray-500">{index + 1}</td>
                      <td className="px-2 sm:px-6 py-3 sm:py-5">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{centre.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:hidden">
                          {/* Show important info that's hidden in mobile */}
                          <span>{centre.region}</span> · {centre.location}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-3 sm:py-5">
                        <div className="text-xs sm:text-sm text-gray-900">{centre.region}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">{centre.division}</div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-3 sm:py-5 whitespace-nowrap text-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{centre.stations}</span>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-center">
                        {/* Make status badges responsive */}
                        {centre.status === 'active' ? (
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs sm:text-sm font-medium rounded-md bg-emerald-100 text-emerald-800">Active</span>
                        ) : centre.status === 'inactive' ? (
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs sm:text-sm font-medium rounded-md bg-gray-100 text-gray-800">Inactive</span>
                        ) : centre.status === 'pending' ? (
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs sm:text-sm font-medium rounded-md bg-amber-100 text-amber-800">Pending</span>
                        ) : (
                          <span className="px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs sm:text-sm font-medium rounded-md bg-gray-100 text-gray-800">Unknown</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end">
                          <div className="relative inline-block text-left">
                            <button 
                              type="button" 
                              className="inline-flex items-center p-1.5 sm:p-2 rounded-full bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                              id={`action-menu-${centre.id}`}
                              aria-expanded={openMenuId === centre.id}
                              aria-haspopup="true"
                              onClick={() => toggleMenu(centre.id)}
                            >
                              <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>

                            {openMenuId === centre.id && (
                              <div 
                                className="action-menu-dropdown origin-top-right absolute right-0 mt-1 mb-1 w-36 rounded-md shadow-lg bg-white border border-gray-200 focus:outline-none z-20"
                                style={getMenuPosition(centre.id, index, filteredCentres.length)}
                                role="menu" 
                                aria-orientation="vertical" 
                                aria-labelledby={`action-menu-${centre.id}`}
                              >
                                <div className="py-1" role="none">
                                  <button
                                    type="button"
                                    className="w-full text-left block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                    role="menuitem"
                                    onClick={() => {/* View details */}}
                                  >
                                    <div className="flex items-center">
                                      <svg className="h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View
                                    </div>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    className="w-full text-left block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                                    role="menuitem"
                                    onClick={() => {/* Edit centre */}}
                                  >
                                    <div className="flex items-center">
                                      <svg className="h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit
                                    </div>
                                  </button>
                                  
                                  {centre.status === 'active' ? (
                                    <button
                                      type="button"
                                      className="w-full text-left block px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                      role="menuitem"
                                      onClick={() => handleStatusChange(centre.id, 'inactive')}
                                    >
                                      <div className="flex items-center">
                                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        Disable
                                      </div>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="w-full text-left block px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50"
                                      role="menuitem"
                                      onClick={() => handleStatusChange(centre.id, 'active')}
                                    >
                                      <div className="flex items-center">
                                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Enable
                                      </div>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
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
            <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCentres.length}</span> of{' '}
                    <span className="font-medium">{filteredCentres.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex" aria-label="Pagination">
                    <button disabled className="relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 opacity-50 cursor-not-allowed">
                      <span className="sr-only">Previous</span>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button aria-current="page" className="relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-emerald-500 bg-emerald-50 text-xs sm:text-sm font-medium text-emerald-600">
                      1
                    </button>
                    <button disabled className="relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 opacity-50 cursor-not-allowed">
                      <span className="sr-only">Next</span>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCentre; 