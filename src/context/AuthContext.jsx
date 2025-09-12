import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const isAuthenticated = !!token;
        const storedUser = localStorage.getItem('user');
        
        if (isAuthenticated && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Optional: Verify token with backend
          // const profile = await apiService.users.getProfile();
          // setUser(profile);
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        setError('Failed to verify authentication status');
        // Clear potentially invalid credentials
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use real API service for authentication
      const response = await apiService.auth.login(email, password);
      
      // Store auth data in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        
        // All users are redirected to main /app route, which will redirect based on role
        navigate('/app', { replace: true });
      }
      
      return response.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Don't set loading state to avoid showing the loading screen
      // setLoading(true);
      
      // Get token before removing it from storage
      const token = localStorage.getItem('token');
      
      // Only call the API if we have a token
      if (token) {
        try {
          // Call the logout API endpoint
          await apiService.auth.logout();
          console.log('Logout API call successful');
        } catch (error) {
          console.error('Error calling logout API:', error);
          // Continue with local logout even if API call fails
        }
      }
      
    // Clear localStorage
      localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    
    // Redirect to login page
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error during logout process:', err);
    } 
    // Don't set loading state back to false
    // finally {
    //   setLoading(false);
    // }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Use real API service to update user
      const updatedUser = await apiService.users.updateProfile(userData);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if user has permission for a specific feature
  const hasPermission = (feature) => {
    if (!user || !user.role) return false;
    
    // Super admin has access to everything
    if (user.role === 'super_admin') return true;
    
    // Admin role permissions
    if (user.role === 'admin') {
      // Admin can only access Incident Reports
      return feature === 'incident_reports';
    }
    
    // Default: no access
    return false;
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'Admin');
  };

  // Helper function to check if user is super admin
  const isSuperAdmin = () => {
    return user && (user.role === 'super_admin' || user.role === 'Super Admin' || user.role === 'superadmin');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    hasPermission,
    isAdmin,
    isSuperAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 