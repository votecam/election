import React, { useState, useRef, useEffect } from 'react';
import ViewCentreModal from './ViewCentreModal';
import EditCentreModal from './EditCentreModal';
import apiService from '../../../services/apiService';

const ManageCentre = () => {
  // State for centres data
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // State for the view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState(null);
  
  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [centreToEdit, setCentreToEdit] = useState(null);
  
  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [centreToDelete, setCentreToDelete] = useState(null);
  
  // Fetch centres from API
  const fetchCentres = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.centres.getAllCentres(page);
      
      // Process centres data to ensure it's renderable
      const processedCentres = (data.centres || []).map(centre => {
        // Create a new object to avoid mutation
        const processedCentre = { ...centre };
        
        // Handle potential GeoJSON location object
        if (processedCentre.location && typeof processedCentre.location === 'object') {
          // If location is a GeoJSON object, convert to string representation
          if (processedCentre.location.type && processedCentre.location.coordinates) {
            processedCentre.locationDisplay = `${processedCentre.location.type} (${processedCentre.location.coordinates.join(', ')})`;
            processedCentre.location = processedCentre.locationDisplay;
          } else {
            // For other object types, convert to JSON string
            processedCentre.location = JSON.stringify(processedCentre.location);
          }
        }
        
        // Handle accessibility array
        if (Array.isArray(processedCentre.accessibility)) {
          processedCentre.accessibilityDisplay = processedCentre.accessibility.join(', ');
        } else {
          processedCentre.accessibilityDisplay = 'None';
        }
        
        // Handle opening time object
        if (processedCentre.opening_time && typeof processedCentre.opening_time === 'object') {
          processedCentre.openingTimeDisplay = `${processedCentre.opening_time.from} - ${processedCentre.opening_time.to}`;
        } else {
          processedCentre.openingTimeDisplay = 'Not specified';
        }
        
        // Ensure other fields have default values if they're undefined
        processedCentre.name = processedCentre.name || 'Unnamed Centre';
        processedCentre.region = processedCentre.region || 'Unknown Region';
        processedCentre.municipalities = processedCentre.municipalities || 'Unknown Municipality';
        processedCentre.subdivision = processedCentre.subdivision || 'Unknown Subdivision';
        processedCentre.department = processedCentre.department || 'Unknown Department';
        processedCentre.description = processedCentre.description || 'No description';
        processedCentre.contact_number = processedCentre.contact_number || 'N/A';
        processedCentre.wait_time = processedCentre.wait_time || 'Unknown';
        processedCentre.stations = processedCentre.stations || 0;
        processedCentre.status = processedCentre.status || 'unknown';
        
        return processedCentre;
      });
      
      setCentres(processedCentres);
      setPagination(data.pagination || { 
        total: 0, 
        page: 1, 
        limit: 10, 
        pages: 0 
      });
    } catch (err) {
      console.error('Error fetching centres:', err);
      setError(err.message || 'Failed to load centres. Please try again.');
      // Keep the previous data if we have it
      setCentres(prev => prev.length ? prev : []);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch centres on component mount
  useEffect(() => {
    fetchCentres(1);
  }, []);
  
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
  
  // Handle page change
  const handlePageChange = (newPage) => {
    // Make sure the page is within bounds
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchCentres(newPage);
    }
  };
  
  // Handle search and filter
  const filteredCentres = centres.filter(centre => {
    const matchesSearch = centre.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         centre.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.municipalities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.subdivision?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         centre.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    console.log('Toggling menu for id:', id);
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Determine if menu should display above (for bottom rows)
  const getMenuPosition = (centreId, index, total) => {
    // If in the last 2 rows, show menu above
    return index >= total - 2 ? { bottom: '100%', right: 0 } : { top: '100%', right: 0 };
  };

  // Handle opening the view modal
  const handleViewCentre = (centre) => {
    // Add onEdit and onDelete methods to the centre object
    const centreWithHandlers = {
      ...centre,
      onEdit: handleEditCentre,
      onDelete: handleDeleteCentre
    };
    
    setSelectedCentre(centreWithHandlers);
    setIsViewModalOpen(true);
  };

  // Handle closing the view modal
  const handleCloseViewModal = () => {
    console.log('Closing modal');
    setIsViewModalOpen(false);
    setTimeout(() => setSelectedCentre(null), 300); // Clear data after animation
  };

  // Handle opening the edit modal
  const handleEditCentre = (centre) => {
    console.log('Opening edit modal for centre:', centre);
    setCentreToEdit(centre);
    setIsEditModalOpen(true);
    setOpenMenuId(null); // Close the action menu
  };
  
  // Handle closing the edit modal
  const handleCloseEditModal = () => {
    console.log('Closing edit modal');
    setIsEditModalOpen(false);
    setTimeout(() => setCentreToEdit(null), 300); // Clear data after animation
  };
  
  // Handle saving edited centre
  const handleSaveCentre = (updatedCentre) => {
    console.log('Saving updated centre:', updatedCentre);
    setCentres(centres.map(centre => 
      centre.id === updatedCentre.id ? updatedCentre : centre
    ));
  };

  // Handle delete centre
  const handleDeleteCentre = (centre) => {
    setCentreToDelete(centre);
    setShowDeleteConfirmation(true);
  };
  
  // Confirm delete centre
  const confirmDeleteCentre = async () => {
    try {
      await apiService.centres.deleteCentre(centreToDelete.id);
      
      // Remove the deleted centre from the state
      setCentres(centres.filter(c => c.id !== centreToDelete.id));
      
      // Show success message
      // You can add a toast notification here
      
      // Close the delete confirmation
      setShowDeleteConfirmation(false);
      setCentreToDelete(null);
      
      // Close the view modal if it's open
      setIsViewModalOpen(false);
    } catch (error) {
      console.error('Error deleting centre:', error);
      // Handle error - show error message
      // You can add a toast notification here
    }
  };
  
  // Cancel delete
  const cancelDeleteCentre = () => {
    setShowDeleteConfirmation(false);
    setCentreToDelete(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Centres</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-base text-gray-600 mt-1">View and manage polling centres across all regions</p>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
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
            placeholder="Search centres by name, region, municipality or location"
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
      
      {/* Loading indicator */}
      {loading && (
        <div className="w-full py-10 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="mt-3 text-gray-700">Loading centres...</p>
          </div>
        </div>
      )}
      
      {/* Data table */}
      {!loading && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">#</th>
                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Centre Name</th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Region</th>
                    <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Municipality</th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Subdivision</th>
                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Stations</th>
                    <th scope="col" className="hidden xl:table-cell px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Wait Time</th>
                    <th scope="col" className="px-2 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-700">Status</th>
                    <th scope="col" className="px-2 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCentres.length > 0 ? (
                    filteredCentres.map((centre, index) => (
                      <tr key={centre.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-6 py-3 sm:py-5 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{centre.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:hidden">
                            {/* Show important info that's hidden in mobile */}
                            <span>{centre.region}</span> · {centre.municipalities}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm text-gray-900">{centre.region}</div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm text-gray-900">{centre.municipalities}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm text-gray-900">{centre.subdivision}</div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-3 sm:py-5 whitespace-nowrap text-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{centre.stations}</span>
                        </td>
                        <td className="hidden xl:table-cell px-6 py-3 sm:py-5 whitespace-nowrap text-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{centre.wait_time}</span>
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
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewCentre(centre)}
                              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                              title="View Centre"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditCentre(centre)}
                              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                              title="Edit Centre"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteCentre(centre)}
                              className="p-1.5 rounded-full bg-gray-100 text-red-600 hover:bg-red-100"
                              title="Delete Centre"
                            >
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
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
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span> of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex" aria-label="Pagination">
                      <button 
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={`relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          pagination.page === 1 
                            ? 'text-gray-500 opacity-50 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Show current page number */}
                      <button aria-current="page" className="relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-emerald-500 bg-emerald-50 text-xs sm:text-sm font-medium text-emerald-600">
                        {pagination.page}
                      </button>
                      
                      <button 
                        disabled={pagination.page === pagination.pages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={`relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          pagination.page === pagination.pages 
                            ? 'text-gray-500 opacity-50 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
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
      )}

      {/* View Centre Modal */}
      {isViewModalOpen && (
        <ViewCentreModal 
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          centre={selectedCentre}
        />
      )}
      
      {/* Edit Centre Modal */}
      {isEditModalOpen && (
        <EditCentreModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          centre={centreToEdit}
          onSave={handleSaveCentre}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Centre</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this centre? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmDeleteCentre}
              >
                Delete
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDeleteCentre}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCentre; 