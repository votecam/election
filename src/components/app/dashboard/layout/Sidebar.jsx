import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    dashboard: true,
    elections: false,
    voters: false,
    reports: false,
    settings: false,
    notifications: false,
    centres: false,
    candidates: false,
    guides: false,
  });

  const toggleMenu = (menu) => {
    // Close all menus first, then toggle the selected one
    const allClosed = Object.keys(expandedMenus).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    
    // If the menu was already open, it will remain closed
    // If it was closed, it will be the only one open
    setExpandedMenus({
      ...allClosed,
      [menu]: !expandedMenus[menu]
    });
  };

  const isActive = (path) => {
    // Special case for dashboard
    if (path === '/dashboard' || path === '/app/dashboard') {
      return location.pathname === '/app' || 
             location.pathname === '/app/dashboard';
    }
    
    // Special case for analytics
    if (path === '/analytics' || path === '/app/analytics') {
      return location.pathname === '/app/analytics';
    }
    
    // Special case for feedback
    if (path === '/feedback' || path === '/app/feedback') {
      return location.pathname === '/app/feedback';
    }
    
    // Special case for administrator
    if (path === '/administrator' || path === '/app/administrator') {
      return location.pathname === '/app/administrator';
    }
    
    // Special case for settings
    if (path === '/settings' || path === '/app/settings') {
      return location.pathname === '/app/settings';
    }

    // Special case for notifications
    if (path === '/notifications' || path === '/app/notifications') {
      return location.pathname === '/app/notifications';
    }
    
    // Special case for guides upload as default
    if (path === '/app/guides/upload') {
      return location.pathname === '/app/guides/upload' || 
             location.pathname === '/app/guides';
    }
    
    // For exact path matching
    if (path.startsWith('/app/')) {
      // Exact match for all specific paths
      return location.pathname === path;
    }
    
    // Fallback - should not be reached with proper routes
    return false;
  };
  
  // Check if a parent menu should be active based on child routes
  const isMenuActive = (pathPrefix) => {
    // If we're on the exact path of a child item, don't highlight the parent
    if (isChildItemActive(pathPrefix)) {
      return false;
    }
    // Otherwise, highlight parent if we're on a path that matches the prefix
    return location.pathname.startsWith(pathPrefix);
  };
  
  // Check if any child item of a dropdown is active
  const isChildItemActive = (parentPath) => {
    if (parentPath === '/app/centres') {
      return isActive('/app/centres/register') || 
             isActive('/app/centres/upload') || 
             isActive('/app/centres/manage-polling');
    }
    if (parentPath === '/app/settings') {
      return isActive('/app/settings') || isActive('/app/settings/manage');
    }
    if (parentPath === '/app/candidates') {
      return isActive('/app/candidates/register') || 
             isActive('/app/candidates/manage');
    }
    if (parentPath === '/app/guides') {
      return isActive('/app/guides/upload') ||
             isActive('/app/guides/manage');
    }
    if (parentPath === '/app/notifications') {
      return isActive('/app/notifications/create') ||
             isActive('/app/notifications/all');
    }
    return false;
  };
  
  // Auto-expand menu when its child is active
  useEffect(() => {
    // Check if we're on a centres route
    if (location.pathname.includes('/app/centres/')) {
      setExpandedMenus(prev => ({ ...prev, centres: true }));
    }
    
    // Check if we're on a candidates route
    if (location.pathname.includes('/app/candidates/')) {
      setExpandedMenus(prev => ({ ...prev, candidates: true }));
    }
    
    // Check if we're on a guides route
    if (location.pathname.includes('/app/guides/')) {
      setExpandedMenus(prev => ({ ...prev, guides: true }));
    }

    // Check if we're on a notifications route
    if (location.pathname.includes('/app/notifications/')) {
      setExpandedMenus(prev => ({ ...prev, notifications: true }));
    }
  }, [location.pathname]);
  
  // Handle responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle menu item click - close sidebar on mobile
  const handleMenuItemClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };
  
  // Get user initials
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
    <div>
      {/* Overlay for mobile when sidebar is open - with blur effect */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-[35] bg-gray-900/30 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-0 left-0 z-40 w-80 shadow-lg ${
          // On mobile, translate based on isOpen state
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } transition-transform duration-300 ease-in-out overflow-hidden`}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Cleaner gradient background */}
        <div className="absolute inset-0" style={{ 
          background: "linear-gradient(145deg, #003528 0%, #00382a 100%)",
          opacity: 1
        }}>
          {/* Add subtle grid pattern overlay with extremely reduced visibility */}
          <div className="absolute inset-0 opacity-[0.1]">
            <div className="w-full h-full" style={{ 
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>

        {/* Sidebar content container */}
        <div className="relative h-full flex flex-col text-emerald-50">
          {/* Sidebar Header - Modernized */}
          <div className="flex items-center h-16 border-b border-white/20 w-full px-8">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/images/logo_admin2.png" 
                alt="Electoral System Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            
            {/* Mobile close button */}
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white p-1.5 ml-auto rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Close sidebar"
                aria-expanded={isOpen}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
          
          {/* Add custom styles in the component */}
          <style>{`
            /* Only show focus styles for keyboard navigation, not for mouse clicks */
            .focus-visible-only:focus:not(:focus-visible) {
              outline: none;
              box-shadow: none;
            }
            
            .focus-visible-only:focus-visible {
              outline: none;
              box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 0 4px rgba(0, 74, 54, 0.8);
            }

            /* Custom elegant scrollbar for sidebar */
            .elegant-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            
            .elegant-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .elegant-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 20px;
            }
            
            .elegant-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }

            /* For Firefox */
            .elegant-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            }
          `}</style>

          {/* Sidebar Menu - Updated with professional styling */}
          <nav className="flex-1 px-5 py-4 overflow-y-auto elegant-scrollbar pb-20" aria-label="Sidebar navigation">
            <ul className="space-y-3">
              {/* Dashboard - Updated with new home icon */}
              <li>
                <Link 
                  to="/app/dashboard"
                  onClick={handleMenuItemClick}
                  className={`flex items-center px-3 py-3 transition-all duration-200 group focus-visible-only ${
                    isActive('/dashboard') 
                      ? 'bg-white/80 text-gray-800 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  } rounded-lg focus:outline-none`}
                  aria-current={isActive('/dashboard') ? 'page' : undefined}
                >
                  <div className={`flex items-center justify-center w-9 h-9 ${isActive('/dashboard') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      className="fill-current"
                      aria-hidden="true"
                    >
                      <path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path>
                    </svg>
                  </div>
                  <span className="ml-3 font-medium text-xl whitespace-nowrap">Dashboard</span>
                </Link>
              </li>
             
              
              {/* Centre Management */}
              <li>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('centres')}
                    className={`w-full flex items-center justify-between px-3 py-3 transition-all duration-200 group focus-visible-only ${
                      isMenuActive('/app/centres') 
                        ? 'bg-white text-gray-800 font-medium shadow-sm' 
                        : 'text-white hover:bg-white/10'
                    } rounded-lg focus:outline-none`}
                    aria-expanded={expandedMenus.centres}
                    aria-controls="centres-menu"
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-9 h-9 ${isMenuActive('/app/centres') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-7 w-7" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                          />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-xl whitespace-nowrap">Centre Management</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenus.centres ? 'transform rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {expandedMenus.centres && (
                    <ul id="centres-menu" className="mt-1 pl-10 space-y-1">
                      <li>
                        <Link 
                          to="/app/centres/register"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/centres/register') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/centres/register') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                          <span className="text-lg">Register Centre</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/app/centres/upload"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/centres/upload') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/centres/upload') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          <span className="text-lg">Upload Centre</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/app/centres/manage-polling"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/centres/manage-polling') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/centres/manage-polling') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span className="text-lg">Manage Centre</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              
              {/* Candidate Management */}
              <li>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('candidates')}
                    className={`w-full flex items-center justify-between px-3 py-3 transition-all duration-200 group focus-visible-only ${
                      isMenuActive('/app/candidates') 
                        ? 'bg-white text-gray-800 font-medium shadow-sm' 
                        : 'text-white hover:bg-white/10'
                    } rounded-lg focus:outline-none`}
                    aria-expanded={expandedMenus.candidates}
                    aria-controls="candidates-menu"
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-9 h-9 ${isMenuActive('/app/candidates') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-7 w-7" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                          />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-xl whitespace-nowrap">Candidate Management</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenus.candidates ? 'transform rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {expandedMenus.candidates && (
                    <ul id="candidates-menu" className="mt-1 pl-10 space-y-1">
                      <li>
                        <Link 
                          to="/app/candidates/register"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/candidates/register') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/candidates/register') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M19 8v6" />
                            <path d="M16 11h6" />
                          </svg>
                          <span className="text-lg">Register Candidate</span>
                        </Link>
                      </li>
                  
                      <li>
                        <Link 
                          to="/app/candidates/manage"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/candidates/manage') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/candidates/manage') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span className="text-lg">Manage Candidates</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>

     
              {/* Guide Management */}
              <li>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('guides')}
                    className={`w-full flex items-center justify-between px-3 py-3 transition-all duration-200 group focus-visible-only ${
                      isMenuActive('/app/guides') 
                        ? 'bg-white text-gray-800 font-medium shadow-sm' 
                        : 'text-white hover:bg-white/10'
                    } rounded-lg focus:outline-none`}
                    aria-expanded={expandedMenus.guides}
                    aria-controls="guides-menu"
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-9 h-9 ${isMenuActive('/app/guides') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-7 w-7" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                          />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-xl whitespace-nowrap">Guide Management</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenus.guides ? 'transform rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {expandedMenus.guides && (
                    <ul id="guides-menu" className="mt-1 pl-10 space-y-1">
                      <li>
                        <Link 
                          to="/app/guides/upload"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/guides/upload') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/guides/upload') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          <span className="text-lg">Upload Guide</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/app/guides/manage"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/guides/manage') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/guides/manage') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span className="text-lg">Manage Guides</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
               
              {/* Analytics */}
              <li>
                <Link 
                  to="/app/analytics"
                  onClick={handleMenuItemClick}
                  className={`flex items-center px-3 py-3 transition-all duration-200 group focus-visible-only ${
                    isActive('/analytics') 
                      ? 'bg-white/80 text-gray-800 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  } rounded-lg focus:outline-none`}
                  aria-current={isActive('/analytics') ? 'page' : undefined}
                >
                  <div className={`flex items-center justify-center w-9 h-9 ${isActive('/analytics') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      className="w-7 h-7"
                    >
                      <path d="M9 2.4578V4.58152C6.06817 5.76829 4 8.64262 4 12C4 16.4183 7.58172 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15H21.5422C20.2679 19.0571 16.4776 22 12 22C6.47715 22 2 17.5228 2 12C2 7.52236 4.94289 3.73207 9 2.4578ZM12 2C17.5228 2 22 6.47715 22 12C22 12.3375 21.9833 12.6711 21.9506 13H11V2.04938C11.3289 2.01672 11.6625 2 12 2ZM13 4.06189V11H19.9381C19.4869 7.38128 16.6187 4.51314 13 4.06189Z"></path>
                    </svg>
                  </div>
                  <span className="ml-3 font-medium text-xl whitespace-nowrap">Analytics</span>
                </Link>
              </li>
              
              {/* Administrator */}
              <li>
                <Link 
                  to="/app/administrator"
                  onClick={handleMenuItemClick}
                  className={`flex items-center px-3 py-3 transition-all duration-200 group focus-visible-only ${
                    isActive('/administrator') 
                      ? 'bg-white/80 text-gray-800 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  } rounded-lg focus:outline-none`}
                  aria-current={isActive('/administrator') ? 'page' : undefined}
                >
                  <div className={`flex items-center justify-center w-9 h-9 ${isActive('/administrator') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-7 h-7"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <path d="M20 8v6"></path>
                      <path d="M23 11h-6"></path>
                    </svg>
                  </div>
                  <span className="ml-3 font-medium text-xl whitespace-nowrap">Administrator</span>
                </Link>
              </li>
              
              {/* Feedback */}
              <li>
                <Link 
                  to="/app/feedback"
                  onClick={handleMenuItemClick}
                  className={`flex items-center px-3 py-3 transition-all duration-200 group focus-visible-only ${
                    isActive('/feedback') 
                      ? 'bg-white/80 text-gray-800 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  } rounded-lg focus:outline-none`}
                  aria-current={isActive('/feedback') ? 'page' : undefined}
                >
                  <div className={`flex items-center justify-center w-9 h-9 ${isActive('/feedback') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      className="fill-current"
                      aria-hidden="true"
                    >
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                    </svg>
                  </div>
                  <span className="ml-3 font-medium text-xl whitespace-nowrap">Feedback</span>
                </Link>
              </li>
              
              {/* Notifications - New Item */}
              <li>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('notifications')}
                    className={`w-full flex items-center justify-between px-3 py-3 transition-all duration-200 group focus-visible-only ${
                      isMenuActive('/app/notifications') 
                        ? 'bg-white text-gray-800 font-medium shadow-sm' 
                        : 'text-white hover:bg-white/10'
                    } rounded-lg focus:outline-none`}
                    aria-expanded={expandedMenus.notifications}
                    aria-controls="notifications-menu"
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-9 h-9 ${isMenuActive('/app/notifications') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-7 h-7"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-xl whitespace-nowrap">Notifications</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenus.notifications ? 'transform rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {expandedMenus.notifications && (
                    <ul id="notifications-menu" className="mt-1 pl-10 space-y-1">
                      <li>
                        <Link 
                          to="/app/notifications/create"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/notifications/create') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/notifications/create') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                          <span className="text-lg">Create Notification</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/app/notifications/all"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/notifications/all') 
                              ? 'bg-white/80 text-gray-800 font-medium' 
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/notifications/all') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span className="text-lg">All Notifications</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              
              {/* Settings */}
              <li>
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('settings')}
                    className={`w-full flex items-center justify-between px-3 py-3 transition-all duration-200 group focus-visible-only text-white hover:bg-white/10 rounded-lg focus:outline-none`}
                    aria-expanded={expandedMenus.settings}
                    aria-controls="settings-menu"
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-9 h-9 ${isMenuActive('/app/settings') ? 'text-gray-800' : 'text-white group-hover:text-white'}`}>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-7 h-7"
                        >
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-xl whitespace-nowrap">Settings</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenus.settings ? 'transform rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {expandedMenus.settings && (
                    <ul id="settings-menu" className="mt-1 pl-10 space-y-1">
                      <li>
                        <Link 
                          to="/app/settings"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/settings') && location.pathname === '/app/settings'
                              ? 'bg-white/80 text-gray-800 font-medium'
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/settings') && location.pathname === '/app/settings' ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                          <span className="text-lg">Add Settings</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/app/settings/manage"
                          onClick={handleMenuItemClick}
                          className={`flex items-center px-3 py-2.5 focus-visible-only ${
                            isActive('/app/settings/manage')
                              ? 'bg-white/80 text-gray-800 font-medium'
                              : 'text-white hover:bg-white/10'
                          } transition-colors duration-200 rounded-lg focus:outline-none`}
                          aria-current={isActive('/app/settings/manage') ? 'page' : undefined}
                        >
                          <svg 
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span className="text-lg">Manage Settings</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
         
            </ul>
          </nav>
          
          {/* Footer area with user info */}
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
          
          