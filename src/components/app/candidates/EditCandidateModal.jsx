import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Transition } from '@headlessui/react';
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

const EditCandidateModal = ({ isOpen, onClose, candidate, onCandidateUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [parties, setParties] = useState([]);
  const [loadingParties, setLoadingParties] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [partyError, setPartyError] = useState(null);
  const [isPartyDropdownOpen, setIsPartyDropdownOpen] = useState(false);
  const [isElectionTypeDropdownOpen, setIsElectionTypeDropdownOpen] = useState(false);
  const partyDropdownRef = useRef(null);
  const electionTypeDropdownRef = useRef(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    region: '',
    party_id: '',
    election_type: '',
    candidate_image: null
  });

  // Validation errors state
  const [errors, setErrors] = useState({
    name: null,
    position: null,
    region: null,
    party_id: null,
    election_type: null
  });

  // List of election types
  const electionTypes = [
    'presidential',
    'parliamentary',
    'legislative',
    'local',
    'municipal',
    'regional',
    'referendum'
  ];

  // Update visibility when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSubmitError(null);
      setSuccessMessage(null);
      
      // Fetch parties if needed
      fetchParties();
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Initialize or update form data when candidate prop changes
  useEffect(() => {
    if (candidate && isOpen) {
      setFormData({
        name: candidate.name || '',
        position: candidate.position || '',
        region: candidate.region || '',
        party_id: candidate.party_id || '',
        election_type: candidate.election_type || '',
        candidate_image: candidate.candidate_image || null
      });
      
      // Set photo preview if candidate has an image
      if (candidate.candidate_image) {
        setPhotoPreview(getImageUrl(candidate.candidate_image));
      } else {
        setPhotoPreview(null);
      }
      
      // Reset photo file
      setPhotoFile(null);
      
      // Reset validation errors
      setErrors({
        name: null,
        position: null,
        region: null,
        party_id: null,
        election_type: null
      });
    }
  }, [candidate, isOpen]);

  // Fetch all parties
  const fetchParties = async () => {
    try {
      setLoadingParties(true);
      setPartyError(null);
      const response = await api.get('/party/get-parties');
      
      // Log the response for debugging
      console.log('Party API response:', response);
      
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        // Debug log for party data including logos
        console.log('Party data with logos:', response.data.data);
        
        // Set parties from the response
        setParties(response.data.data);
      } else {
        console.error('Unexpected party data format:', response.data);
        setPartyError('Could not parse party data');
        setParties([]);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
      setPartyError('Failed to load parties');
      setParties([]);
    } finally {
      setLoadingParties(false);
    }
  };

  // Get image URL with proper format
  const getImageUrl = (imagePath) => {
    // Simply return the image URL without any modifications
      return imagePath;
  };

  // Function to handle form input changes
  const handleChange = e => {
    const { name, value, type, files } = e.target;

    // For file inputs, set the file object and create a preview URL
    if (type === 'file') {
      if (files.length > 0) {
        const file = files[0];
        setFormData({
          ...formData,
          [name]: file,
          [`${name}_preview`]: URL.createObjectURL(file)
        });
        
        // Clear specific error when user fixes it
        if (errors[name]) {
          setErrors({
            ...errors,
            [name]: null
          });
        }
      }
    } else {
      // For regular inputs, just set the value
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear specific error when user fixes it
    if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setPhotoFile(file);
    
    // Update formData with the new photo
    setFormData(prev => ({
      ...prev,
      candidate_image: file
    }));
    
    // Clear photo upload error if any
    if (errors.candidate_image) {
      setErrors((prev) => ({ ...prev, candidate_image: null }));
    }
  };

  // Remove photo preview and file
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    
    // If editing an existing candidate, this will remove the current photo
    setFormData((prev) => ({ ...prev, candidate_image: null }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Candidate name is required';
      isValid = false;
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
      isValid = false;
    }
    
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
      isValid = false;
    }
    
    if (!formData.election_type?.trim()) {
      newErrors.election_type = 'Election type is required';
      isValid = false;
    }
    
    // Update errors state
    setErrors(newErrors);
    return isValid;
  };

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    // Prepare form data for submission with multipart/form-data
    const data = new FormData();
    
    // Append all form fields to the FormData
    data.append('name', formData.name);
    data.append('position', formData.position);
    data.append('region', formData.region);
    data.append('election_type', formData.election_type);
    
    // Only append party_id if it exists and has a value
      if (formData.party_id) {
      data.append('party_id', formData.party_id);
    }
    
    // Only append candidate_image if it's a File object (not a string URL)
    if (formData.candidate_image && typeof formData.candidate_image !== 'string') {
      data.append('candidate_image', formData.candidate_image);
    } else if (photoFile) {
      // If user selected a new photo through the file input
      data.append('candidate_image', photoFile);
    }
    
    try {
      // Use apiService to update the candidate
      const updatedCandidate = await apiService.candidates.updateCandidate(candidate.id, data);
      
      // Handle success
      setSuccessMessage('Candidate updated successfully');
      
      // Notify parent component about the update
      if (typeof onCandidateUpdated === 'function') {
        onCandidateUpdated(updatedCandidate);
      }
      
      // Close modal after a short delay to show the success message
      setTimeout(() => {
        onClose(true); // Close modal and indicate refresh needed
      }, 1500);
    } catch (error) {
      console.error('Error updating candidate:', error);
      setSubmitError(error.message || 'Failed to update candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close party dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (partyDropdownRef.current && !partyDropdownRef.current.contains(event.target)) {
        setIsPartyDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="relative z-[200]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-emerald-600/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 200 }}
      />

      {/* Modal container - slide from right with more width */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 201 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
          <h2 className="text-2xl font-bold text-gray-800">Edit Candidate</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <form onSubmit={handleSubmit}>
            {/* Success message */}
            <Transition
              show={!!successMessage}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{successMessage}</p>
                  </div>
                </div>
              </div>
            </Transition>

            {/* Error message */}
            <Transition
              show={!!submitError}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{submitError}</p>
                  </div>
                </div>
              </div>
            </Transition>

            {/* Candidate photo */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Candidate Photo
              </h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Candidate" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=Photo";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer">
                      <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                    
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none"
                      >
                        <svg className="h-5 w-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove Photo
                      </button>
                    )}
                  </div>
                  
                  {errors.candidate_image && (
                    <p className="mt-2 text-sm text-red-600">{errors.candidate_image}</p>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Upload a clear photo of the candidate. Recommended size: 300x300px. Max size: 2MB. Formats: JPG, PNG.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate name */}
                  <div>
                    <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1">
                Candidate Name <span className="text-red-600">*</span>
              </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter candidate's full name"
                        className={`pl-16 w-full px-4 py-3 border ${
                          errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                        } rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out`}
                        required
              />
                    </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Position */}
                  <div>
                    <label htmlFor="position" className="block text-base font-semibold text-gray-700 mb-1">
                Position <span className="text-red-600">*</span>
              </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M18 14H17V15H18V14Z M7 15H13C13.55 15 14 14.55 14 14C14 13.45 13.55 13 13 13H7C6.45 13 6 13.45 6 14C6 14.55 6.45 15 7 15Z M13 11H7C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9H13C13.55 9 14 9.45 14 10C14 10.55 13.55 11 13 11Z M7 7H13C13.55 7 14 6.55 14 6C14 5.45 13.55 5 13 5H7C6.45 5 6 5.45 6 6C6 6.55 6.45 7 7 7Z M18 12H17V13H18V12Z M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z M12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3Z M19 19H5V5H19V19Z M18 10H17V11H18V10Z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter candidate's position"
                        className={`pl-16 w-full px-4 py-3 border ${
                          errors.position ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                        } rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out`}
                        required
              />
                    </div>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-base font-semibold text-gray-700 mb-1">
                Region <span className="text-red-600">*</span>
              </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                        <path d="M12 20.9l4.95-4.95a7 7 0 1 0-9.9 0L12 20.9zm0 2.828l-6.364-6.364a9 9 0 1 1 12.728 0L12 23.728zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                      </svg>
                    </div>
                    
                    {/* Vertical separator line */}
                    <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                    
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                      placeholder="E.g. Bioko Norte"
                      className={`pl-16 w-full px-4 py-3 border ${
                        errors.region ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out`}
                      required
                    />
                  </div>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region}</p>
              )}
            </div>

                {/* Party */}
                <div>
                  <label htmlFor="party_id" className="block text-base font-semibold text-gray-700 mb-1">
                    Party
              </label>
                  <div className="relative" ref={partyDropdownRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    
                    {/* Vertical separator line */}
                    <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                    
                {loadingParties ? (
                      <div className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white flex items-center">
                        <svg className="animate-spin mr-2 h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading parties...
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPartyDropdownOpen(!isPartyDropdownOpen)}
                        className={`pl-16 w-full px-4 py-3 border ${
                          errors.party_id || partyError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                        } rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out text-left flex items-center`}
                      >
                        {formData.party_id ? (
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const selectedParty = parties.find(p => p.id == formData.party_id);
                              return selectedParty?.logo ? (
                                <div className="w-5 h-5 mr-2 relative">
                                  <div 
                                    className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold bg-opacity-100"
                                    style={{ backgroundColor: selectedParty.color || '#00694B' }}
                                  >
                                    {selectedParty.name.charAt(0).toUpperCase()}
                                  </div>
                                  <img 
                                    src={getImageUrl(selectedParty.logo)}
                                    alt={`${selectedParty.name} logo`} 
                                    className="h-5 w-5 mr-2 object-contain absolute inset-0 z-10"
                                    onLoad={(e) => {
                                      e.target.style.zIndex = "10";
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load party logo: ${e.target.src}`);
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : selectedParty ? (
                                <div 
                                  className="h-5 w-5 mr-2 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: selectedParty.color || '#00694B' }}
                                >
                                  {selectedParty.name.charAt(0).toUpperCase()}
                                </div>
                              ) : null;
                            })()}
                            <span>
                              {(() => {
                                const selectedParty = parties.find(p => p.id == formData.party_id);
                                return selectedParty ? selectedParty.name : 'Select a party';
                              })()}
                            </span>
                  </div>
                ) : (
                          <span className="text-gray-500">Select a party</span>
                        )}
                        
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    )}
                    
                    {/* Party dropdown menu */}
                    {isPartyDropdownOpen && !loadingParties && (
                      <div 
                        ref={(el) => {
                          if (el) {
                            el.style.bottom = '100%';
                            el.style.top = 'auto';
                            el.style.marginBottom = '4px';
                            el.style.marginTop = '0';
                          }
                        }}
                        className="absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        style={{ maxHeight: '250px' }}
                      >
                        {parties.length > 0 ? (
                          <ul className="py-1">
                            {parties.map(party => (
                              <li
                                key={party.id}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 ${
                                  formData.party_id == party.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900'
                                }`}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, party_id: party.id }));
                                  setIsPartyDropdownOpen(false);
                                  if (errors.party_id) {
                                    setErrors(prev => ({ ...prev, party_id: null }));
                                  }
                                }}
                              >
                                <div className="flex items-center">
                                  {party.logo && (
                                    <div className="w-6 h-6 mr-3 relative">
                                      <div 
                                        className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold bg-opacity-100"
                                        style={{ backgroundColor: party.color || '#00694B' }}
                                      >
                                        {party.name.charAt(0).toUpperCase()}
                                      </div>
                                      <img 
                                        src={getImageUrl(party.logo)}
                                        alt={`${party.name} logo`} 
                                        className="h-6 w-6 mr-3 object-contain absolute inset-0 z-10"
                                        onLoad={(e) => {
                                          e.target.style.zIndex = "10";
                                        }}
                                        onError={(e) => {
                                          console.error(`Failed to load party logo in dropdown: ${e.target.src}`);
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                  {!party.logo && (
                                    <div 
                                      className="h-6 w-6 mr-3 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                      style={{ backgroundColor: party.color || '#00694B' }}
                                    >
                                      {party.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className={formData.party_id == party.id ? 'font-medium' : 'font-normal'}>
                        {party.name}
                                  </span>
                                </div>
                                
                                {formData.party_id == party.id && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="py-2 px-3 text-gray-700">No parties available</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {errors.party_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.party_id}</p>
                  )}
                  
                  {partyError && !errors.party_id && (
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-red-600">{partyError}</p>
                      <button 
                        type="button"
                        onClick={() => fetchParties()}
                        className="ml-2 text-sm text-emerald-600 hover:text-emerald-700 underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Election Type */}
                <div>
                  <label htmlFor="election_type" className="block text-base font-semibold text-gray-700 mb-1">
                    Election Type <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                        <path d="M19 4h-4V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14z"/>
                        <path d="M10.92 12.94L9.5 14.36l-1.06-1.06L7.38 14.36l2.12 2.12 3.54-3.54z"/>
                      </svg>
                    </div>
                    
                    {/* Vertical separator line */}
                    <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                    
                    <button
                      type="button"
                      onClick={() => setIsElectionTypeDropdownOpen(!isElectionTypeDropdownOpen)}
                      className={`pl-16 w-full px-4 py-3 border ${
                        errors.election_type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                      } rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out text-left flex items-center`}
                    >
                      {formData.election_type ? (
                        <span className="text-gray-900 capitalize">{formData.election_type}</span>
                      ) : (
                        <span className="text-gray-500">Select election type</span>
                      )}
                      
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                      </span>
                    </button>
                    
                    {isElectionTypeDropdownOpen && (
                      <div 
                        ref={electionTypeDropdownRef}
                        className="absolute z-10 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        style={{
                          bottom: '100%',
                          top: 'auto',
                          marginBottom: '4px',
                          maxHeight: '250px'
                        }}
                      >
                        {electionTypes.map((type) => (
                          <div
                            key={type}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 ${
                              formData.election_type === type ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900'
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, election_type: type });
                              setIsElectionTypeDropdownOpen(false);
                              if (errors.election_type) {
                                setErrors(prev => ({ ...prev, election_type: null }));
                              }
                            }}
                          >
                            <span className="capitalize">{type}</span>
                            {formData.election_type === type && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.election_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.election_type}</p>
                )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex-1 sm:flex-none"
              >
                Cancel
              </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex-1 sm:flex-none disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ 
                  "--tw-ring-color": "#00694B" 
                }}
                >
                  {isSubmitting ? (
                  <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                  </span>
                ) : 'Update Candidate'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCandidateModal; 