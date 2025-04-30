import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { initTranslator, translatePage, showTranslationLoading, hideTranslationLoading } from '../../translator';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Initialize translator on component mount
  useEffect(() => {
    initTranslator();
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
      }
    }
  }, []);

  // Check if screen is mobile on resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen || notificationsOpen || languageOpen) {
        // Check if the click is outside any dropdown content
        if (!event.target.closest('.dropdown-content') && !event.target.closest('.dropdown-trigger')) {
          closeAllDropdowns();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, notificationsOpen, languageOpen]);

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const path = currentPath;
    const parts = path.split('/').filter(part => part);
    
    // Default breadcrumbs setup
    const breadcrumbs = [{ name: 'Dashboard', path: '/app/dashboard', current: parts.length === 2 && parts[1] === 'dashboard' }];
    
    if (parts.length > 1) {
      // Skip 'app' in the path
      const relevantParts = parts.slice(1);
      
      // Special cases for better naming and hierarchical structure
      if (relevantParts[0] === 'candidates') {
        breadcrumbs.push({ name: 'Candidate Management', path: '/app/candidates', current: relevantParts.length === 1 });
        
        if (relevantParts.length > 1) {
          const action = relevantParts[1];
          if (action === 'register') {
            breadcrumbs.push({ name: 'Register Candidate', path: '/app/candidates/register', current: true });
          } else if (action === 'manage') {
            breadcrumbs.push({ name: 'Manage Candidates', path: '/app/candidates/manage', current: true });
          } else {
            // Format other actions
            const formattedAction = action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, ' ');
            breadcrumbs.push({ 
              name: `${formattedAction} Candidate`, 
              path: `/app/candidates/${action}`, 
              current: true 
            });
          }
        }
      } 
      else if (relevantParts[0] === 'centres' || relevantParts[0] === 'centers') {
        breadcrumbs.push({ name: 'Centre Management', path: '/app/centres', current: relevantParts.length === 1 });
        
        if (relevantParts.length > 1) {
          const action = relevantParts[1];
          if (action === 'register') {
            breadcrumbs.push({ name: 'Register Centre', path: '/app/centres/register', current: true });
          } else if (action === 'manage') {
            breadcrumbs.push({ name: 'Manage Centres', path: '/app/centres/manage', current: true });
          } else if (action === 'upload') {
            breadcrumbs.push({ name: 'Upload Centre', path: '/app/centres/upload', current: true });
          } else {
            // Format other actions
            const formattedAction = action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, ' ');
            breadcrumbs.push({ 
              name: `${formattedAction} Centre`, 
              path: `/app/centres/${action}`, 
              current: true 
            });
          }
        }
      }
      else if (relevantParts[0] === 'analytics') {
        breadcrumbs.push({ name: 'Analytics', path: '/app/analytics', current: true });
      }
      else if (relevantParts[0] === 'settings') {
        breadcrumbs.push({ name: 'Settings', path: '/app/settings', current: true });
      }
      else if (relevantParts[0] === 'notifications') {
        breadcrumbs.push({ name: 'Notifications', path: '/app/notifications', current: relevantParts.length === 1 });
        
        if (relevantParts.length > 1) {
          const action = relevantParts[1];
          if (action === 'create') {
            breadcrumbs.push({ name: 'Create Notification', path: '/app/notifications/create', current: true });
          } else if (action === 'all') {
            breadcrumbs.push({ name: 'All Notifications', path: '/app/notifications/all', current: true });
          } else {
            // Format other actions
            const formattedAction = action.charAt(0).toUpperCase() + action.slice(1).replace(/-/g, ' ');
            breadcrumbs.push({ 
              name: `${formattedAction} Notification`, 
              path: `/app/notifications/${action}`, 
              current: true 
            });
          }
        }
      }
      else if (relevantParts[0] !== 'dashboard') {
        // For any other routes not specifically handled
        relevantParts.forEach((part, index) => {
          // Format the part to be title case
          const formattedName = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
          
          // Build the path progressively
          const currentPath = '/app/' + relevantParts.slice(0, index + 1).join('/');
          
          // Add to breadcrumbs
          breadcrumbs.push({
            name: formattedName,
            path: currentPath,
            current: index === relevantParts.length - 1
          });
        });
      }
    }
    
    return breadcrumbs;
  };
  
  // Update breadcrumbs when path changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const languages = [
    { code: 'en', name: 'English', flag: '/images/usflag.png' },
    { code: 'fr', name: 'Français', flag: '/images/france.png' },
  ];

  // Find current language
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const closeAllDropdowns = () => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
  };

  const toggleDropdown = () => {
    if (dropdownOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setDropdownOpen(true);
    }
  };

  const toggleNotifications = () => {
    if (notificationsOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setNotificationsOpen(true);
    }
  };

  const toggleLanguage = () => {
    if (languageOpen) {
      closeAllDropdowns();
    } else {
      closeAllDropdowns();
      setLanguageOpen(true);
    }
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language.code);
    
    // If English is selected, just reload the page to show original content
    if (language.code === 'en') {
      window.location.reload();
      return;
    }

    // Show loading indicator
    showTranslationLoading();

    // Use the existing translator
    translatePage(language.code)
      .then(() => {
        // Hide loading indicator when translation is complete
        hideTranslationLoading();
      })
      .catch(err => {
        console.error("Translation error:", err);
        hideTranslationLoading();
      });

    closeAllDropdowns();
  };

  const handleLogout = async () => {
    try {
      // Use the logout function from AuthContext (now async)
      await logout();
      // No need to manually navigate, logout function already does that
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "New voter registered",
      description: "District 7, Ward 3", 
      time: "10 minutes ago",
      color: "emerald",
      isNew: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Election results updated",
      description: "Presidential Election", 
      time: "1 hour ago",
      color: "blue",
      isNew: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 3,
      title: "System maintenance",
      description: "Scheduled for 10:00 PM", 
      time: "2 hours ago",
      color: "amber",
      isNew: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Helper function for color classes
  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        icon: 'text-emerald-500',
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-500',
      },
      amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        icon: 'text-amber-500',
      },
    };
    return colorMap[color] || colorMap.emerald;
  };

  // Count new notifications
  const newNotificationsCount = notifications.filter(n => n.isNew).length;
  
  // Helper function to get user initials
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Get display role
  const getDisplayRole = () => {
    if (!user?.role) return 'User';
    
    const role = user.role;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Mobile Hamburger and Logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-500 hover:text-emerald-600 focus:outline-none transition-colors lg:hidden"
              aria-expanded={sidebarOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Toggle menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} 
                />
              </svg>
            </button>
          </div>
          
          {/* Center - Breadcrumbs - Hidden on mobile */}
          <div className="hidden md:block flex-1 mx-4">
            <nav className="text-base" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {getBreadcrumbs().map((breadcrumb, index) => (
                  <li key={breadcrumb.path} className={index > 0 ? "flex items-center" : ""}>
                    {index > 0 && (
                      <svg className="h-5 w-5 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {breadcrumb.current ? (
                      <span className="text-emerald-600 font-medium">{breadcrumb.name}</span>
                    ) : (
                      <Link to={breadcrumb.path} className="text-gray-500 hover:text-gray-700">{breadcrumb.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 z-10">
            {/* Language Selector - Visible on all screen sizes */}
            <div className="relative">
              <button
                onClick={toggleLanguage}
                className="dropdown-trigger flex items-center justify-center text-gray-600 hover:text-emerald-600 p-2 rounded-md hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out border border-transparent hover:border-gray-200"
                aria-expanded={languageOpen ? 'true' : 'false'}
                aria-haspopup="true"
              >
                <span className="sr-only">Change language</span>
                <div className="flex items-center">
                  <div className="h-6 w-6 flex items-center justify-center rounded overflow-hidden">
                    <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-full h-full object-cover" />
                  </div>
                  <svg className="ml-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Language Dropdown - Simple & Professional */}
              {languageOpen && (
                <div 
                  className="dropdown-content absolute right-0 mt-1 w-40 rounded-md shadow-md bg-white ring-1 ring-gray-200 z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language)}
                        className={`w-full text-left flex items-center px-3 py-2 text-sm ${
                          currentLanguage.code === language.code
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        role="menuitem"
                      >
                        <div className="h-5 w-5 rounded overflow-hidden mr-2">
                          <img src={language.flag} alt={language.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="flex-1">{language.name}</span>
                        {currentLanguage.code === language.code && (
                          <svg className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="dropdown-trigger p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none relative border border-transparent hover:border-gray-200"
                aria-expanded={notificationsOpen ? 'true' : 'false'}
                aria-haspopup="true"
              >
                <span className="sr-only">View notifications</span>
                {/* Feedback icon instead of bell icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {newNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/4 translate-x-1/4 mb-6 mt-2">
                    {newNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown - Simplified */}
              {notificationsOpen && (
                <div 
                  className="dropdown-content absolute right-0 mt-1 w-72 rounded-md shadow-md bg-white z-50 border border-gray-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="bg-white">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Feedback & Notifications</h3>
                      {newNotificationsCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {newNotificationsCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-6 px-3 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">No notifications yet</p>
                        </div>
                      ) : (
                        <ul role="list" className="divide-y divide-gray-100">
                          {notifications.map((notification) => {
                            const colorClasses = getColorClasses(notification.color);
                            return (
                              <li key={notification.id} className="relative">
                                {notification.isNew && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" aria-hidden="true"></div>
                                )}
                                <a 
                                  href="#" 
                                  className={`block px-3 py-2 hover:bg-gray-50 ${notification.isNew ? 'pl-4' : ''}`}
                                >
                                  <div className="flex items-start">
                                    <div className={`${colorClasses.bg} p-1.5 rounded-full ${colorClasses.icon}`}>
                                      {notification.icon}
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                        <p className="text-xs text-gray-500">{notification.time}</p>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                                    </div>
                                  </div>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 px-3 py-2 text-center">
                      <a href="#" className="inline-flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-800">
                        View all
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="dropdown-trigger flex items-center p-2 rounded-md hover:bg-gray-50 focus:outline-none border border-transparent hover:border-gray-200"
                aria-expanded={dropdownOpen ? 'true' : 'false'}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="hidden sm:flex sm:flex-col sm:items-end sm:mr-3">
                  <span className="text-base font-medium text-gray-900">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getDisplayRole()}
                  </span>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-emerald-50 flex items-center justify-center ring-2 ring-emerald-500 text-gray-700 font-semibold">
                  {getUserInitials()}
                </div>
              </button>
             
              {/* Profile Dropdown Menu - Simple and clean */}
              {dropdownOpen && (
                <div 
                  className="dropdown-content absolute right-0 mt-1 w-48 rounded-md shadow-md bg-white z-50 border border-gray-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="px-3 py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center ring-2 ring-emerald-500 text-gray-700 font-semibold">
                          {getUserInitials()}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/app/profile"
                      className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                    <Link
                      to="/app/settings"
                      className="group flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 