import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';
import apiService from '../../../services/apiService';

const ViewSettingsModal = ({ isOpen, onClose, settingId, onSettingDeleted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setting, setSetting] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  // Function to fetch setting details
  const fetchSetting = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.settings.getSettingById(settingId);
      console.log('Setting response:', response); // Debug log
      if (response.status === 'success' && response.data) {
        console.log('Setting background picture:', response.data.background_picture); // Debug log
        setSetting(response.data);
      } else {
        throw new Error('Failed to fetch setting details');
      }
    } catch (err) {
      console.error('Error fetching setting:', err);
      setError(err.message || 'Failed to load setting details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('background_picture', file);

      const response = await apiService.settings.updateSetting(settingId, formData);
      
      if (response.status === 'success') {
        // Update the local state with the new background picture
        setSetting(prev => ({
          ...prev,
          background_picture: response.data.background_picture
        }));
      } else {
        throw new Error('Failed to update background picture');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDeleteError(null);
      // Fetch setting details when modal opens
      fetchSetting();
    } else {
      setIsVisible(false);
    }
  }, [isOpen, settingId]);

  useEffect(() => {
    if (setting?.date) {
      const calculateTimeLeft = () => {
        const electionDate = new Date(setting.date);
        const now = new Date();
        const difference = electionDate - now;
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          return { days, hours, minutes, seconds, isPast: false };
        } else {
          const days = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));
          const hours = Math.floor((Math.abs(difference) / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((Math.abs(difference) / 1000 / 60) % 60);
          const seconds = Math.floor((Math.abs(difference) / 1000) % 60);
          return { days, hours, minutes, seconds, isPast: true };
        }
      };

      setTimeLeft(calculateTimeLeft());
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [setting?.date]);

  if (!isOpen) return null;

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onSettingDeleted(settingId);
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      onClose();
    } catch (error) {
      setDeleteError(error.message || 'Failed to delete setting');
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteError(null);
  };

  return (
    <div className="relative z-[100]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-[#4F46E5]/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 100 }}
      />

      {/* Modal container */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 101 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Election Setting Details</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchSetting}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : setting ? (
            <>
              {/* Countdown Timer with Background */}
              {setting.date && (
                <div 
                  className={`relative mb-8 rounded-lg overflow-hidden ${
                    timeLeft.isPast 
                      ? 'bg-gradient-to-r from-red-50/90 to-red-100/90' 
                      : 'bg-gradient-to-r from-emerald-50/90 to-emerald-100/90'
                  }`}
                  style={{
                    backgroundImage: setting.background_picture ? `url(${setting.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay',
                    minHeight: '200px'
                  }}
                >
                
                  {/* Show image preview only, no URL field */}
                  {setting.background_picture && (
                    <img 
                      src={setting.background_picture}
                      alt="Election background"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: 0.3 // semi-transparent for debug
                      }}
                    />
                  )}
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8">
                    {timeLeft.isPast ? (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Election Closed</h3>
                        <p className="text-white/90 drop-shadow-md">
                          This election concluded on {new Date(setting.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-white mb-6 drop-shadow-lg">Time Until Election</h3>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-4xl font-bold text-white drop-shadow-lg">
                              {timeLeft.days}
                            </div>
                            <div className="text-sm text-white/90 mt-1">Days</div>
                          </div>
                          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-4xl font-bold text-white drop-shadow-lg">
                              {timeLeft.hours}
                            </div>
                            <div className="text-sm text-white/90 mt-1">Hours</div>
                          </div>
                          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-4xl font-bold text-white drop-shadow-lg">
                              {timeLeft.minutes}
                            </div>
                            <div className="text-sm text-white/90 mt-1">Minutes</div>
                          </div>
                          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-4xl font-bold text-white drop-shadow-lg">
                              {timeLeft.seconds}
                            </div>
                            <div className="text-sm text-white/90 mt-1">Seconds</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Election Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Election Details</h4>
                  
                  <div className="flex items-start space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Election Category</p>
                      <p className="text-gray-800 font-medium">{setting.election_category}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Election Date</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(setting.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Setting
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Setting</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this election setting? This action cannot be undone.
                    </p>
                    {deleteError && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-600">{deleteError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : "Delete"}
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSettingsModal; 