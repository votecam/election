import React, { useEffect, useState } from 'react';
import { XMarkIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const ViewCentreModal = ({ isOpen, onClose, centre }) => {
  const [isVisible, setIsVisible] = useState(false);

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
    address: centre?.location || 'N/A',
    region: centre?.region || 'N/A',
    division: centre?.division || 'N/A',
    stations: centre?.stations || 0,
    status: centre?.status || 'inactive',
    // Default values for fields not in the original data
    phone: 'N/A',
    email: 'N/A',
    website: 'N/A',
    capacity: centre?.stations * 100 || 0, // Estimate based on stations
    registeredVoters: 0,
    openingTime: '08:00 AM',
    closingTime: '04:00 PM',
    openingDate: new Date().toISOString().split('T')[0]
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
          {/* Centre ID Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              ID: {centreData.id}
            </span>
          </div>

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
                <p>Location: {centreData.address}</p>
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
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Division</p>
                  <p className="text-gray-800">{centreData.division}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{centreData.address}</p>
                </div>
              </div>
            </div>

            {/* Capacity & Stations */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Capacity & Stations</h4>
              
              <div className="flex items-start space-x-3">
                <UserGroupIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Polling Stations</p>
                  <p className="text-gray-800">{centreData.stations} stations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserGroupIcon className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Capacity</p>
                  <p className="text-gray-800">{centreData.capacity} voters</p>
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

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit action
              }}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Edit Centre
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle view reports action
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCentreModal; 