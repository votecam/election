import React, { useState, useRef, useEffect } from 'react';
import apiService from '../../../services/apiService';
import axios from 'axios';

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

const RegisterCandidate = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    party: '',
    partyName: '',
    position: '',
    region: '',
    election_type: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [partyOpen, setPartyOpen] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);
  const [electionTypeOpen, setElectionTypeOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    message: ''
  });
  const [parties, setParties] = useState([]);
  const [loadingParties, setLoadingParties] = useState(false);
  
  const partyRef = useRef(null);
  const positionRef = useRef(null);
  const electionTypeRef = useRef(null);
  const topRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (partyRef.current && !partyRef.current.contains(event.target)) {
        setPartyOpen(false);
      }
      if (positionRef.current && !positionRef.current.contains(event.target)) {
        setPositionOpen(false);
      }
      if (electionTypeRef.current && !electionTypeRef.current.contains(event.target)) {
        setElectionTypeOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Scroll to top when success message appears
  useEffect(() => {
    if (submitSuccess) {
      window.scrollTo(0, 0);
    }
  }, [submitSuccess]);
  
  // Fetch parties on component mount
  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoadingParties(true);
        // Use apiService.parties.getAll() to fetch parties
        const response = await apiService.parties.getAll();
        console.log('Parties response:', response);
        
        // Check if the response has the expected data structure
        if (response && response.status === 'success' && Array.isArray(response.data)) {
          // Debug log for party data including logos
          console.log('Party data with logos:', response.data);
          
          setParties(response.data);
        } else {
          console.warn('Unexpected parties data format:', response);
          // In case of empty data
          setParties([]);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
        setAlert({
          show: true,
          type: 'error',
          message: 'Failed to load parties. Please refresh the page.'
        });
      } finally {
        setLoadingParties(false);
      }
    };
    
    fetchParties();
  }, []);
  
  // Updated function to directly use logo URLs from API
  const getPartyLogo = (logoPath) => {
    // Simply return the logo URL as is
    return logoPath;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePartySelect = (partyId, partyName) => {
    setFormData({
      ...formData,
      party: partyId,
      partyName: partyName // Store the party name separately for display
    });
    setPartyOpen(false);
  };
  
  const handlePositionSelect = (value) => {
    setFormData({
      ...formData,
      position: value
    });
    setPositionOpen(false);
  };
  
  const handleElectionTypeSelect = (value) => {
    setFormData({
      ...formData,
      election_type: value
    });
    setElectionTypeOpen(false);
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual file
      setPhotoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Immediately scroll to top when register button is clicked
    scrollToTop();
    
    // Reset any previous errors
    setErrors([]);
    
    // Check if photo is selected
    if (!photoFile) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Candidate photo is required'
      });
      
      // Auto-hide error alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'error',
          message: ''
        });
      }, 5000);
      return;
    }
    
    // Check if election type is selected
    if (!formData.election_type) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Election type is required'
      });
      
      // Auto-hide error alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'error',
          message: ''
        });
      }, 5000);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare data for API
      const candidateData = {
        ...formData,
        photo: photoFile
      };
      
      // Call API to register candidate
      const registeredCandidate = await apiService.candidates.register(candidateData);
      
      // Log the response
      console.log('Registered candidate:', registeredCandidate);
      
      // Handle success
      setSubmitSuccess(true);
      
      // Set success message with candidate details
      setAlert({
        show: true,
        type: 'success',
        message: `${registeredCandidate.name} has been successfully registered as a candidate for ${registeredCandidate.position} in the ${registeredCandidate.election_type} election.`
      });
      
      // Reset form after successful submission
      setFormData({
        fullName: '',
        party: '',
        partyName: '',
        position: '',
        region: '',
        election_type: ''
      });
      setPhotoPreview(null);
      setPhotoFile(null);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setAlert({
          show: false,
          type: 'success',
          message: ''
        });
      }, 5000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status
      });
      
      // Extract error details if they exist
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Check if the response includes validation details
        if (errorData.details && Array.isArray(errorData.details)) {
          setErrors(errorData.details);
        } else if (errorData.message) {
          // If there's just a message, set it as a single error
          setErrors([errorData.message]);
        }
        
        // Set the alert with the error message
        setAlert({
          show: true,
          type: 'error',
          message: errorData.message || 'Failed to register candidate. Please try again.'
        });
      } else {
        // For other types of errors
        setAlert({
          show: true,
          type: 'error',
          message: error.message || 'Failed to register candidate. Please try again.'
        });
      }
      
      // Auto-hide error alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'error',
          message: ''
        });
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  // List of possible positions
  const positions = [
    'Presidential Candidate',
    'Vice Presidential Candidate',
    'Senate Candidate',
    'Governor Candidate',
    'Mayor Candidate',
    'Representative',
    'Councilor',
    'Party Chairman',
    'Regional Delegate',
    'Divisional Officer',
    'MP - Member of Parliament',
    'Senator',
    'Regional Councilor',
    'Other'
  ];

  // List of election types
  const electionTypes = [
    'presidential',
    'parliamentary',
    'municipal',
   
    
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div ref={topRef} id="top" className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Register New Candidate</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-base text-gray-600 mt-3">Complete the form below to add a candidate to the electoral system</p>
      </div>
      
      {/* Success Message */}
      {(submitSuccess || (alert.show && alert.type === 'success')) && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-emerald-800">
                {alert.type === 'success' && alert.message ? 
                  alert.message : 
                  'Candidate was successfully registered!'}
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                You can now view this candidate in the candidate management section.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Messages */}
      {alert.show && alert.type === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-red-800">
                {alert.message}
              </p>
              {errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      
     {/* Registration Form */}
<div className="bg-white border border-gray-100 w-full">
  <form onSubmit={handleSubmit} className="p-6 space-y-8">
    {/* Two columns per row layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-base font-semibold text-gray-700 mb-2">
          Full Name <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
              <path d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            placeholder="Enter candidate's full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Enter the candidate's complete legal name</p>
      </div>
      
      {/* Region */}
      <div>
        <label htmlFor="region" className="block text-base font-semibold text-gray-700 mb-2">
          Region <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
              <path d="M15 21H9V12.6C8.72202 12.8454 8.38571 13 8 13C7.08954 13 6.30085 12.4174 6.07089 11.5914C6.02417 11.4422 6 11.2852 6 11.1213V6.97926C6 6.43125 6.2341 5.91622 6.63876 5.57443L11.1221 1.81944C11.6549 1.3616 12.3452 1.3616 12.878 1.81944L17.3613 5.57443C17.7659 5.91622 18 6.43125 18 6.97926V11.1213C18 11.2852 17.9759 11.4422 17.9292 11.5914C17.7566 12.1411 17.3535 12.5861 16.8325 12.8318C16.5897 12.9401 16.3258 13 16.0001 13C15.6144 13 15.278 12.8454 15 12.6V21ZM10.5 16.5C10.5 16.2239 10.7239 16 11 16H13C13.2761 16 13.5 16.2239 13.5 16.5V19.5C13.5 19.7761 13.2761 20 13 20H11C10.7239 20 10.5 19.7761 10.5 19.5V16.5Z" />
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <input
            type="text"
            name="region"
            id="region"
            required
            className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            placeholder="Enter candidate's region"
            value={formData.region}
            onChange={handleChange}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Specify the electoral region of the candidate</p>
      </div>
      
      {/* Party Selection */}
      <div>
        <label htmlFor="party" className="block text-base font-semibold text-gray-700 mb-2">
          Political Party <span className="text-red-600">*</span>
        </label>
        <div className="relative" ref={partyRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <button
            type="button"
            className={`pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-left focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white ${!formData.partyName && 'text-gray-500'}`}
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            onClick={() => setPartyOpen(!partyOpen)}
          >
            {formData.party && formData.party !== 'other' ? (
              (() => {
                const selectedParty = parties.find(p => p.id === formData.party);
                return selectedParty ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 relative flex-shrink-0">
                      {/* Always show the colored circle with initial as a reliable fallback */}
                      <div 
                        className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold bg-opacity-100"
                        style={{ backgroundColor: selectedParty.color || '#00694B' }}
                      >
                        {selectedParty.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Only attempt to load image if logo exists */}
                      {selectedParty.logo && (
                        <img 
                          src={getPartyLogo(selectedParty.logo)}
                          alt={`${formData.partyName} logo`} 
                          className="h-5 w-5 object-contain absolute inset-0 z-10"
                          style={{opacity: 0}} /* Start transparent */
                          onLoad={(e) => {
                            e.target.style.opacity = "1"; /* Make visible if load succeeds */
                            e.target.style.zIndex = "10";
                          }}
                          onError={(e) => {
                            /* Just keep hidden on error, fallback is already visible */
                            console.error(`Failed to load party logo: ${e.target.src}`);
                            e.target.onerror = null;
                          }}
                        />
                      )}
                    </div>
                    <span>{formData.partyName}</span>
                  </div>
                ) : <span>Select a political party</span>;
              })()
            ) : (
              <span>{formData.partyName || 'Select a political party'}</span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <p className="mt-1 text-xs text-gray-500">Select the political affiliation of the candidate</p>
          
          {partyOpen && (
            <div className="absolute z-10 mt-0 w-full bg-white shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-300"
              style={{ maxHeight: '250px', overflowY: 'auto', bottom: 'auto', top: '100%' }}>
              {loadingParties ? (
                <div className="p-2 text-center text-gray-500">Loading parties...</div>
              ) : parties.length > 0 ? (
                <ul>
                  {parties.map((party) => (
                    <li
                      key={party.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 text-gray-900"
                      onClick={() => handlePartySelect(party.id, party.name)}
                    >
                      <div className="flex items-center">
                        {party.logo ? (
                          <div className="w-6 h-6 mr-3 relative flex-shrink-0">
                            {/* Always display the colored circle with initial */}
                            <div 
                              className="absolute inset-0 rounded-full flex items-center justify-center text-white text-xs font-bold bg-opacity-100"
                              style={{ backgroundColor: party.color || '#00694B' }}
                            >
                              {party.name.charAt(0).toUpperCase()}
                            </div>
                            {/* Try to load the image on top */}
                            <img 
                              src={getPartyLogo(party.logo)}
                              alt={`${party.name} logo`} 
                              className="h-6 w-6 object-contain absolute inset-0 z-10"
                              style={{opacity: 0}} /* Start transparent */
                              onLoad={(e) => {
                                e.target.style.opacity = "1"; /* Make visible if load succeeds */
                                e.target.style.zIndex = "10";
                              }}
                              onError={(e) => {
                                /* Just keep hidden on error, fallback is already visible */
                                console.error(`Failed to load party logo in dropdown: ${e.target.src}`);
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                        ) : (
                          <div 
                            className="h-6 w-6 mr-3 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: party.color || '#00694B' }}
                          >
                            {party.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={`${formData.party === party.id ? 'font-medium' : ''} truncate`}>
                          {party.name}
                        </span>
                      </div>
                      {formData.party === party.id && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                  <li
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 text-gray-900 border-t border-gray-200"
                    onClick={() => handlePartySelect('other', 'Other')}
                  >
                    <div className="flex items-center">
                      <span className={formData.party === 'other' ? 'font-medium' : ''}>
                        Other
                      </span>
                    </div>
                    {formData.party === 'other' && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                </ul>
              ) : (
                <div className="p-2 text-center text-gray-500">No parties available</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Position Selection */}
      <div>
        <label htmlFor="position" className="block text-base font-semibold text-gray-700 mb-2">
          Position <span className="text-red-600">*</span>
        </label>
        <div className="relative" ref={positionRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
              <path d="M18 14H17V15H18V14Z M7 15H13C13.55 15 14 14.55 14 14C14 13.45 13.55 13 13 13H7C6.45 13 6 13.45 6 14C6 14.55 6.45 15 7 15Z M13 11H7C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9H13C13.55 9 14 9.45 14 10C14 10.55 13.55 11 13 11Z M7 7H13C13.55 7 14 6.55 14 6C14 5.45 13.55 5 13 5H7C6.45 5 6 5.45 6 6C6 6.55 6.45 7 7 7Z M18 12H17V13H18V12Z M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z M12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3Z M19 19H5V5H19V19Z M18 10H17V11H18V10Z" />
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <button
            type="button"
            className={`pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-left focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white ${!formData.position && 'text-gray-500'}`}
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            onClick={() => setPositionOpen(!positionOpen)}
          >
            <span>
              {formData.position || 'Select a position'}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <p className="mt-1 text-xs text-gray-500">Select the electoral position the candidate is contesting</p>
          
          {positionOpen && (
            <div className="absolute z-10 mt-0 w-full bg-white shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-300"
              style={{ maxHeight: '250px', overflowY: 'auto', bottom: 'auto', top: '100%' }}>
              <ul>
                {positions.map((position, index) => (
                  <li
                    key={index}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 text-gray-900"
                    onClick={() => handlePositionSelect(position)}
                  >
                    <div className="flex items-center">
                      <span className={`${formData.position === position ? 'font-medium' : ''} truncate`}>
                        {position}
                      </span>
                    </div>
                    {formData.position === position && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Election Type Selection */}
      <div>
        <label htmlFor="election_type" className="block text-base font-semibold text-gray-700 mb-2">
          Election Type <span className="text-red-600">*</span>
        </label>
        <div className="relative" ref={electionTypeRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
              <path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <button
            type="button"
            className={`pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-left focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white ${!formData.election_type && 'text-gray-500'}`}
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            onClick={() => setElectionTypeOpen(!electionTypeOpen)}
          >
            <span>
              {formData.election_type ? 
                formData.election_type.charAt(0).toUpperCase() + formData.election_type.slice(1) : 
                'Select election type'}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <p className="mt-1 text-xs text-gray-500">Select the type of election this candidate is participating in</p>
          
          {electionTypeOpen && (
            <div className="absolute z-10 mt-0 w-full bg-white shadow-lg max-h-60 py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-300"
              style={{ maxHeight: '250px', overflowY: 'auto', bottom: 'auto', top: '100%' }}>
              <ul>
                {electionTypes.map((type, index) => (
                  <li
                    key={index}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50 text-gray-900"
                    onClick={() => handleElectionTypeSelect(type)}
                  >
                    <div className="flex items-center">
                      <span className={`${formData.election_type === type ? 'font-medium' : ''} truncate`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </div>
                    {formData.election_type === type && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Photo Upload - Takes full width at bottom */}
    <div className="mt-8 col-span-full">
      <label className="block text-base font-semibold text-gray-700 mb-3">
        Candidate Photo <span className="text-red-600">*</span>
      </label>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label htmlFor="photo-upload" className="flex-shrink-0 h-32 w-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200 mx-auto md:mx-0 cursor-pointer relative group">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
              <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs mt-1">Add Photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="photo-upload"
            name="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="sr-only"
            required
          />
        </label>
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start">
          <h4 className="font-medium text-gray-700 mb-1">Candidate's Official Photo</h4>
          <p className="text-sm text-gray-600">
            Click on the image circle to upload a candidate photo
          </p>
          <ul className="mt-2 text-xs text-gray-500 list-disc pl-5 space-y-1">
            <li>Clear, front-facing photo</li>
            <li>Professional appearance</li>
            <li>Plain background preferred</li>
            <li>JPG, PNG or GIF up to 10MB</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Form Actions - Improved Layout */}
    <div className="mt-10 flex justify-end space-x-4">
      <button
        type="button"
        className="px-6 py-3 border border-gray-300 rounded-none shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Cancel Registration
      </button>
      <button
        type="submit"
        onClick={scrollToTop}
        className={`inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-none text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
          submitting 
          ? 'bg-emerald-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
        }`}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Register Candidate'
        )}
      </button>
    </div>
  </form>
</div>
    </div>
  );
};

export default RegisterCandidate; 