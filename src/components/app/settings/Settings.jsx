import React, { useState, useRef, useEffect } from 'react';

const Settings = () => {
  // State for different settings
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    reports: false
  });
  
  const [appearance, setAppearance] = useState({
    sidebarCollapsed: false,
    highContrast: false
  });
  
  const [privacy, setPrivacy] = useState({
    shareData: false,
    activityLog: true
  });
  
  // New state for election settings
  const [electionSettings, setElectionSettings] = useState({
    electionDate: '2024-11-05',
    displayYear: '2024',
    countdownEnabled: true,
    electionCategory: 'presidential'
  });
  
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

  // Handlers for toggling settings
  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const toggleAppearance = (type) => {
    setAppearance(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const togglePrivacy = (type) => {
    setPrivacy(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // New handlers for election settings
  const handleElectionDateChange = (e) => {
    setElectionSettings(prev => ({
      ...prev,
      electionDate: e.target.value
    }));
  };
  
  const handleCategorySelect = (value) => {
    setElectionSettings(prev => ({
      ...prev,
      electionCategory: value
    }));
    setCategoryOpen(false);
  };
  
  const handleYearSelect = (value) => {
    setElectionSettings(prev => ({
      ...prev,
      displayYear: value
    }));
    setYearOpen(false);
  };
  
  const toggleCountdown = () => {
    setElectionSettings({
      ...electionSettings,
      countdownEnabled: !electionSettings.countdownEnabled
    });
  };
  
  // Save settings function
  const saveSettings = () => {
    // Here you would typically make an API call to save the settings
    // For example:
    // apiService.settings.saveSettings(electionSettings);
    
    // Show success message
    alert('Settings saved successfully!');
    
    // In a real application, you might use a toast notification instead:
    // toast.success('Settings saved successfully!');
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

  return (
    <div className="w-full">
      {/* Include the animation keyframes */}
      <style>{dropdownAnimationStyle}</style>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-1">Manage application preferences and configurations</p>
      </header>
      
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
                  value={electionSettings.electionDate}
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
                      { id: 'presidential', label: 'Presidential' },
                      { id: 'municipal', label: 'Municipal' },
                      { id: 'parliamentary', label: 'Parliamentary' }
                    ],
                    electionSettings.electionCategory
                  )}
                  tabIndex={0}
                  role="combobox"
                  aria-expanded={categoryOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="election-category-label"
                >
                  <span className={electionSettings.electionCategory ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {electionSettings.electionCategory === 'presidential' ? 'Presidential' : 
                     electionSettings.electionCategory === 'municipal' ? 'Municipal' : 
                     electionSettings.electionCategory === 'parliamentary' ? 'Parliamentary' : 
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
                        aria-selected={electionSettings.electionCategory === ""}
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
                            electionSettings.electionCategory === category.id 
                              ? "text-emerald-700 font-medium bg-emerald-50" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleCategorySelect(category.id)}
                          role="option"
                          aria-selected={electionSettings.electionCategory === category.id}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${electionSettings.electionCategory === category.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {electionSettings.electionCategory === category.id ? (
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
                    electionSettings.displayYear
                  )}
                  tabIndex={0}
                  role="combobox"
                  aria-expanded={yearOpen}
                  aria-haspopup="listbox"
                  aria-labelledby="display-year-label"
                >
                  <span className={electionSettings.displayYear ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {electionSettings.displayYear || "Select Year"}
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
                        aria-selected={electionSettings.displayYear === ""}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Year
                      </div>
                      {["2024", "2025", "2026", "2027", "2028"].map((year) => (
                        <div 
                          key={year}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-emerald-50 transition-colors duration-150 ${
                            electionSettings.displayYear === year 
                              ? "text-emerald-700 font-medium bg-emerald-50" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleYearSelect(year)}
                          role="option"
                          aria-selected={electionSettings.displayYear === year}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${electionSettings.displayYear === year ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {electionSettings.displayYear === year ? (
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
            
            <ToggleSwitch
              enabled={electionSettings.countdownEnabled}
              onChange={toggleCountdown}
              label="Show Countdown on Dashboard"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500 mb-6">
              Display a countdown timer to the election date on the main dashboard.
            </div>
          </div>
        </div>
     
       
        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            className="px-6 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300"
            style={{ 
              background: "linear-gradient(to right, #00694B, #005941)",
              "--tw-ring-color": "#00694B" 
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 