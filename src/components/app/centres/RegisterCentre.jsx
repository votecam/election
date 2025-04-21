import React, { useState, useRef, useEffect } from 'react';

const RegisterCentre = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    division: '',
    subdivision: '',
    location: '',
    gpsCoordinates: '',
    pollingStations: '',
    capacity: '',
    accessibilityFeatures: [],
    description: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [divisionOpen, setDivisionOpen] = useState(false);
  
  const regionRef = useRef(null);
  const divisionRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setRegionOpen(false);
      }
      if (divisionRef.current && !divisionRef.current.contains(event.target)) {
        setDivisionOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRegionSelect = (value) => {
    setFormData({
      ...formData,
      region: value
    });
    setRegionOpen(false);
  };
  
  const handleDivisionSelect = (value) => {
    setFormData({
      ...formData,
      division: value
    });
    setDivisionOpen(false);
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        accessibilityFeatures: [...formData.accessibilityFeatures, value]
      });
    } else {
      setFormData({
        ...formData,
        accessibilityFeatures: formData.accessibilityFeatures.filter(item => item !== value)
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        code: '',
        region: '',
        division: '',
        subdivision: '',
        location: '',
        gpsCoordinates: '',
        pollingStations: '',
        capacity: '',
        accessibilityFeatures: [],
        description: ''
      });
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
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
            <a href="#" className="text-gray-500 hover:text-gray-700">Centre Management</a>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 font-medium">Register Centre</span>
          </li>
        </ol>
      </nav>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Register Polling Centre</h1>
        <div className="w-32 h-1 bg-emerald-600 rounded-sm mt-2"></div>
        <div className="flex items-center mt-2">
          <p className="text-gray-600 text-lg">Add a new polling centre to the electoral information system</p>
        </div>
      </header>
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-emerald-800">
                Polling centre was successfully registered!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-100 w-full overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Two inputs per row layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Centre Name */}
          <div>
            <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1">
              Centre Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M21 10h-4V4h3c.6 0 1 .4 1 1v5z" />
                  <path fillRule="evenodd" d="M7 4v6H3V5c0-.6.4-1 1-1h3zm13 12v-6H4v6c0 .6.4 1 1 1h14c.6 0 1-.4 1-1z" clipRule="evenodd" />
                  <path d="M9 14h6v-3.5l3.5 3.5-3.5 3.5V14z" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. Central Community Hall"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Centre Code */}
          <div>
            <label htmlFor="code" className="block text-base font-semibold text-gray-700 mb-1">
              Centre Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M4 5h16v2H4V5z" />
                  <path fillRule="evenodd" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 3v14h16V6H4z" clipRule="evenodd" />
                  <path d="M7 11h10v2H7v-2z" />
                  <path d="M7 15h7v2H7v-2z" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                name="code"
                id="code"
                required
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. CCH001"
                value={formData.code}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-base font-semibold text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. 123 Main Street"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
          
            {/* Region - Custom Dropdown */}
          <div>
            <label htmlFor="region" className="block text-base font-semibold text-gray-700 mb-1">
              Region
            </label>
              <div className="relative" ref={regionRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z" />
                </svg>
              </div>
                
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${regionOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setRegionOpen(!regionOpen)}
                >
                  <span className={formData.region ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {formData.region || "Select Region"}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${regionOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {regionOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-xl border border-gray-200 rounded-md overflow-hidden transform origin-top transition-all duration-200 ease-in-out">
                    <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center"
                        onClick={() => handleRegionSelect("")}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Region
                      </div>
                      {["North", "South", "East", "West", "Central"].map((region) => (
                        <div 
                          key={region}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                            formData.region === region 
                              ? "text-emerald-700 font-medium" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleRegionSelect(region)}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${formData.region === region ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {formData.region === region ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {region}
                          </div>
                          <span className="text-xs text-gray-400 italic">{region.charAt(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          
            {/* Division - Custom Dropdown */}
          <div>
            <label htmlFor="division" className="block text-base font-semibold text-gray-700 mb-1">
              Division
            </label>
              <div className="relative" ref={divisionRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M22 20v-9a1 1 0 0 0-.486-.857l-9-5.4a2 2 0 0 0-2.028 0l-9 5.4A1 1 0 0 0 1 11v9a1 1 0 0 0 1 1h5v-6h8v6h5a1 1 0 0 0 1-1zm-10-9v-1a2 2 0 1 0-4 0v1h4z" />
                </svg>
              </div>
                
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${divisionOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setDivisionOpen(!divisionOpen)}
                >
                  <span className={formData.division ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {formData.division || "Select Division"}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${divisionOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {divisionOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-xl border border-gray-200 rounded-md overflow-hidden transform origin-top transition-all duration-200 ease-in-out">
                    <div className="py-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center"
                        onClick={() => handleDivisionSelect("")}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Division
                      </div>
                      {["Urban", "Rural", "Suburban"].map((division) => (
                        <div 
                          key={division}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                            formData.division === division 
                              ? "text-emerald-700 font-medium" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleDivisionSelect(division)}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${formData.division === division ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {formData.division === division ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {division}
                          </div>
                          <span className="text-xs text-gray-400 italic">{division.charAt(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          
          {/* Subdivision */}
          <div>
            <label htmlFor="subdivision" className="block text-base font-semibold text-gray-700 mb-1">
              Subdivision
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M3 19V5.7a1 1 0 0 1 .658-.94l9.671-3.516a.5.5 0 0 1 .671.47v4.953l6.316 2.105a1 1 0 0 1 .684.949V19h2v2H3v-2h2zm2 0h7V3.855L5 6.401V19zm14 0v-8.558l-5-1.667V19h5z" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                name="subdivision"
                id="subdivision"
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. Downtown Area"
                value={formData.subdivision}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* GPS Coordinates */}
          <div>
            <label htmlFor="gpsCoordinates" className="block text-base font-semibold text-gray-700 mb-1">
              GPS Coordinates
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                name="gpsCoordinates"
                id="gpsCoordinates"
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. 6.1350° N, 1.2085° E"
                value={formData.gpsCoordinates}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Number of Polling Stations */}
          <div>
            <label htmlFor="pollingStations" className="block text-base font-semibold text-gray-700 mb-1">
              Number of Polling Stations
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path fillRule="evenodd" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm5 1h10v-2H7v2z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="number"
                name="pollingStations"
                id="pollingStations"
                required
                min="1"
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. 5"
                value={formData.pollingStations}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Capacity */}
            <div className="md:col-span-2">
            <label htmlFor="capacity" className="block text-base font-semibold text-gray-700 mb-1">
              Voter Capacity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M2 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H2zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm8.284 3.703A8.002 8.002 0 0 1 23 22h-2a6.001 6.001 0 0 0-3.537-5.473l.82-1.824zm-.688-11.29A5.5 5.5 0 0 1 21 8.5a5.5 5.5 0 0 1-5 5.478v-2.013a3.5 3.5 0 0 0 1.041-6.609l.555-1.943z" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="number"
                name="capacity"
                id="capacity"
                min="0"
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="E.g. 1000"
                value={formData.capacity}
                onChange={handleChange}
              />
              </div>
            </div>
          </div>
          
          {/* Accessibility Features */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Accessibility Features
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'wheelchair', label: 'Wheelchair Access', icon: '♿' },
                { id: 'elevator', label: 'Elevator Access', icon: '🔼' },
                { id: 'parking', label: 'Accessible Parking', icon: '🅿️' },
                { id: 'restroom', label: 'Accessible Restrooms', icon: '🚻' },
                { id: 'signage', label: 'Braille Signage', icon: '👁️' },
                { id: 'hearing', label: 'Hearing Assistance', icon: '👂' }
              ].map((feature) => (
                <div key={feature.id} className="flex items-center">
                  <input
                    id={feature.id}
                    name={feature.id}
                    type="checkbox"
                    value={feature.id}
                    checked={formData.accessibilityFeatures.includes(feature.id)}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 border-gray-300 rounded focus:ring-emerald-500"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      color: "#00694B" 
                    }}
                  />
                  <label htmlFor={feature.id} className="ml-3 text-base font-medium text-gray-700">
                    <span className="mr-2">{feature.icon}</span> {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
              style={{ 
                "--tw-ring-color": "#00694B",
                "--tw-border-opacity": 1,
                "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
              }}
              placeholder="Additional information about this polling centre"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 px-5 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
              style={{ 
                background: "linear-gradient(to right, #00694B, #005941)", 
                "--tw-ring-color": "#00694B" 
              }}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering Centre...
                </div>
              ) : (
                'Register Centre'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCentre; 