import React, { useState, useRef, useEffect } from 'react';

const UploadGuide = () => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const topRef = useRef(null);
  
  // Scroll to top when success message appears
  useEffect(() => {
    if (submitSuccess) {
      window.scrollTo(0, 0);
    }
  }, [submitSuccess]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Show filename as preview
      setFilePreview(file.name);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Immediately scroll to top when upload button is clicked
    scrollToTop();
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      
      // Scroll to top again after success (in case page has scrolled)
      scrollToTop();
      
      // Reset form after successful submission
      setTitle('');
      setSelectedFile(null);
      setFilePreview(null);
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Upload Guide</h1>
          <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
          <p className="text-gray-600 text-lg">Upload guide documents to the electoral system</p>
        </header>
      </div>
      
      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-emerald-800">
                Guide was successfully uploaded!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Form */}
      <div className="bg-white rounded-lg border border-gray-100 w-full overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guide Title */}
          <div>
            <label htmlFor="title" className="block text-base font-semibold text-gray-700 mb-1">
              Guide Title <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                  <path d="M19.937 8.68l-6-3.682A2 2 0 0012 5.933v-.933a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1h7a1 1 0 001-1v-1h3l4 3V9a1 1 0 00-.063-.32zM12 17H6V6h6v11zm2-9h2.5l2 2v7l-2 2H14V8z" />
                </svg>
              </div>
              {/* Vertical separator line */}
              <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
              <input
                type="text"
                id="title"
                name="title"
                className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
                placeholder="Enter guide title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2" htmlFor="file-upload">
              Upload Guide File <span className="text-red-600">*</span>
            </label>
            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-2 text-center">
                <svg
                  className="mx-auto h-14 w-14 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                
                <div className="flex flex-wrap justify-center text-base text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none mx-1"
                  >
                    <span className="text-lg">Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      onChange={handleFileChange}
                      required={!selectedFile}
                      disabled={submitting}
                    />
                  </label>
                  <p className="text-lg mx-1">or drag and drop</p>
                </div>
                
                <p className="text-sm text-gray-500">
                  PDF, Word, PowerPoint, or Excel up to 10MB
                </p>
                
                {filePreview && (
                  <p className="text-base text-emerald-600 mt-2 font-medium">
                    Selected: {filePreview}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
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
                  Uploading...
                </div>
              ) : (
                'Upload Guide'
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Guide Requirements</h3>
          <p className="text-gray-600 mb-4">
            Uploaded guides should follow these guidelines:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Clear Title', description: 'The document should have a clear, descriptive title' },
              { name: 'Official Format', description: 'Must be in PDF, Word, PowerPoint, or Excel format' },
              { name: 'Size Limit', description: 'File size must be under 10MB' },
              { name: 'Content', description: 'Should contain relevant electoral information' },
            ].map((item) => (
              <div key={item.name} className="flex items-start bg-white p-3 rounded-md border border-gray-100">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-base font-medium text-gray-700">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuide; 