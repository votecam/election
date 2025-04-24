import React, { useEffect, useState } from 'react';
import { XMarkIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon, ClockIcon, BuildingLibraryIcon, HomeModernIcon } from '@heroicons/react/24/outline';

const ViewCentreModal = ({ isOpen, onClose, centre }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Format the centre data to match the expected structure
  const centreData = {
    id: centre?.id || 'N/A',
    name: centre?.name || 'N/A',
    address: centre?.description || 'N/A',
    region: centre?.region || 'N/A',
    municipalities: centre?.municipalities || 'N/A',
    subdivision: centre?.subdivision || 'N/A',
    department: centre?.department || 'N/A',
    stations: centre?.stations || 0,
    status: centre?.status || 'inactive',
    phone: centre?.contact_number || 'N/A',
    wait_time: centre?.wait_time || 'N/A',
    accessibility: Array.isArray(centre?.accessibility) 
      ? centre.accessibility 
      : ['None specified'],
    location: centre?.location || 'N/A',
    openingTime: centre?.opening_time?.from || '08:00',
    closingTime: centre?.opening_time?.to || '17:00',
    createdAt: centre?.createdAt || new Date().toISOString(),
    updatedAt: centre?.updatedAt || new Date().toISOString()
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (typeof centre.onDelete === 'function') {
      centre.onDelete(centre);
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="relative z-[100]"> {/* Increased z-index */}
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
          <h2 className="text-2xl font-bold text-gray-800">Centre Details</h2>
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
          {/* Centre Name */}
          <h3 className="text-3xl font-bold text-gray-800 mb-6">{centreData.name}</h3>

          {/* Status Badge */}
          <div className="mb-8">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              centreData.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : centreData.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {centreData.status.charAt(0).toUpperCase() + centreData.status.slice(1)}
            </span>
          </div>

          {/* Map Section */}
          <div className="mb-8 rounded-lg overflow-hidden h-64 bg-gray-100">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPinIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium">Location Coordinates</p>
                {typeof centreData.location === 'string' ? (
                  <p>{centreData.location}</p>
                ) : (
                  <p>
                    {centreData.location?.type || 'Point'} (
                    {centreData.location?.coordinates?.[0] || 'N/A'}, 
                    {centreData.location?.coordinates?.[1] || 'N/A'})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Location Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h4>
              
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="text-gray-800">{centreData.region}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BuildingLibraryIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Municipality</p>
                  <p className="text-gray-800">{centreData.municipalities}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <HomeModernIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Subdivision</p>
                  <p className="text-gray-800">{centreData.subdivision}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-800">{centreData.department}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Description/Address</p>
                  <p className="text-gray-800">{centreData.address}</p>
                </div>
              </div>
            </div>

            {/* Operational Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Operational Details</h4>
              
              <div className="flex items-start space-x-3">
                <UserGroupIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Polling Stations</p>
                  <p className="text-gray-800">{centreData.stations} stations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Wait Time</p>
                  <p className="text-gray-800">{centreData.wait_time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800">{centreData.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Operating Hours</p>
                  <p className="text-gray-800">
                    {centreData.openingTime} - {centreData.closingTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Accessibility Features</h4>
            <div className="flex flex-wrap gap-2">
              {centreData.accessibility.map((feature, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Date Information */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Record Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-800">{formatDate(centreData.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-800">{formatDate(centreData.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit action
                onClose(); // Close view modal first
                if (typeof centre.onEdit === 'function') {
                  centre.onEdit(centre);
                }
              }}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Edit Centre
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Centre
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Centre</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this centre? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDelete}
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

export default ViewCentreModal; 