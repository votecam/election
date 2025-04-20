import React, { useState } from 'react';

const RegisterCentre = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    division: '',
    subdivision: '',
    location: '',
    gpsCoordinates: '',
    pollingStations: '',
    capacity: '',
    accessibilityFeatures: [],
    description: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        accessibilityFeatures: [...formData.accessibilityFeatures, value]
      });
    } else {
      setFormData({
        ...formData,
        accessibilityFeatures: formData.accessibilityFeatures.filter(item => item !== value)
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        code: '',
        region: '',
        division: '',
        subdivision: '',
        location: '',
        gpsCoordinates: '',
        pollingStations: '',
        capacity: '',
        accessibilityFeatures: [],
        description: ''
      });
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Register Polling Centre</h1>
        <p className="text-gray-600 mt-1">Add a new polling centre to the system</p>
      </header>
      
      {submitSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Polling centre was successfully registered!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Centre Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Centre Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. Central Community Hall"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            {/* Centre Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Centre Code *
              </label>
              <input
                type="text"
                name="code"
                id="code"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. CCH001"
                value={formData.code}
                onChange={handleChange}
              />
            </div>
            
            {/* Region */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <select
                id="region"
                name="region"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Select Region</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="Central">Central</option>
              </select>
            </div>
            
            {/* Division */}
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                Division *
              </label>
              <select
                id="division"
                name="division"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                value={formData.division}
                onChange={handleChange}
              >
                <option value="">Select Division</option>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
                <option value="Suburban">Suburban</option>
              </select>
            </div>
            
            {/* Subdivision */}
            <div>
              <label htmlFor="subdivision" className="block text-sm font-medium text-gray-700 mb-1">
                Subdivision
              </label>
              <input
                type="text"
                name="subdivision"
                id="subdivision"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. Downtown Area"
                value={formData.subdivision}
                onChange={handleChange}
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. 123 Main Street"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            {/* GPS Coordinates */}
            <div>
              <label htmlFor="gpsCoordinates" className="block text-sm font-medium text-gray-700 mb-1">
                GPS Coordinates
              </label>
              <input
                type="text"
                name="gpsCoordinates"
                id="gpsCoordinates"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. 6.1350° N, 1.2085° E"
                value={formData.gpsCoordinates}
                onChange={handleChange}
              />
            </div>
            
            {/* Number of Polling Stations */}
            <div>
              <label htmlFor="pollingStations" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Polling Stations *
              </label>
              <input
                type="number"
                name="pollingStations"
                id="pollingStations"
                required
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. 5"
                value={formData.pollingStations}
                onChange={handleChange}
              />
            </div>
            
            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Voter Capacity
              </label>
              <input
                type="number"
                name="capacity"
                id="capacity"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                placeholder="E.g. 1000"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Accessibility Features */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accessibility Features
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'wheelchair', label: 'Wheelchair Access' },
                { id: 'elevator', label: 'Elevator Access' },
                { id: 'parking', label: 'Accessible Parking' },
                { id: 'restroom', label: 'Accessible Restrooms' },
                { id: 'signage', label: 'Braille Signage' },
                { id: 'hearing', label: 'Hearing Assistance' }
              ].map((feature) => (
                <div key={feature.id} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={feature.id}
                      name={feature.id}
                      type="checkbox"
                      value={feature.id}
                      checked={formData.accessibilityFeatures.includes(feature.id)}
                      onChange={handleCheckboxChange}
                      className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={feature.id} className="font-medium text-gray-700">
                      {feature.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              placeholder="Additional information about this polling centre"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                submitting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
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