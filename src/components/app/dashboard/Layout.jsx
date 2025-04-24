import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import { useAuth } from '../../../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed for all devices
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Check authentication on component mount
  useEffect(() => {
    // If not in loading state and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated, loading]);

  // Check if screen is mobile on resize
  const [isMobile, setIsMobile] = useState(false);
  
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while checking authentication but only if not during logout
  if (loading && localStorage.getItem('token')) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 w-full transition-all duration-300 ${
        // For desktop always push content by the full width
        !isMobile ? 'lg:ml-80' : ''
      }`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 