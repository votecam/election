import React, { useState } from 'react';

const UploadCentre = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    // Demo upload process
    setUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUploading(false);
      setMessage({ type: 'success', text: 'File uploaded successfully! (Demo)' });
      setFile(null);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Upload Centres</h1>
          <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
          <p className="text-gray-600 text-lg">Upload multiple polling centres with a CSV file</p>
        </header>
        
        <a 
          href="#" 
          className="inline-flex items-center px-5 py-2.5 rounded-lg shadow-sm text-white font-medium transition-all duration-200 ease-in-out transform hover:translate-y-[-1px] hover:shadow-md self-start md:self-center mt-2 md:mt-0"
          style={{ 
            background: "linear-gradient(to right, #00694B, #005941)" 
          }}
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.083L7.707 8.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.083V6z" clipRule="evenodd" />
          </svg>
          Download CSV Template
        </a>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 w-full overflow-hidden">
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1" htmlFor="file-upload">
              Upload CSV File
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
                      accept=".csv" 
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-lg mx-1">or drag and drop</p>
                </div>
                <p className="text-sm text-gray-500">CSV up to 10MB</p>
                {file && <p className="text-base text-emerald-600 mt-2 font-medium">Selected: {file.name}</p>}
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-5 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
              style={{ 
                background: "linear-gradient(to right, #00694B, #005941)", 
                "--tw-ring-color": "#00694B" 
              }}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload Centres'
              )}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">CSV Template Requirements</h3>
          <p className="text-gray-600 mb-4">
            Your CSV file should include the following columns:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Centre Name', required: true },
              { name: 'Centre Code', required: true },
              { name: 'Region', required: true },
              { name: 'Division', required: true },
              { name: 'Subdivision', required: false },
              { name: 'Location', required: true },
              { name: 'GPS Coordinates', required: false },
              { name: 'Number of Polling Stations', required: true },
            ].map((field) => (
              <div key={field.name} className="flex items-start bg-white p-3 rounded-md border border-gray-100">
                <div className={`flex-shrink-0 h-5 w-5 ${field.required ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {field.required ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="ml-2 text-base text-gray-700">
                  {field.name} {field.required && <span className="font-medium text-gray-900">(Required)</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCentre; 