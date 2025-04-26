import React, { useState, useRef, useEffect } from 'react';
import ViewCentreModal from './ViewCentreModal';
import EditCentreModal from './EditCentreModal';
import apiService from '../../../services/apiService';
import axios from 'axios';

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ManageCentre = () => {
  // State for centres data
  const [centres, setCentres] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
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
      setTableLoading(true);
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
        // processedCentre.stations = processedCentre.stations || 0;
        // processedCentre.status = processedCentre.status || 'unknown';
        
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
      setInitialLoading(false);
      setTableLoading(false);
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
    
    return matchesSearch;
  });

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
  const handleSaveCentre = async (updatedCentre) => {
    try {
      setError(null);
      // Start loading state for edit operation
      setTableLoading(true);
      
      // Call the API to update the centre
      await apiService.centres.updateCentre(updatedCentre.id, {
        name: updatedCentre.name,
        region: updatedCentre.region,
        municipalities: updatedCentre.municipalities,
        subdivision: updatedCentre.subdivision,
        department: updatedCentre.department,
        description: updatedCentre.description,
        contact_number: updatedCentre.contact_number,
        wait_time: updatedCentre.wait_time,
        accessibility: updatedCentre.accessibility,
        opening_time: updatedCentre.opening_time
      });
      
      // Update the centres array in state
    setCentres(centres.map(centre => 
      centre.id === updatedCentre.id ? updatedCentre : centre
    ));
      
      // Show success message
      showSuccessMessage(`Centre "${updatedCentre.name}" has been updated successfully.`);
      
      // Stop loading
      setTableLoading(false);
    } catch (error) {
      console.error('Error updating centre:', error);
      // Handle the error
      const errorMsg = error.message || 'Failed to update centre';
      setError(errorMsg);
      scrollToTop(); // Scroll to top so user can see the error
      setTableLoading(false);
    }
  };

  // Handle delete centre
  const handleDeleteCentre = (centre) => {
    setCentreToDelete(centre);
    setShowDeleteConfirmation(true);
    setError(null); // Clear any previous errors
  };

  // Scroll to top utility function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show success message with auto-dismiss
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    scrollToTop(); // Scroll to top so user can see the message
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Direct delete without view modal - for row delete buttons
  const handleDirectDelete = async (centreId, centreName) => {
    try {
      // Don't set loading state to avoid showing loader
      setError(null);
      
      // Use the specific delete endpoint format with correct path
      await api.delete(`/centre/delete-centre/${centreId}`);
      
      // Remove the deleted centre from the state
      setCentres(prevCentres => prevCentres.filter(c => c.id !== centreId));
      
      // Update pagination if needed (if this was the last item on a page)
      const newTotalCount = pagination.total - 1;
      const newTotalPages = Math.ceil(newTotalCount / pagination.limit);
      
      // Just update the pagination state, don't reload the data
      setPagination(prev => ({
        ...prev,
        total: newTotalCount,
        pages: newTotalPages
      }));
      
      // Only fetch if actually needed, and with the tableLoading indicator
      if ((pagination.page > newTotalPages && newTotalPages > 0) || 
          (newTotalCount === 0) || 
          (filteredCentres.length === 1 && pagination.page > 1)) {
        // If we're on a page that no longer exists, go to the last page (but with minimal loading)
        if (pagination.page > newTotalPages && newTotalPages > 0) {
          fetchCentres(newTotalPages);
        } else if (newTotalCount === 0) {
          // If no items left, reset to page 1
          fetchCentres(1);
        } else if (filteredCentres.length === 1 && pagination.page > 1) {
          // If this was the last item on this page (and not page 1), go to previous page
          fetchCentres(pagination.page - 1);
        }
      }
      
      // Show success message and scroll to top
      showSuccessMessage(`Centre "${centreName}" has been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting centre:', error);
      // Handle the specific API error response format
      const errorMsg = error.response?.data?.message || 'Failed to delete centre';
      setError(errorMsg);
      scrollToTop(); // Scroll to top so user can see the error
    }
  };
  
  // Confirm delete centre
  const confirmDeleteCentre = async () => {
    try {
      setError(null);
      const centreName = centreToDelete.name || 'Unknown';
      
      // Use the specific delete endpoint format with correct path
      await api.delete(`/centre/delete-centre/${centreToDelete.id}`);
      
      // Remove the deleted centre from the state
      setCentres(centres.filter(c => c.id !== centreToDelete.id));
      
      // Update pagination if needed
      const newTotalCount = pagination.total - 1;
      const newTotalPages = Math.ceil(newTotalCount / pagination.limit);
      
      // Just update the pagination state, don't reload the data
      setPagination(prev => ({
        ...prev,
        total: newTotalCount,
        pages: newTotalPages
      }));
      
      // Only fetch if actually needed, and with the tableLoading indicator
      if ((pagination.page > newTotalPages && newTotalPages > 0) || 
          (newTotalCount === 0) || 
          (filteredCentres.length === 1 && pagination.page > 1)) {
        // If we're on a page that no longer exists, go to the last page (but with minimal loading)
        if (pagination.page > newTotalPages && newTotalPages > 0) {
          fetchCentres(newTotalPages);
        } else if (newTotalCount === 0) {
          // If no items left, reset to page 1
          fetchCentres(1);
        } else if (filteredCentres.length === 1 && pagination.page > 1) {
          // If this was the last item on this page (and not page 1), go to previous page
          fetchCentres(pagination.page - 1);
        }
      }
      
      // Close the delete confirmation
      setShowDeleteConfirmation(false);
      setCentreToDelete(null);
      
      // Close the view modal if it's open
      setIsViewModalOpen(false);
      
      // Show success message and scroll to top
      showSuccessMessage(`Centre "${centreName}" has been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting centre:', error);
      // Handle the specific API error response format
      const errorMsg = error.response?.data?.message || 'Failed to delete centre';
      setError(errorMsg);
      scrollToTop();
    }
  };
  
  // Cancel delete
  const cancelDeleteCentre = () => {
    setShowDeleteConfirmation(false);
    setCentreToDelete(null);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Centres</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-base text-gray-600 mt-3">View and manage polling centres across all regions</p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-10/12 lg:w-11/12 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            placeholder="Search centres by name, region, municipality or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex shrink-0">
          <a 
            href="/app/centres/register" 
            className="ml-auto hidden md:inline-flex items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            Add New Centre
          </a>
        </div>
      </div>
      
      {/* Mobile Add Button */}
      <div className="md:hidden mb-4 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <a 
          href="/app/centres/register" 
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Centre
        </a>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-6 mx-0 sm:mx-0 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
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
        </div>
      )}
      
      {/* Success message display */}
      {successMessage && (
        <div className="mb-6 mx-0 sm:mx-0 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Skeleton Loader - shown during initial load */}
      {initialLoading && (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 w-auto">
          <div className="w-full max-w-none align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow">
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="pl-4 sm:pl-5 pr-2 sm:pr-3 py-4 text-center text-sm sm:text-base font-bold text-gray-800 w-10">#</th>
                    <th scope="col" className="pl-5 sm:pl-6 pr-3 sm:pr-4 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Region/Description</th>
                    <th scope="col" className="hidden md:table-cell px-6 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Municipality</th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Subdivision</th>
                    <th scope="col" className="hidden xl:table-cell px-6 py-4 text-center text-sm sm:text-base font-bold text-gray-800">Wait Time</th>
                    <th scope="col" className="px-2 sm:px-6 py-4 text-right text-sm sm:text-base font-bold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {/* Skeleton rows */}
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="pl-4 sm:pl-5 pr-2 sm:pr-3 py-4 text-center w-10">
                        <div className="h-4 w-4 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="pl-5 sm:pl-6 pr-3 sm:pr-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-center">
                        <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Skeleton pagination */}
              <div className="bg-gray-50 px-3 sm:px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex justify-between w-full">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="flex space-x-1">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Data table with subtle loading for subsequent loads */}
      {!initialLoading && (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 w-auto relative">
          <div className="w-full max-w-none align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow">
              {/* Semi-transparent overlay only when actively loading */}
              {tableLoading && (
                <div className="absolute inset-0 bg-gray-50 bg-opacity-40 z-10 pointer-events-none">
                  {/* We don't need any content here, just a subtle overlay */}
                </div>
              )}
              
              <table className={`w-full table-fixed divide-y divide-gray-200 ${tableLoading ? 'opacity-70' : ''}`}>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="pl-4 sm:pl-5 pr-2 sm:pr-3 py-4 text-center text-sm sm:text-base font-bold text-gray-800 w-10">#</th>
                    <th scope="col" className="pl-5 sm:pl-6 pr-3 sm:pr-4 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Region/Description</th>
                    <th scope="col" className="hidden md:table-cell px-6 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Municipality</th>
                    <th scope="col" className="hidden lg:table-cell px-6 py-4 text-left text-sm sm:text-base font-bold text-gray-800">Subdivision</th>
                    <th scope="col" className="hidden xl:table-cell px-6 py-4 text-center text-sm sm:text-base font-bold text-gray-800">Wait Time</th>
                    <th scope="col" className="px-2 sm:px-6 py-4 text-right text-sm sm:text-base font-bold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCentres.length > 0 ? (
                    filteredCentres.map((centre, index) => (
                      <tr key={centre.id} className="hover:bg-gray-50 transition-colors">
                        <td className="pl-4 sm:pl-5 pr-2 sm:pr-3 py-3 sm:py-5 text-center text-sm sm:text-base font-semibold text-gray-700 w-10">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="pl-5 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{centre.region}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                            {centre.description}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:hidden">
                            {/* Show important info that's hidden in mobile */}
                            <span>{centre.municipalities}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm text-gray-900">{centre.municipalities}</div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-3 sm:py-5">
                          <div className="text-xs sm:text-sm text-gray-900">{centre.subdivision}</div>
                        </td>
                        <td className="hidden xl:table-cell px-6 py-3 sm:py-5 whitespace-nowrap text-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{centre.wait_time}</span>
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
                              onClick={() => handleDirectDelete(centre.id, centre.name)}
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
                      
                      {/* Generate page buttons with ellipsis for large ranges */}
                      {(() => {
                        // Function to generate page number buttons
                        const renderPageButton = (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border ${
                              pagination.page === pageNum
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } text-xs sm:text-sm font-medium`}
                          >
                            {pageNum}
                          </button>
                        );
                        
                        // Calculate which page buttons to show
                        const pageButtons = [];
                        
                        if (pagination.pages <= 7) {
                          // If 7 or fewer pages, show all
                          for (let i = 1; i <= pagination.pages; i++) {
                            pageButtons.push(renderPageButton(i));
                          }
                        } else {
                          // Always show first page
                          pageButtons.push(renderPageButton(1));
                          
                          // Show dots if current page is > 3
                          if (pagination.page > 3) {
                            pageButtons.push(
                              <span key="ellipsis1" className="relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white">
                                ...
                              </span>
                            );
                          }
                          
                          // Calculate start and end of middle pages
                          let startPage = Math.max(2, pagination.page - 1);
                          let endPage = Math.min(pagination.pages - 1, pagination.page + 1);
                          
                          // Adjust if at the beginning
                          if (pagination.page <= 3) {
                            endPage = Math.min(5, pagination.pages - 1);
                          }
                          
                          // Adjust if at the end
                          if (pagination.page >= pagination.pages - 2) {
                            startPage = Math.max(2, pagination.pages - 4);
                          }
                          
                          // Add middle page buttons
                          for (let i = startPage; i <= endPage; i++) {
                            pageButtons.push(renderPageButton(i));
                          }
                          
                          // Show dots if current page is < (pages - 2)
                          if (pagination.page < pagination.pages - 2) {
                            pageButtons.push(
                              <span key="ellipsis2" className="relative inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white">
                                ...
                              </span>
                            );
                          }
                          
                          // Always show last page
                          pageButtons.push(renderPageButton(pagination.pages));
                        }
                        
                        return pageButtons;
                      })()}
                      
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
          onCentreDeleted={(deletedId, centreName) => {
            // Update the centres list by removing the deleted centre
            setCentres(prevCentres => prevCentres.filter(c => c.id !== deletedId));
            // Show success message
            showSuccessMessage(`Centre "${centreName || 'Unknown'}" has been deleted successfully.`);
            // Close the modal
            setIsViewModalOpen(false);
          }}
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