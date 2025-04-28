import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../../services/apiService';

const Settings = () => {
  // State for settings data
  const [settings, setSettings] = useState({
    electionDate: '',
    displayYear: '',
    countdownEnabled: false,
    electionCategory: '',
    notifications: {
      email: true,
      browser: true,
      reports: false
    },
    appearance: {
      sidebarCollapsed: false,
      highContrast: false
    },
    privacy: {
      shareData: false,
      activityLog: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // State for custom dropdowns
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  
  // Refs for handling dropdown clicks
  const categoryRef = useRef(null);
  const yearRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setYearOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Function to fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.settings.getAllSettings();
      if (response.status === 'success' && response.data.settings.length > 0) {
        const setting = response.data.settings[0];
        setSettings(prev => ({
          ...prev,
          electionDate: new Date(setting.date).toISOString().split('T')[0],
          displayYear: setting.year.toString(),
          electionCategory: setting.election_category.toLowerCase(),
          countdownEnabled: true
        }));
      }
      setError(null);
    } catch (err) {
      // Only show error for actual API failures, not for no settings found
      if (err.response?.status === 500 || err.response?.status === 404) {
        setError('Failed to fetch settings. Please try again later.');
        console.error('Error fetching settings:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to add settings
  const addSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if settings already exist
      const existingSettings = await apiService.settings.getAllSettings();
      
      // Check if there's already a setting with the same year and category
      const settingExists = existingSettings.data.settings.some(setting => 
        setting.year === parseInt(settings.displayYear) && 
        setting.election_category.toLowerCase() === settings.electionCategory.toLowerCase()
      );

      if (settingExists) {
        setError(`Settings for ${settings.displayYear} ${settings.electionCategory} election already exist.`);
        return;
      }
      
      const settingData = {
        year: parseInt(settings.displayYear),
        election_category: settings.electionCategory.charAt(0).toUpperCase() + settings.electionCategory.slice(1),
        date: new Date(settings.electionDate).toISOString()
      };
      
      const response = await apiService.settings.addSetting(settingData);
      
      if (response.status === 'success') {
        setSuccessMessage('Settings added successfully!');
        setError(null);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to add settings');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add settings. Please try again later.');
      }
      console.error('Error adding settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for updating settings
  const handleElectionDateChange = (e) => {
    setSettings(prev => ({
      ...prev,
      electionDate: e.target.value
    }));
  };

  const handleCategorySelect = (value) => {
    setSettings(prev => ({
      ...prev,
      electionCategory: value
    }));
    setCategoryOpen(false);
  };

  const handleYearSelect = (value) => {
    setSettings(prev => ({
      ...prev,
      displayYear: value
    }));
    setYearOpen(false);
  };

  const toggleCountdown = () => {
    setSettings(prev => ({
      ...prev,
      countdownEnabled: !prev.countdownEnabled
    }));
  };

  const toggleNotification = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const toggleAppearance = (type) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [type]: !prev.appearance[type]
      }
    }));
  };

  const togglePrivacy = (type) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }));
  };

  // Reusable toggle switch component
  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-emerald-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
  
  // Add style to parent container
  const cardStyle = {
    position: 'relative',
    overflow: 'visible'  // This ensures dropdowns can extend outside
  };
  
  // Add improved styles for dropdowns
  const dropdownStyle = {
    zIndex: 9999,
    position: 'absolute',
    top: 'calc(100% + 5px)',  // Add a small gap
    left: 0,
    width: '100%',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    animation: 'dropdownFadeIn 0.2s ease-out forwards'
  };

  // Add custom animation keyframes in a style tag
  const dropdownAnimationStyle = `
    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  // Function to handle keyboard events for accessibility
  const handleDropdownKeyDown = (e, isOpen, setOpen, onSelect, options, currentValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        setOpen(true);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen && options) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.id === currentValue);
      const nextIndex = (currentIndex + 1) % options.length;
      onSelect(options[nextIndex].id);
    } else if (e.key === 'ArrowUp' && isOpen && options) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.id === currentValue);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onSelect(options[prevIndex].id);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-0.5 w-32 bg-gray-200 rounded-sm mt-2 animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-md border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-64 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-64 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-64 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Include the animation keyframes */}
      <style>{dropdownAnimationStyle}</style>
      
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">System Settings</h1>
            <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
            <p className="text-gray-600 text-base sm:text-lg mt-1">Manage application preferences and configurations</p>
          </div>
          <Link
            to="/app/settings/manage"
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300 text-center"
            style={{ 
              background: "linear-gradient(to right, #00694B, #005941)",
              "--tw-ring-color": "#00694B" 
            }}
          >
            Manage Settings
          </Link>
        </div>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* Election Settings - New Section */}
        <div className="bg-white rounded-md border border-gray-200 mb-16" style={{ overflow: 'visible' }}>
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Election Settings</h2>
          </div>
          <div className="p-6 space-y-4" style={{ overflow: 'visible' }}> 
            <div>
              <label htmlFor="election-date" className="block text-base font-semibold text-gray-700 mb-1">
                Election Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                <input
                  id="election-date"
                  type="date"
                  className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                  style={{ 
                    "--tw-ring-color": "#00694B",
                    "--tw-border-opacity": 1,
                    "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                  }}
                  value={settings.electionDate}
                  onChange={handleElectionDateChange}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">This date will be used for the election countdown on the dashboard.</p>
            </div>
            
            {/* Election Category - Custom Dropdown */}
            <div>
              <label htmlFor="election-category" className="block text-base font-semibold text-gray-700 mb-1">
                Election Category
              </label>
              <div className="relative" ref={categoryRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${categoryOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  onKeyDown={(e) => handleDropdownKeyDown(
                    e, 
                    categoryOpen, 
                    setCategoryOpen, 
                    handleCategorySelect, 
                    [
                      { id: 'presidential', label: 'presidential' },
                      { id: 'municipal', label: 'municipal' },
                      { id: 'parliamentary', label: 'parliamentary' }
                    ],
                    settings.electionCategory
                  )}
                  tabIndex={0}
                  role="combobox"
                  aria-expanded={categoryOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="election-category-label"
                >
                  <span className={settings.electionCategory ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {settings.electionCategory === 'presidential' ? 'presidential' : 
                     settings.electionCategory === 'municipal' ? 'municipal' : 
                     settings.electionCategory === 'parliamentary' ? 'parliamentary' : 
                     'Select Category'}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${categoryOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {categoryOpen && (
                  <div style={dropdownStyle} role="listbox" aria-labelledby="election-category-label">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center transition-colors duration-150"
                        onClick={() => handleCategorySelect("")}
                        role="option"
                        aria-selected={settings.electionCategory === ""}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Category
                      </div>
                      {[
                        { id: 'presidential', label: 'Presidential' },
                        { id: 'municipal', label: 'Municipal' },
                        { id: 'parliamentary', label: 'Parliamentary' }
                      ].map((category) => (
                        <div 
                          key={category.id}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-emerald-50 transition-colors duration-150 ${
                            settings.electionCategory === category.id 
                              ? "text-emerald-700 font-medium bg-emerald-50" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleCategorySelect(category.id)}
                          role="option"
                          aria-selected={settings.electionCategory === category.id}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${settings.electionCategory === category.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {settings.electionCategory === category.id ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {category.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">Select the type of election being conducted.</p>
            </div>
            
            {/* Display Year - Custom Dropdown */}
            <div className="mb-10">
              <label htmlFor="display-year" id="display-year-label" className="block text-base font-semibold text-gray-700 mb-1">
                Display Year
              </label>
              <div className="relative" ref={yearRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${yearOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setYearOpen(!yearOpen)}
                  onKeyDown={(e) => handleDropdownKeyDown(
                    e,
                    yearOpen,
                    setYearOpen,
                    handleYearSelect,
                    ["2024", "2025", "2026", "2027", "2028"].map(year => ({ id: year, label: year })),
                    settings.displayYear
                  )}
                  tabIndex={0}
                  role="combobox"
                  aria-expanded={yearOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="display-year-label"
                >
                  <span className={settings.displayYear ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {settings.displayYear || "Select Year"}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${yearOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {yearOpen && (
                  <div style={dropdownStyle} role="listbox" aria-labelledby="display-year-label">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center transition-colors duration-150"
                        onClick={() => handleYearSelect("")}
                        role="option"
                        aria-selected={settings.displayYear === ""}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Year
                      </div>
                      {["2024", "2025", "2026", "2027", "2028", "2029", "2030"].map((year) => (
                        <div 
                          key={year}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-emerald-50 transition-colors duration-150 ${
                            settings.displayYear === year 
                              ? "text-emerald-700 font-medium bg-emerald-50" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleYearSelect(year)}
                          role="option"
                          aria-selected={settings.displayYear === year}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${settings.displayYear === year ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {settings.displayYear === year ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">Select the year to display in the application.</p>
            </div>
          
          </div>
        </div>
     
       
        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addSettings}
            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300"
            style={{ 
              background: "linear-gradient(to right, #00694B, #005941)",
              "--tw-ring-color": "#00694B" 
            }}
          >
            Add Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 