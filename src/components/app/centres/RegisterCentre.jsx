import React, { useState, useRef, useEffect } from 'react';
import apiService from '../../../services/apiService';

const RegisterCentre = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    region: '',
    municipalities: '',
    subdivision: '',
    department: '',
    description: '',
    contact_number: '',
    wait_time: '',
    accessibility: [],
    opening_time: {
      from: '08:00',
      to: '17:00'
    },
    responsible: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [municipalitiesOpen, setMunicipalitiesOpen] = useState(false);
  const [errors, setErrors] = useState({});
  
  const regionRef = useRef(null);
  const municipalitiesRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setRegionOpen(false);
      }
      if (municipalitiesRef.current && !municipalitiesRef.current.contains(event.target)) {
        setMunicipalitiesOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      opening_time: {
        ...formData.opening_time,
        [name]: value
      }
    });
  };
  
  const handleDayOperationChange = (index, field, value) => {
    const updatedHours = [...formData.hours_of_operation];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    
    
  };
  
  const handleRegionSelect = (value) => {
    setFormData({
      ...formData,
      region: value
    });
    setRegionOpen(false);
  };
  
  const handleMunicipalitiesSelect = (value) => {
    setFormData({
      ...formData,
      municipalities: value
    });
    setMunicipalitiesOpen(false);
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        accessibility: [...formData.accessibility, value]
      });
    } else {
      setFormData({
        ...formData,
        accessibility: formData.accessibility.filter(item => item !== value)
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Centre name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Centre address is required';
    }
    
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }
    
    if (!formData.municipalities.trim()) {
      newErrors.municipalities = 'Municipality is required';
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^\d+$/.test(formData.contact_number.trim())) {
      newErrors.contact_number = 'Contact number must contain only digits';
    }
    
    if (!formData.responsible.trim()) {
      newErrors.responsible = 'Responsible person is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
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
    
    setSubmitting(true);
    
    try {
      // Call the real API endpoint to register the centre
      await apiService.centres.register(formData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        address: '',
        region: '',
        municipalities: '',
        subdivision: '',
        department: '',
        description: '',
        contact_number: '',
        wait_time: '',
        accessibility: [],
        opening_time: {
          from: '08:00',
          to: '17:00'
        },
        responsible: ''
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
        message: error.message || 'Failed to register centre. Please try again.'
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
      setSubmitting(false);
    }
  };

  // Add alert state for error messages
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    message: ''
  });

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Register Electoral Centre</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <div className="flex items-center mt-2">
          <p className="text-gray-600 text-lg">Add a new electoral centre to the system</p>
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
                Electoral centre was successfully registered!
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Centre Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1">
                Centre Name
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
                  className={`pl-16 w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            {/* Centre Address Field */}
            <div>
              <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-1">
                Centre Address
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
                
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="E.g. Calle Principal 123"
                  className={`pl-16 w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out`}
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            
            {/* Region - Custom Dropdown */}
            <div>
              <label htmlFor="region" className="block text-base font-semibold text-gray-700 mb-1">
                Region
              </label>
              <div className="relative" ref={regionRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                    <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z" />
                  </svg>
                </div>
                
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${errors.region ? 'border-red-500' : regionOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setRegionOpen(!regionOpen)}
                >
                  <span className={formData.region ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {formData.region || "Select Region"}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${regionOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {regionOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-xl border border-gray-200 rounded-md overflow-hidden transform origin-top transition-all duration-200 ease-in-out">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center"
                        onClick={() => handleRegionSelect("")}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Region
                      </div>
                      {["Bioko Norte", "Bioko Sur", "Annobón", "Centro Sur", "Kié-Ntem", "Litoral", "Wele-Nzas"].map((region) => (
                        <div 
                          key={region}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                            formData.region === region 
                              ? "text-emerald-700 font-medium" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleRegionSelect(region)}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${formData.region === region ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {formData.region === region ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {region}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
            </div>
            
            {/* Municipalities - Custom Dropdown */}
            <div>
              <label htmlFor="municipalities" className="block text-base font-semibold text-gray-700 mb-1">
                Municipalities
              </label>
              <div className="relative" ref={municipalitiesRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                    <path d="M22 20v-9a1 1 0 0 0-.486-.857l-9-5.4a2 2 0 0 0-2.028 0l-9 5.4A1 1 0 0 0 1 11v9a1 1 0 0 0 1 1h5v-6h8v6h5a1 1 0 0 0 1-1zm-10-9v-1a2 2 0 1 0-4 0v1h4z" />
                  </svg>
                </div>
                
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <div 
                  className={`pl-16 w-full px-4 py-3 border ${errors.municipalities ? 'border-red-500' : municipalitiesOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out`}
                  onClick={() => setMunicipalitiesOpen(!municipalitiesOpen)}
                >
                  <span className={formData.municipalities ? "text-gray-900 font-medium" : "text-gray-500"}>
                    {formData.municipalities || "Select Municipality"}
                  </span>
                  <svg 
                    className={`h-5 w-5 text-emerald-600 transition-transform duration-200 ${municipalitiesOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {municipalitiesOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-xl border border-gray-200 rounded-md overflow-hidden transform origin-top transition-all duration-200 ease-in-out">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <div 
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 border-b border-gray-100 flex items-center"
                        onClick={() => handleMunicipalitiesSelect("")}
                      >
                        <span className="text-gray-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </span>
                        Select Municipality
                      </div>
                      {["Malabo", "Baney", "Luba", "Riaba", "Moka", "Bata", "Mbini", "Cogo", "Evinayong", "Niefang", "Akurenam"].map((municipality) => (
                        <div 
                          key={municipality}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                            formData.municipalities === municipality 
                              ? "text-emerald-700 font-medium" 
                              : "text-gray-700"
                          }`}
                          onClick={() => handleMunicipalitiesSelect(municipality)}
                        >
                          <div className="flex items-center">
                            <span className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 ${formData.municipalities === municipality ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {formData.municipalities === municipality ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="block h-2 w-2 rounded-full bg-gray-300"></span>
                              )}
                            </span>
                            {municipality}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.municipalities && <p className="mt-1 text-sm text-red-600">{errors.municipalities}</p>}
            </div>
            
            {/* Subdivision Field */}
            <div>
              <label htmlFor="subdivision" className="block text-base font-semibold text-gray-700 mb-1">
                Subdivision
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
                />
              </div>
            </div>
            
            {/* Department Field */}
            <div>
              <label htmlFor="department" className="block text-base font-semibold text-gray-700 mb-1">
                Department
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
                />
              </div>
            </div>
            
            {/* Contact Number Field */}
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
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="E.g. 683123456"
                  className={`pl-16 w-full px-4 py-3 border ${errors.contact_number ? 'border-red-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out`}
                />
              </div>
              {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
            </div>
            
            {/* Wait Time Field */}
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
                  id="wait_time"
                  name="wait_time"
                  value={formData.wait_time}
                  onChange={handleChange}
                  placeholder="E.g. 15 Mins"
                  className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                />
              </div>
            </div>
            
            {/* Responsible Person Field */}
            <div>
              <label htmlFor="responsible" className="block text-base font-semibold text-gray-700 mb-1">
                Responsible Person
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                    <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20Z"></path>
                    <path d="M12 6a3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4zm0 6a1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2 1.91 1.91 0 0 1-2 2z"></path>
                  </svg>
                </div>
                
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                
                <input
                  type="text"
                  id="responsible"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                  placeholder="E.g. John Doe"
                  className={`pl-16 w-full px-4 py-3 border ${errors.responsible ? 'border-red-500' : 'border-gray-300'} rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out`}
                />
              </div>
              {errors.responsible && <p className="mt-1 text-sm text-red-600">{errors.responsible}</p>}
            </div>
          </div>
          
          {/* Accessibility Features */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Accessibility Features
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Wheelchair Access', label: 'Wheelchair Access', icon: '♿' },
              
                { id: 'Parking', label: 'Accessible Parking', icon: '🅿️' },
                { id: 'Public Transport', label: 'Public Transport', icon: '🚌' },
              
              ].map((feature) => (
                <div key={feature.id} className="flex items-center">
                  <input
                    id={feature.id}
                    name={feature.id}
                    type="checkbox"
                    value={feature.id}
                    checked={formData.accessibility.includes(feature.id)}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 border-gray-300 rounded focus:ring-emerald-500"
                    style={{ 
                      "--tw-ring-color": "#00694B",
                      color: "#00694B" 
                    }}
                  />
                  <label htmlFor={feature.id} className="ml-3 text-base font-medium text-gray-700">
                    <span className="mr-2">{feature.icon}</span> {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Opening Hours */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Opening Hours
            </label>
            <div className="grid grid-cols-2 gap-6">
              {/* From Time */}
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
                    id="from"
                    name="from"
                    value={formData.opening_time.from}
                    onChange={handleTimeChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                  />
                </div>
              </div>
              
              {/* To Time */}
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
                    id="to"
                    name="to"
                    value={formData.opening_time.to}
                    onChange={handleTimeChange}
                    className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ease-in-out"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-base font-semibold text-gray-700 mb-1">
              Describe the electoral centre.
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className={`block w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white`}
              style={{ 
                "--tw-ring-color": "#00694B",
                "--tw-border-opacity": 1,
                "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
              }}
              placeholder="E.g. Centro Electoral Nacional de Malabo, cerca del Ministerio de Educación"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 px-5 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
              style={{ 
                background: "linear-gradient(to right, #00694B, #005941)", 
                "--tw-ring-color": "#00694B" 
              }}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering Centre...
                </div>
              ) : (
                'Register Centre'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCentre; 