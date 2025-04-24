import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const EditCentreModal = ({ isOpen, onClose, centre, onSave }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    municipalities: '',
    subdivision: '',
    department: '',
    description: '',
    contact_number: '',
    wait_time: '',
    stations: 0,
    status: 'active',
    accessibility: [],
    opening_time: {
      from: '08:00',
      to: '17:00'
    }
  });

  // Control visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Update form data when centre changes
  useEffect(() => {
    if (centre) {
      setFormData({
        name: centre.name || '',
        region: centre.region || '',
        municipalities: centre.municipalities || '',
        subdivision: centre.subdivision || '',
        department: centre.department || '',
        description: centre.description || '',
        contact_number: centre.contact_number || '',
        wait_time: centre.wait_time || '',
        stations: centre.stations || 0,
        status: centre.status || 'active',
        accessibility: Array.isArray(centre.accessibility) ? [...centre.accessibility] : [],
        opening_time: {
          from: centre.opening_time?.from || '08:00',
          to: centre.opening_time?.to || '17:00'
        }
      });
    }
  }, [centre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      opening_time: {
        ...prev.opening_time,
        [name]: value
      }
    }));
  };

  const handleAccessibilityChange = (feature, isChecked) => {
    setFormData(prev => {
      if (isChecked) {
        return {
          ...prev,
          accessibility: [...prev.accessibility, feature]
        };
      } else {
        return {
          ...prev,
          accessibility: prev.accessibility.filter(item => item !== feature)
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...centre,
      ...formData,
      // Make sure to preserve any location data
      location: centre.location || { type: 'Point', coordinates: [0, 0] }
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const accessibilityOptions = [
    'Wheelchair Access',
    'Parking',
    'Public Transport',
    'Elevator',
    'Restroom Access',
    'Assistance Available',
    'Braille Signage',
    'Sign Language'
  ];

  return (
    <div className="relative z-[200]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-emerald-600/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 200 }}
      />

      {/* Modal container - slide from right with more width */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 201 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
          <h2 className="text-2xl font-bold text-gray-800">Edit Centre</h2>
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
        {centre && (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1">
                      Centre Name*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M19 2H5c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 18H5V4h14v16z" />
                          <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="E.g. Centro Electoral Nacional"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-base font-semibold text-gray-700 mb-1">
                      Status*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                          <path d="M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="region" className="block text-base font-semibold text-gray-700 mb-1">
                      Region*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        placeholder="E.g. Bioko Norte"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="municipalities" className="block text-base font-semibold text-gray-700 mb-1">
                      Municipality*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M22 20v-9a1 1 0 0 0-.486-.857l-9-5.4a2 2 0 0 0-2.028 0l-9 5.4A1 1 0 0 0 1 11v9a1 1 0 0 0 1 1h5v-6h8v6h5a1 1 0 0 0 1-1zm-10-9v-1a2 2 0 1 0-4 0v1h4z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        id="municipalities"
                        name="municipalities"
                        value={formData.municipalities}
                        onChange={handleChange}
                        placeholder="E.g. Malabo"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subdivision" className="block text-base font-semibold text-gray-700 mb-1">
                      Subdivision*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        id="subdivision"
                        name="subdivision"
                        value={formData.subdivision}
                        onChange={handleChange}
                        placeholder="E.g. Zona Este"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-base font-semibold text-gray-700 mb-1">
                      Department*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm-5-2v2H9V4h6zM8 8h12v3H4V8h4zm-4 13v-8h16v8H4z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="E.g. Centro Electoral Principal"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-1">
                      Description/Address*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z" />
                          <path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 10c-.029 6.44 7.116 11.599 7.42 11.814zM12 4c3.309 0 6 2.691 6 6.008.015 4.712-5.284 8.706-6 9.274-.716-.568-6.015-4.562-6-9.274C6 6.691 8.691 4 12 4z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="E.g. Centro Electoral Nacional de Malabo, cerca del Ministerio de Educación"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Operational Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Operational Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="stations" className="block text-base font-semibold text-gray-700 mb-1">
                      Number of Stations*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M19 7h-5V5c0-.6-.4-1-1-1H5a2 2 0 0 0-2 2v10c0 .6.4 1 1 1h1c0 1.7 1.3 3 3 3s3-1.3 3-3h4c0 1.7 1.3 3 3 3s3-1.3 3-3h2v-5l-3-4zM8 19c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm-1-7V9l2.3 3H17z"/>
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="number"
                        name="stations"
                        id="stations"
                        value={formData.stations}
                        onChange={handleChange}
                        min="1"
                        placeholder="E.g. 5"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="contact_number" className="block text-base font-semibold text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" />
                          <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        name="contact_number"
                        id="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        placeholder="E.g. 683123456"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="wait_time" className="block text-base font-semibold text-gray-700 mb-1">
                      Wait Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                          <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                        </svg>
                      </div>
                      
                      {/* Vertical separator line */}
                      <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                      
                      <input
                        type="text"
                        name="wait_time"
                        id="wait_time"
                        value={formData.wait_time}
                        onChange={handleChange}
                        placeholder="E.g. 15 Mins"
                        className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-1">
                      Operating Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                          From
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                              <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                            </svg>
                          </div>
                          
                          {/* Vertical separator line */}
                          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                          
                          <input
                            type="time"
                            name="from"
                            id="from"
                            value={formData.opening_time.from}
                            onChange={handleTimeChange}
                            className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                          To
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                              <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                            </svg>
                          </div>
                          
                          {/* Vertical separator line */}
                          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                          
                          <input
                            type="time"
                            name="to"
                            id="to"
                            value={formData.opening_time.to}
                            onChange={handleTimeChange}
                            className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Accessibility Features Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Accessibility Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Wheelchair Access', label: 'Wheelchair Access', icon: '♿' },
                    { id: 'Parking', label: 'Accessible Parking', icon: '🅿️' },
                    { id: 'Public Transport', label: 'Public Transport', icon: '🚌' },
                    { id: 'Elevator', label: 'Elevator', icon: '🔼' },
                    { id: 'Restroom Access', label: 'Restroom Access', icon: '🚻' },
                    { id: 'Assistance Available', label: 'Assistance Available', icon: '🤝' },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        id={`accessibility-${index}`}
                        type="checkbox"
                        checked={formData.accessibility.includes(feature.id)}
                        onChange={(e) => handleAccessibilityChange(feature.id, e.target.checked)}
                        className="h-5 w-5 border-gray-300 rounded focus:ring-emerald-500"
                        style={{ 
                          "--tw-ring-color": "#00694B",
                          color: "#00694B" 
                        }}
                      />
                      <label htmlFor={`accessibility-${index}`} className="ml-3 text-base font-medium text-gray-700">
                        <span className="mr-2">{feature.icon}</span> {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-4 px-5 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)", 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="flex-1 py-4 px-5 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 text-xl"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCentreModal; 