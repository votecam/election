import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';
import apiService from '../../../services/apiService';

const EditSettingsModal = ({ isOpen, onClose, settingId, onSave }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [setting, setSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    election_category: '',
    date: '',
    year: new Date().getFullYear(),
    background_picture: ''
  });

  const electionCategories = [
    'presidential',
    'municipal',
    'parliamentary'
  ];

  useEffect(() => {
    if (isOpen && settingId) {
      setIsVisible(true);
      setError(null);
      fetchSetting();
    } else {
      setIsVisible(false);
      setSetting(null);
      setFormData({
        election_category: '',
        date: '',
        year: new Date().getFullYear(),
        background_picture: ''
      });
    }
  }, [isOpen, settingId]);

  const fetchSetting = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.settings.getSettingById(settingId);
      setSetting(response.data);
      setFormData({
        election_category: response.data.election_category,
        date: response.data.date.split('T')[0],
        year: response.data.year,
        background_picture: response.data.background_picture
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch setting details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const updatedData = {
        ...formData,
        election_category: formData.election_category.charAt(0).toUpperCase() + formData.election_category.slice(1)
      };
      await onSave(settingId, updatedData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update setting');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold text-gray-800">Edit Election Setting</h2>
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
          {isLoading && !setting ? (
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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Election Category */}
              <div className="space-y-2">
                <label htmlFor="election_category" className="block text-sm font-medium text-gray-700">
                  Election Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="election_category"
                    name="election_category"
                    value={formData.election_category}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {electionCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Election Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Election Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Election Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Background Image preview and upload */}
              {setting && (
                <div className="space-y-2">
                  {/* Only show preview, no URL field */}
                  {setting.background_picture && (
                    <div className="mt-2">
                      <img
                        src={setting.background_picture}
                        alt="Background preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="background-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit mt-2"
                    >
                      <PhotoIcon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Change Background
                      </span>
                    </label>
                    <input
                      id="background-upload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          alert('Please upload an image file');
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size should be less than 5MB');
                          return;
                        }
                        const formData = new FormData();
                        formData.append('background_picture', file);
                        try {
                          const response = await apiService.settings.updateSetting(settingId, formData);
                          if (response.status === 'success') {
                            setSetting(prev => ({ ...prev, background_picture: response.data.background_picture }));
                          } else {
                            alert('Failed to update background picture');
                          }
                        } catch (err) {
                          alert(err.message || 'Failed to upload image');
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSettingsModal; 