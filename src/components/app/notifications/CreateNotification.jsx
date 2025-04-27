import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../../services/apiService';

const CreateNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field immediately to provide instant feedback
    validateField(name, value);
  };
  
  // Add a validateField function to check individual fields
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'title':
        errorMessage = !value.trim() ? 'Title is required' : '';
        break;
      case 'message':
        if (!value.trim()) {
          errorMessage = 'Message is required';
        } else if (value.trim().length < 10) {
          errorMessage = 'Message must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return !errorMessage;
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    const fields = ['title', 'message'];
    
    fields.forEach(field => {
      const fieldValue = formData[field] || '';
      const fieldIsValid = validateField(field, fieldValue);
      if (!fieldIsValid) {
        isValid = false;
      }
    });
    
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    const isFormValid = validateForm();
    if (!isFormValid) {
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
    
    setIsSubmitting(true);
    
    try {
      // Call the API to create the notification
      const response = await apiService.notifications.create(formData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        message: ''
      });
      
      // Reset errors
      setErrors({});
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      // Handle errors
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to create notification. Please try again.'
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
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create Notification</h1>
            <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
            <p className="text-gray-600 text-lg mt-2">Send important notifications to users and staff</p>
          </div>
          
          <Link
            to="/app/notifications/all"
            className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium text-emerald-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors rounded-none"
          >
            View All Notifications
          </Link>
        </div>
      </header>
      
      {submitSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-emerald-800">
                Notification was successfully created and sent!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {alert.show && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-red-800">
                {alert.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-100 w-full overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-1">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M13.26 3.2L13 3h-2c-.55 0-1 .45-1 1v.25C9.58 4.82 9.22 5.5 8.71 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.77c-.51-.5-.87-1.18-1.23-1.8L13.26 3.2zM15 9c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z" />
                </svg>
              </div>
              
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                className={`pl-16 w-full px-4 py-3 border ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 transition-all duration-200 ease-in-out`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>
          
          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-1">
              Notification Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Enter the notification message..."
              className={`block w-full px-4 py-3 border ${errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-emerald-600'} rounded-none focus:outline-none focus:ring-1 transition-shadow duration-300 text-base font-medium bg-white`}
              style={{ 
                "--tw-ring-color": "#00694B",
                "--tw-border-opacity": 1,
                "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
              }}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.message}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-base"
              style={{ 
                background: "linear-gradient(to right, #00694B, #005941)", 
                "--tw-ring-color": "#00694B" 
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Notification
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotification; 