import React, { useState, useEffect } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import apiService from '../../../services/apiService';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the logged in user's email from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userEmail = userData.email;
        
        if (!userEmail) {
          throw new Error('No user email found. Please log in again.');
        }
        
        const response = await apiService.users.getUserByEmail(userEmail);
        
        if (response) {
          setUser(response);
        } else {
          throw new Error('Failed to load user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user.name) return '';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full">
        <header className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse mb-4"></div>
                
                <div className="mt-4 w-full">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden animate-pulse">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden mt-6 animate-pulse">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="p-6">
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="w-full">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
          <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
          <p className="text-gray-600 text-lg mt-1">Manage your account information</p>
        </header>
        
        <div className="bg-white p-8 rounded-md border border-gray-200">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Error loading profile</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-1">Manage your account information</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Account Summary</h2>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center ring-2 ring-emerald-500 text-gray-700 text-2xl font-semibold mb-4">
                {getUserInitials()}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-sm font-medium bg-emerald-100 text-emerald-800 my-2">
                Active
              </span>
              
              <div className="mt-4 w-full">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="font-medium text-gray-900">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                    <input
                      id="name"
                      type="text"
                      className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white bg-gray-50"
                      style={{ 
                        "--tw-ring-color": "#00694B",
                        "--tw-border-opacity": 1,
                        "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                      }}
                      value={user.name}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                    <input
                      id="email"
                      type="email"
                      className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white bg-gray-50"
                      style={{ 
                        "--tw-ring-color": "#00694B",
                        "--tw-border-opacity": 1,
                        "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                      }}
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-base font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                  <input
                    id="role"
                    type="text"
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white bg-gray-50"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      "--tw-border-opacity": 1,
                      "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                    }}
                    value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden mt-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <div className="p-6">
              <button
                type="button"
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)",
                  "--tw-ring-color": "#00694B" 
                }}
                onClick={openModal}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      <ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Profile; 