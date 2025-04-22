import React, { useState, useRef, useEffect } from 'react';

const ManageCandidate = () => {
  // Sample data - in a real application, this would come from an API
  const [candidates, setCandidates] = useState([
    { 
      id: 1, 
      name: 'Alexander Williams', 
      candidateId: 'CAND-001', 
      party: 'CPDM', 
      position: 'Presidential Candidate',
      constituency: 'Central Region',
      gender: 'Male',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      candidateId: 'CAND-002', 
      party: 'SDF', 
      position: 'Vice Presidential Candidate',
      constituency: 'Eastern Region',
      gender: 'Female',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Michael Thompson', 
      candidateId: 'CAND-003', 
      party: 'UNDP', 
      position: 'Senate Candidate',
      constituency: 'Northern Region',
      gender: 'Male',
      status: 'inactive'
    },
    { 
      id: 4, 
      name: 'Elizabeth Clark', 
      candidateId: 'CAND-004', 
      party: 'MRC', 
      position: 'Governor Candidate',
      constituency: 'Western Region',
      gender: 'Female',
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Daniel Rodriguez', 
      candidateId: 'CAND-005', 
      party: 'UPC', 
      position: 'Representative',
      constituency: 'Southern Region',
      gender: 'Male',
      status: 'pending'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuButtonRefs = useRef({});
  const menuRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Only close the menu if the click is outside both the menu and the button that opened it
      if (activeMenu !== null && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRefs.current[activeMenu] && 
          !menuButtonRefs.current[activeMenu].contains(event.target)) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);
  
  // Handle search and filter
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? {...candidate, status: newStatus} : candidate
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

  // Get party badge color
  const getPartyBadge = (party) => {
    switch (party) {
      case 'CPDM':
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-red-100 text-red-800">{party}</span>;
      case 'SDF':
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-blue-100 text-blue-800">{party}</span>;
      case 'UNDP':
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-green-100 text-green-800">{party}</span>;
      case 'MRC':
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-purple-100 text-purple-800">{party}</span>;
      case 'UPC':
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-yellow-100 text-yellow-800">{party}</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-sm font-medium rounded-md bg-gray-100 text-gray-700">{party}</span>;
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Candidates</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-base text-gray-600 mt-3">View and manage election candidates across all parties</p>
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
            placeholder="Search candidates by name, ID, party or position"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex">
          <div className="relative inline-block text-left w-full md:w-60" ref={dropdownRef}>
            <div>
              <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                id="status-filter-menu"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {getFilterLabel()}
                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white focus:outline-none z-50">
                <div className="py-1 border border-gray-200 rounded-md" role="menu" aria-orientation="vertical" aria-labelledby="status-filter-menu">
                  <button
                    className={`w-full text-left px-4 py-2 text-base ${statusFilter === 'all' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} hover:bg-gray-50`}
                    role="menuitem"
                    onClick={() => setStatusFilter('all')}
                  >
                    All Statuses
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-base ${statusFilter === 'active' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} hover:bg-gray-50`}
                    role="menuitem"
                    onClick={() => setStatusFilter('active')}
                  >
                    Active Only
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-base ${statusFilter === 'inactive' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} hover:bg-gray-50`}
                    role="menuitem"
                    onClick={() => setStatusFilter('inactive')}
                  >
                    Inactive Only
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-base ${statusFilter === 'pending' ? 'bg-gray-50 text-gray-900' : 'text-gray-700'} hover:bg-gray-50`}
                    role="menuitem"
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending Only
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <a 
            href="/app/candidates/register" 
            className="ml-4 hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Candidate
          </a>
        </div>
      </div>
      
      {/* Mobile Add Button */}
      <div className="md:hidden mb-4">
        <a 
          href="/app/candidates/register" 
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Candidate
        </a>
      </div>
      
      {/* Candidates Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">#</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Candidate Name</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">ID</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Party</th>
              <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Position</th>
              <th scope="col" className="px-6 py-4 text-center text-base font-medium text-gray-700">Status</th>
              <th scope="col" className="px-6 py-4 text-right text-base font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="text-base font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-base text-gray-500 mt-1">{candidate.constituency}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700">{candidate.candidateId}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {getPartyBadge(candidate.party)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-base text-gray-900">{candidate.position}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    {getStatusBadge(candidate.status)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end">
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-100 focus:outline-none"
                          ref={el => menuButtonRefs.current[candidate.id] = el}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle the active menu
                            const newActiveMenu = activeMenu === candidate.id ? null : candidate.id;
                            setActiveMenu(newActiveMenu);
                          }}
                        >
                          <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        
                        {activeMenu === candidate.id && (
                          <div 
                            ref={menuRef} 
                            className="origin-top-right absolute w-48 rounded-md shadow-lg bg-white focus:outline-none z-50"
                            style={{
                              position: 'fixed',
                              top: menuButtonRefs.current[candidate.id]?.getBoundingClientRect().top - 120,
                              right: window.innerWidth - menuButtonRefs.current[candidate.id]?.getBoundingClientRect().right,
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                            <div className="py-1 border border-gray-200 rounded-md" role="menu" aria-orientation="vertical">
                              <button
                                type="button"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                role="menuitem"
                                onClick={() => {/* View details */}}
                              >
                                <svg className="h-4 w-4 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                              </button>
                              <button
                                type="button"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                role="menuitem"
                                onClick={() => {/* Edit candidate */}}
                              >
                                <svg className="h-4 w-4 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Candidate
                              </button>
                              <button
                                type="button"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                role="menuitem"
                                onClick={() => {/* Status change */}}
                              >
                                <svg className="h-4 w-4 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Change Status
                              </button>
                              <button
                                type="button"
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                role="menuitem"
                                onClick={() => {/* Delete candidate */}}
                              >
                                <svg className="h-4 w-4 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
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
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg text-gray-500 font-medium">No candidates found</p>
                    <p className="text-base text-gray-400 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-base text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCandidates.length}</span> of{' '}
                <span className="font-medium">{candidates.length}</span> candidates
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-emerald-50 border-emerald-500 text-emerald-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCandidate; 