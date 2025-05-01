import React, { useState } from 'react';
import apiService from '../../../services/apiService';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = () => {
    const newErrors = {};
    
    // Check if current password is empty
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Check if new password is empty
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } 
    // Check new password length
    else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    // Check for password complexity
    else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter';
    }
    else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    }
    else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }
    else if (!/(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character (!@#$%^&*)';
    }
    
    // Check if confirm password is empty
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    }
    // Check if passwords match
    else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setError(Object.values(newErrors)[0] || '');
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords
      if (!validatePassword()) {
        setLoading(false);
      return;
    }
    
      // Get user email from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = userData.email;

      if (!userEmail) {
        throw new Error('User email not found. Please log in again.');
      }

      console.log('Attempting to update password for email:', userEmail);

      // Call the update password endpoint
      const response = await apiService.auth.updatePassword(
        userEmail,
        formData.currentPassword,
        formData.newPassword
      );

      console.log('Password update response:', response);

      if (response && response.status === 'success') {
        // Show success message
        const successMessage = response.data.message || 'Password updated successfully';
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Show success message in the modal
        setError({
          type: 'success',
          message: successMessage
        });
        
        // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
      } else {
        throw new Error(response?.data?.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password update error:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with an error
        const errorMessage = err.response.data?.data?.message || err.response.data?.message || 'Server error occurred';
        setError(errorMessage);
      } else if (err.request) {
        // No response received
        setError('No response from server. Please check your connection.');
      } else {
        // Other errors
        setError(err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-[3px]">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="relative bg-white w-full max-w-md rounded-none shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {error && (
              <div className={`mb-6 p-4 ${
                error.type === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-500' : 
                'bg-red-50 border-l-4 border-red-500'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {error.type === 'success' ? (
                      <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-base font-medium ${error.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
                      {error.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-base font-semibold text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      <input
                        id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                        style={{ 
                          "--tw-ring-color": "#00694B",
                          "--tw-border-opacity": 1,
                          "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                        }}
                        required
                      />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-base font-semibold text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      <input
                        id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                        style={{ 
                          "--tw-ring-color": "#00694B",
                          "--tw-border-opacity": 1,
                          "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                        }}
                        minLength={8}
                        required
                      />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-base font-semibold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      <input
                        id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                        style={{ 
                          "--tw-ring-color": "#00694B",
                          "--tw-border-opacity": 1,
                          "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                        }}
                        required
                      />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  </div>
                </div>
              
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-500 transition-all duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300 disabled:opacity-50"
                    style={{ 
                      background: "linear-gradient(to right, #00694B, #005941)",
                      "--tw-ring-color": "#00694B" 
                    }}
                  disabled={loading}
                  >
                  {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal; 