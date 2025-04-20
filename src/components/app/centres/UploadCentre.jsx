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
    <div className="w-full max-w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upload Polling Centres</h1>
        <p className="text-gray-600 mt-1">Upload multiple polling centres with a CSV file</p>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <form onSubmit={handleUpload}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="file-upload">
              Upload CSV File
            </label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
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
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV up to 10MB</p>
                {file && <p className="text-sm text-emerald-600 mt-2">Selected: {file.name}</p>}
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                uploading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">CSV Template Requirements</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your CSV file should include the following columns:
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <li key={field.name} className="flex items-start">
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
                <p className="ml-2 text-sm text-gray-600">
                  {field.name} {field.required && <span className="font-medium text-gray-900">(Required)</span>}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a 
              href="#" 
              className="text-emerald-600 hover:text-emerald-500 text-sm font-medium inline-flex items-center"
            >
              Download template CSV
              <svg className="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCentre; 