import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import apiService from '../../../services/apiService';

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

const ViewCandidateModal = ({ isOpen, onClose, candidate, onCandidateDeleted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [partyDetails, setPartyDetails] = useState(null);
  const [loadingParty, setLoadingParty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDeleteError(null);
      
      // If candidate has a party_id, fetch the party details
      if (candidate?.party_id) {
        fetchPartyDetails(candidate.party_id);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, candidate]);

  // Fetch party details if needed
  const fetchPartyDetails = async (partyId) => {
    try {
      setLoadingParty(true);
      const response = await api.get(`/party/get-party/${partyId}`);
      
      if (response.data && response.data.status === 'success') {
        setPartyDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching party details:', error);
    } finally {
      setLoadingParty(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Format the candidate data to match the expected structure
  const candidateData = {
    id: candidate?.id || 'N/A',
    name: candidate?.name || 'N/A',
    position: candidate?.position || 'N/A',
    region: candidate?.region || 'N/A',
    party_id: candidate?.party_id || 'N/A',
    candidate_image: candidate?.candidate_image || null,
    createdAt: candidate?.createdAt || new Date().toISOString(),
    updatedAt: candidate?.updatedAt || new Date().toISOString(),
    election_type: candidate?.election_type || null
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Handle delete button click
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setDeleteError(null);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Use the apiService to delete the candidate
      await apiService.candidates.deleteCandidate(candidateData.id);
      
      // Successfully deleted
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      
      // Notify parent component about the deletion with candidate name for success message
      if (typeof onCandidateDeleted === 'function') {
        onCandidateDeleted(candidateData.id, candidateData.name);
      }
      
      onClose();
    } catch (error) {
      console.error("Error during delete operation:", error);
      setDeleteError(error.message || 'An error occurred while deleting the candidate');
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteError(null);
  };

  // Get image URL with proper format
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's a full URL, use it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // For all relative paths including /assets/images paths,
    // use the API base URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const cleanBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    
    // For paths with leading slash, maintain it
    if (imagePath.startsWith('/')) {
      return `${cleanBaseUrl}${imagePath}`;
    }
    
    // For paths without leading slash, add one
    return `${cleanBaseUrl}/${imagePath}`;
  };

  return (
    <div className="relative z-[100]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-[#4F46E5]/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 100 }}
      />

      {/* Modal container */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 101 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Candidate Details</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          {/* Candidate Image and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0 border-4 border-gray-200">
              {candidateData.candidate_image ? (
                <img
                  src={getImageUrl(candidateData.candidate_image)}
                  alt={candidateData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Photo";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <svg className="h-16 w-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-bold text-gray-800">{candidateData.name}</h3>
              <p className="text-xl text-gray-600 mt-1">{candidateData.position}</p>
              
              {/* Party Info */}
              {loadingParty ? (
                <div className="mt-2 flex items-center justify-center sm:justify-start">
                  <div className="w-4 h-4 mr-2 rounded-full border-2 border-t-transparent border-blue-600 animate-spin"></div>
                  <span className="text-sm text-gray-500">Loading party info...</span>
                </div>
              ) : partyDetails ? (
                <div className="mt-2 flex items-center justify-center sm:justify-start">
                  {partyDetails.logo ? (
                    <img
                      src={getImageUrl(partyDetails.logo)}
                      alt={partyDetails.name}
                      className="w-6 h-6 mr-2 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: partyDetails.color || '#808080' }}
                    >
                      {partyDetails.name ? partyDetails.name.charAt(0) : 'P'}
                    </div>
                  )}
                  <span className="text-base font-medium">{partyDetails.name}</span>
                </div>
              ) : candidateData.party_id !== 'N/A' ? (
                <p className="text-base text-gray-600 mt-2">Party ID: {candidateData.party_id}</p>
              ) : null}
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Candidate Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-base font-medium">{candidateData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-base font-medium">{candidateData.position}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Election Type</p>
                  <p className="text-base font-medium">
                    {candidateData.election_type ? 
                      candidateData.election_type.charAt(0).toUpperCase() + candidateData.election_type.slice(1) : 
                      'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Registered On</p>
                  <p className="text-base font-medium">{formatDate(candidateData.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Party Section - Only shown if party details are available */}
          {partyDetails && (
            <div className="bg-gray-50 rounded-lg p-5 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Party Information</h4>
              
              <div className="flex items-center mb-4">
                {partyDetails.logo ? (
                  <img
                    src={getImageUrl(partyDetails.logo)}
                    alt={partyDetails.name}
                    className="w-12 h-12 mr-4 object-contain bg-white p-1 rounded shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/48?text=Logo";
                    }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: partyDetails.color || '#808080' }}
                  >
                    {partyDetails.name ? partyDetails.name.charAt(0) : 'P'}
                  </div>
                )}
                
                <div>
                  <p className="text-base font-semibold">{partyDetails.name}</p>
                  <p className="text-sm text-gray-500">ID: {partyDetails.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions Buttons */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex space-x-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action
                  onClose(); // Close view modal first
                  if (typeof candidate.onEdit === 'function') {
                    candidate.onEdit(candidate);
                  }
                }}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Edit Candidate
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Candidate
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

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
                    {deleteError && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-600">{deleteError}</p>
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
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                  isDeleting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDelete}
                disabled={isDeleting}
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

export default ViewCandidateModal; 