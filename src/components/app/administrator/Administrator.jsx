import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/apiService';

const Administrator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0-4 where 0 is no password, 1 is weak, 2 is fair, 3 is good, 4 is strong
    label: '',
    color: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        label: '',
        color: ''
      });
      return;
    }
    
    // Calculate password strength
    let score = 0;
    let label = '';
    let color = '';
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Adjust final score (max 4)
    score = Math.min(4, Math.floor(score * 0.8));
    
    // Set label and color based on score
    switch (score) {
      case 1:
        label = 'Weak';
        color = 'bg-red-500';
        break;
      case 2:
        label = 'Fair';
        color = 'bg-yellow-500';
        break;
      case 3:
        label = 'Good';
        color = 'bg-blue-500';
        break;
      case 4:
        label = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        label = 'Too weak';
        color = 'bg-gray-300';
    }
    
    setPasswordStrength({
      score,
      label,
      color
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must include a number and special character';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setAlert({
        show: true,
        type: 'error',
        message: 'Please fill all required fields correctly.'
      });
      
      // Auto-hide error alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'error',
          message: ''
        });
      }, 5000);
      return;
    }

    try {
      setLoading(true);
      // Call the API to create a new administrator
      const result = await apiService.users.createAdministrator(formData);
      
      setAlert({
        show: true,
        type: 'success',
        message: `Administrator ${result.name} created successfully with ID: ${result.id}`
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Clear errors
      setErrors({});
      
      // Reset password strength
      setPasswordStrength({
        score: 0,
        label: '',
        color: ''
      });
      
      // Auto-hide success alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'success',
          message: ''
        });
      }, 5000);
      
      // Navigate after a brief delay
      setTimeout(() => {
        navigate('/app/administrator');
      }, 2000);

    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to create administrator'
      });
      
      // Auto-hide error alert after 5 seconds
      setTimeout(() => {
        setAlert({
          show: false,
          type: 'error',
          message: ''
        });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administrator Management</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-2">Create and manage administrator accounts</p>
      </header>

      {/* Alert Message */}
      {alert.show && (
        <div className={`mb-6 p-4 ${
          alert.type === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-500' : 
          'bg-red-50 border-l-4 border-red-500'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {alert.type === 'success' ? (
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-800">
                {alert.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Administrator</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Two columns per row layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                      <path d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                  </div>
                  {/* Vertical separator line */}
                  <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      "--tw-border-opacity": 1,
                      "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                <p className="mt-1 text-xs text-gray-500">Enter the administrator's full name</p>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  {/* Vertical separator line */}
                  <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      "--tw-border-opacity": 1,
                      "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                    }}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                <p className="mt-1 text-xs text-gray-500">Enter a valid email address for the administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                      <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z" />
                    </svg>
                  </div>
                  {/* Vertical separator line */}
                  <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      "--tw-border-opacity": 1,
                      "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                    }}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                        <path d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                
                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color}`} 
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        passwordStrength.score === 0 ? 'text-gray-500' :
                        passwordStrength.score === 1 ? 'text-red-500' :
                        passwordStrength.score === 2 ? 'text-yellow-500' :
                        passwordStrength.score === 3 ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <ul className="mt-1 text-xs text-gray-500 space-y-1">
                      <li className={`${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                        • At least 8 characters
                      </li>
                      <li className={`${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        • At least one uppercase letter
                      </li>
                      <li className={`${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        • At least one number
                      </li>
                      <li className={`${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        • At least one special character
                      </li>
                    </ul>
                  </div>
                )}
                
                {!formData.password && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters and include a number and special character
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-base font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                      <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z" />
                    </svg>
                  </div>
                  {/* Vertical separator line */}
                  <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      "--tw-border-opacity": 1,
                      "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                    }}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                        <path d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                <p className="mt-1 text-xs text-gray-500">Re-enter your password to confirm</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                }`}
              >
                {loading ? 'Creating...' : 'Create Administrator'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Administrator; 