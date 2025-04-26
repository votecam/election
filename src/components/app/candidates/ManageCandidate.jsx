import React, { useState, useRef, useEffect } from 'react';
import apiService from '../../../services/apiService';
import axios from 'axios';
import ViewCandidateModal from './ViewCandidateModal';
import EditCandidateModal from './EditCandidateModal';

// Create axios instance with base URL from env
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

const ManageCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState({});  // Changed to an object for party lookup by ID
  const [loading, setLoading] = useState(true);
  const [partyLoading, setPartyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuButtonRefs = useRef({});
  const menuRef = useRef(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Fetch all parties when component mounts
  useEffect(() => {
    const fetchAllParties = async () => {
      try {
        setPartyLoading(true);
        // Use apiService.parties.getAll() to fetch parties
        const response = await apiService.parties.getAll();
        
        console.log('Parties response:', response);
        
        // Process party data into a map for easy lookup
        const partiesMap = {};
        
        // Handle the response format from the API
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          response.data.forEach(party => {
            partiesMap[party.id] = {
              id: party.id,
              name: party.name,
              logo: party.logo,
              color: party.color
            };
          });
          setParties(partiesMap);
        } else {
          console.error('Unexpected party data format:', response);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      } finally {
        setPartyLoading(false);
      }
    };
    
    fetchAllParties();
  }, []);
  
  // Fetch candidates data from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await apiService.candidates.getAll(pagination.page, pagination.limit);
        
        // Check if response has the expected structure
        if (response && response.candidates) {
          console.log("Candidates data:", response.candidates);
          setCandidates(response.candidates);
          setPagination(response.pagination || pagination);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Failed to load candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [pagination.page, pagination.limit]);
  
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
  
  // Get party details by ID
  const getParty = (partyId) => {
    if (!partyId) return { name: 'Unknown', color: '#808080' };
    return parties[partyId] || { name: partyId, color: '#808080', id: partyId };
  };
  
  // Filter candidates client-side for search functionality
  const filteredCandidates = candidates.filter(candidate => {
    const party = getParty(candidate.party_id);
    const matchesSearch = !searchTerm || 
                         candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (party.name && party.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Get image URL - simplified to use direct URLs from API
  const getImageUrl = (imagePath) => {
    return imagePath; // Return the URL directly without modification
  };

  // Get party badge component
  const getPartyBadge = (partyId) => {
    if (partyLoading) {
      return (
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-emerald-600 animate-spin"></div>
          <span className="text-sm">Loading party info...</span>
        </div>
      );
    }
    
    const party = getParty(partyId);
    
    return (
      <div className="flex items-center space-x-2">
        {party.logo ? (
          <div className="w-6 h-6 relative">
            {/* Always display the colored circle with initial as fallback */}
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: party.color || '#808080' }}
            >
              {party.name ? party.name.charAt(0) : partyId.charAt(0)}
            </div>
            {/* Try to load the image on top */}
            <img 
              src={getImageUrl(party.logo)}
              alt={party.name} 
              className="w-6 h-6 rounded-full object-cover absolute inset-0 z-10"
              style={{opacity: 0}} /* Start transparent */
              onLoad={(e) => {
                e.target.style.opacity = "1"; /* Make visible if load succeeds */
              }}
              onError={(e) => {
                /* Keep fallback visible on error */
                console.error(`Failed to load party logo: ${e.target.src}`);
                e.target.onerror = null;
              }}
            />
          </div>
        ) : (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: party.color || '#808080' }}
          >
            {party.name ? party.name.charAt(0) : partyId.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium">{party.name || partyId}</span>
      </div>
    );
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  // Function to open view modal with selected candidate
  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  // Function to open edit modal with selected candidate
  const handleEditCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  // Function to handle candidate update
  const handleCandidateUpdated = (updatedCandidate) => {
    // Update the candidates list with the updated candidate
    setCandidates(candidates.map(candidate => 
      candidate.id === updatedCandidate.id ? updatedCandidate : candidate
    ));
    
    // Update selected candidate if it's open in view modal
    if (selectedCandidate && selectedCandidate.id === updatedCandidate.id) {
      setSelectedCandidate(updatedCandidate);
    }
    
    // Show success message
    setSuccessMessage('Candidate updated successfully');
    
    // Clear success message after a delay
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Function to handle candidate deletion
  const handleCandidateDeleted = (candidateId) => {
    // Remove the deleted candidate from the list
    setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
    
    // Close view modal
    setIsViewModalOpen(false);
    
    // Show success message
    setSuccessMessage('Candidate deleted successfully');
    
    // Clear success message after a delay
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Function to handle direct delete button click
  const handleDirectDelete = (candidateId, candidateName) => {
    setSelectedCandidate({
      id: candidateId,
      name: candidateName
    });
    setShowDeleteConfirmation(true);
  };

  // Confirm delete candidate
  const confirmDeleteCandidate = async () => {
    try {
      setSubmitError(null);
      const candidateName = selectedCandidate.name || 'Unknown';
      
      // Use the apiService to delete the candidate
      await apiService.candidates.deleteCandidate(selectedCandidate.id);
      
      // Remove the deleted candidate from the state
      setCandidates(candidates.filter(c => c.id !== selectedCandidate.id));
      
      // Update pagination if needed
      const newTotalCount = pagination.total - 1;
      const newTotalPages = Math.ceil(newTotalCount / pagination.limit);
      
      // Update pagination state
      setPagination(prev => ({
        ...prev,
        total: newTotalCount,
        pages: newTotalPages
      }));
      
      // Close the delete confirmation
      setShowDeleteConfirmation(false);
      setSelectedCandidate(null);
      
      // Close the view modal if it's open
      setIsViewModalOpen(false);
      
      // Show success message
      setSuccessMessage(`Candidate "${candidateName}" has been deleted successfully.`);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setSubmitError(error.message || 'Failed to delete candidate');
    }
  };
  
  // Cancel delete
  const cancelDeleteCandidate = () => {
    setShowDeleteConfirmation(false);
    setSelectedCandidate(null);
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
            placeholder="Search candidates by name, party or position"
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
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Candidates Table */}
      {!loading && !error && (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">#</th>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Photo</th>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Candidate Name</th>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Party</th>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Position</th>
                <th scope="col" className="px-6 py-4 text-left text-base font-medium text-gray-700">Election Type</th>
                <th scope="col" className="px-6 py-4 text-right text-base font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, index) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {candidate.candidate_image ? (
                          <img 
                            src={getImageUrl(candidate.candidate_image)}
                            alt={candidate.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100?text=Photo";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base font-medium text-gray-900">{candidate.name}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getPartyBadge(candidate.party_id)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base text-gray-900">{candidate.position}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base text-gray-900">{candidate.election_type ? 
                        candidate.election_type.charAt(0).toUpperCase() + candidate.election_type.slice(1) : 
                        'N/A'}
                      </div>
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
                                  onClick={() => {
                                    setActiveMenu(null);
                                    handleViewCandidate(candidate);
                                  }}
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
                                  onClick={() => {
                                    setActiveMenu(null);
                                    handleEditCandidate(candidate);
                                  }}
                                >
                                  <svg className="h-4 w-4 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Candidate
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                                  role="menuitem"
                                  onClick={() => {
                                    setActiveMenu(null);
                                    handleDirectDelete(candidate.id, candidate.name);
                                  }}
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
                  <td colSpan="6" className="px-6 py-10 text-center">
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
      )}
      
      {/* Pagination */}
      {!loading && !error && filteredCandidates.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-base text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{' '}
                <span className="font-medium">{pagination.total}</span> candidates
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        pagination.page === pageNum
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  );
                  
                  // Calculate which page buttons to show
                  const pageButtons = [];
                  
                  // Ensure pages is at least 1
                  const numPages = Math.max(1, pagination.pages);
                  
                  if (numPages <= 7) {
                    // If 7 or fewer pages, show all
                    for (let i = 1; i <= numPages; i++) {
                      pageButtons.push(renderPageButton(i));
                    }
                  } else {
                    // Always show first page
                    pageButtons.push(renderPageButton(1));
                    
                    // Show dots if current page is > 3
                    if (pagination.page > 3) {
                      pageButtons.push(
                        <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    
                    // Calculate start and end of middle pages
                    let startPage = Math.max(2, pagination.page - 1);
                    let endPage = Math.min(numPages - 1, pagination.page + 1);
                    
                    // Adjust if at the beginning
                    if (pagination.page <= 3) {
                      endPage = Math.min(5, numPages - 1);
                    }
                    
                    // Adjust if at the end
                    if (pagination.page >= numPages - 2) {
                      startPage = Math.max(2, numPages - 4);
                    }
                    
                    // Add middle page buttons
                    for (let i = startPage; i <= endPage; i++) {
                      pageButtons.push(renderPageButton(i));
                    }
                    
                    // Show dots if current page is < (pages - 2)
                    if (pagination.page < numPages - 2) {
                      pageButtons.push(
                        <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    
                    // Always show last page
                    pageButtons.push(renderPageButton(numPages));
                  }
                  
                  return pageButtons;
                })()}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    pagination.page === pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Modal */}
      <ViewCandidateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        candidate={selectedCandidate}
        onCandidateDeleted={handleCandidateDeleted}
      />

      {/* Edit Candidate Modal */}
      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
        onCandidateUpdated={handleCandidateUpdated}
      />

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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Candidate</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this candidate? This action cannot be undone.
                    </p>
                    {submitError && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-600">{submitError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmDeleteCandidate}
              >
                Delete
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDeleteCandidate}
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

export default ManageCandidate; 