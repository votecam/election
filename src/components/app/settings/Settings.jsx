import React, { useState } from 'react';

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
    countdownEnabled: true
  });
  
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
  
  const handleDisplayYearChange = (e) => {
    setElectionSettings(prev => ({
      ...prev,
      displayYear: e.target.value
    }));
  };
  
  const toggleCountdown = () => {
    setElectionSettings(prev => ({
      ...prev,
      countdownEnabled: !prev.countdownEnabled
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
  
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-1">Manage application preferences and configurations</p>
      </header>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Election Settings - New Section */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Election Settings</h2>
          </div>
          <div className="p-6 space-y-4">
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
            
            <div>
              <label htmlFor="display-year" className="block text-base font-semibold text-gray-700 mb-1">
                Display Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                <select
                  id="display-year"
                  className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                  style={{ 
                    "--tw-ring-color": "#00694B",
                    "--tw-border-opacity": 1,
                    "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                  }}
                  value={electionSettings.displayYear}
                  onChange={handleDisplayYearChange}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">Select the year to display in the application.</p>
            </div>
            
            <ToggleSwitch
              enabled={electionSettings.countdownEnabled}
              onChange={toggleCountdown}
              label="Show Countdown on Dashboard"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500">
              Display a countdown timer to the election date on the main dashboard.
            </div>
          </div>
        </div>
        
        {/* Notifications Settings */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSwitch
              enabled={notifications.email}
              onChange={() => toggleNotification('email')}
              label="Email Notifications"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500 mb-4">
              Receive email notifications about candidate registrations, election updates, and system alerts.
            </div>
            
            <ToggleSwitch
              enabled={notifications.browser}
              onChange={() => toggleNotification('browser')}
              label="Browser Notifications"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500 mb-4">
              Receive in-app notifications while using the system.
            </div>
            
            <ToggleSwitch
              enabled={notifications.reports}
              onChange={() => toggleNotification('reports')}
              label="Weekly Reports"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500">
              Receive weekly summary reports of system activity and election status.
            </div>
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Display & Appearance</h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSwitch
              enabled={appearance.sidebarCollapsed}
              onChange={() => toggleAppearance('sidebarCollapsed')}
              label="Collapsed Sidebar by Default"
            />
            
            <ToggleSwitch
              enabled={appearance.highContrast}
              onChange={() => toggleAppearance('highContrast')}
              label="High Contrast Mode"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500">
              Enables high contrast colors for better readability.
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Privacy & Data</h2>
          </div>
          <div className="p-6 space-y-4">
            <ToggleSwitch
              enabled={privacy.shareData}
              onChange={() => togglePrivacy('shareData')}
              label="Share Anonymous Usage Data"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500 mb-4">
              Help improve the system by sharing anonymous usage statistics.
            </div>
            
            <ToggleSwitch
              enabled={privacy.activityLog}
              onChange={() => togglePrivacy('activityLog')}
              label="Activity Logging"
            />
            <div className="ml-6 pl-2 border-l-2 border-gray-100 text-sm text-gray-500">
              Track your activity within the system for audit and security purposes.
            </div>
          </div>
        </div>
        
        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="button"
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