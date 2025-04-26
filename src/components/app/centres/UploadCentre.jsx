import React, { useState } from 'react';
import apiService from '../../../services/apiService';

const UploadCentre = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage(null);
    setUploadStats(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    // Check if file is Excel format
    const validExcelTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/csv', 'text/csv'];
    if (!validExcelTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload an Excel or CSV file (.xlsx, .xls, .csv)' });
      return;
    }

    // Set uploading state
    setUploading(true);
    setMessage(null);
    setUploadStats(null);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Add parameters to control processing
    formData.append('processAllRows', 'true');
    formData.append('skipFirstRow', 'true');
    
    try {
      // Call API endpoint
      const response = await apiService.centres.uploadBulk(formData);
      
      // Handle successful response
      setMessage({ 
        type: 'success', 
        text: response.message || 'Centres uploaded successfully!' 
      });
      
      // Display stats if available
      if (response.data) {
        // Check which format of response we have
        if (response.data.summary) {
          // New response format
          setUploadStats({
            total: response.data.summary.total || 0,
            processed: response.data.summary.saved || 0,
            failed: response.data.summary.failed || 0,
            details: response.data.failedRows || [],
            successfulRows: response.data.successfulRows || [],
            errorSummary: response.data.errorSummary
          });
        } else {
          // Old response format
          setUploadStats({
            total: response.data.total || 0,
            processed: response.data.processed || 0,
            failed: response.data.failed || 0,
            details: response.data.details || null
          });
        }
      }
      
      // Reset file selection after successful upload
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle different types of errors
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // If the server returned structured error data with details
        if (responseData.data && (responseData.data.details || responseData.data.failedRows)) {
          setMessage({ 
            type: 'error', 
            text: responseData.message || 'Failed to upload centres. There were issues with the data.' 
          });
          
          if (responseData.data.summary) {
            // New format
            setUploadStats({
              total: responseData.data.summary.total || 0,
              processed: responseData.data.summary.saved || 0,
              failed: responseData.data.summary.failed || 0,
              details: responseData.data.failedRows || [],
              successfulRows: responseData.data.successfulRows || [],
              errorSummary: responseData.data.errorSummary
            });
          } else {
            // Old format
            setUploadStats({
              total: responseData.data.total || 0,
              processed: responseData.data.processed || 0,
              failed: responseData.data.failed || 0,
              details: responseData.data.details || null
            });
          }
        } else {
          // Simple error message
          setMessage({ 
            type: 'error', 
            text: responseData.message || 'Failed to upload centres. Please try again.' 
          });
        }
      } else {
        // Generic error
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to upload centres. Please try again.' 
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create link to download the template
    const link = document.createElement('a');
    link.href = '/csv_template/list_of_centre_registration_centre.xlsx';
    link.download = 'list_of_centre_registration_centre.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Upload Centres</h1>
          <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
          <p className="text-gray-600 text-lg">Upload multiple polling centres with an Excel file</p>
        </header>
        
        <button 
          onClick={handleDownloadTemplate}
          className="inline-flex items-center px-5 py-2.5 rounded-lg shadow-sm text-white font-medium transition-all duration-200 ease-in-out transform hover:translate-y-[-1px] hover:shadow-md self-start md:self-center mt-2 md:mt-0"
          style={{ 
            background: "linear-gradient(to right, #00694B, #005941)" 
          }}
        >
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.083L7.707 8.707a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.083V6z" clipRule="evenodd" />
          </svg>
          Download Excel Template
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 w-full overflow-hidden">
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1" htmlFor="file-upload">
              Upload Excel File
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
                      accept=".xlsx, .xls, .csv" 
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-lg mx-1">or drag and drop</p>
                </div>
                <p className="text-sm text-gray-500">Excel or CSV files (.xlsx, .xls, .csv) up to 10MB</p>
                {file && <p className="text-base text-emerald-600 mt-2 font-medium">Selected: {file.name}</p>}
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <p className="font-medium">{message.text}</p>
              
              {uploadStats && (
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Total rows:</span> {uploadStats.total}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Successfully processed:</span> {uploadStats.processed}
                  </p>
                  {uploadStats.failed > 0 && (
                    <p className="text-sm text-red-600">
                      <span className="font-medium">Failed:</span> {uploadStats.failed}
                    </p>
                  )}
                  
                  {/* Display error summary if available */}
                  {uploadStats.errorSummary && uploadStats.errorSummary.totalErrors > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Error summary:</p>
                      <ul className="mt-1 text-sm list-disc pl-5">
                        {Object.entries(uploadStats.errorSummary.byType).map(([type, count]) => 
                          count > 0 ? (
                            <li key={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} errors: {count}
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display successful rows if available */}
                  {uploadStats.successfulRows && uploadStats.successfulRows.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-700">Successfully uploaded rows:</p>
                      <ul className="mt-1 text-sm list-disc pl-5">
                        {uploadStats.successfulRows.slice(0, 5).map((row, index) => (
                          <li key={index} className="text-green-600">
                            Row {row.rowNumber}: {row.region}, {row.municipalities}
                          </li>
                        ))}
                        {uploadStats.successfulRows.length > 5 && (
                          <li className="text-green-600">And {uploadStats.successfulRows.length - 5} more rows...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display old format details or new format failed rows */}
                  {((uploadStats.details && uploadStats.details.length > 0) ||
                    (uploadStats.failedRows && uploadStats.failedRows.length > 0)) && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Issues found:</p>
                      <ul className="mt-1 text-sm list-disc pl-5">
                        {uploadStats.details ? 
                          // Old format
                          uploadStats.details.slice(0, 5).map((detail, index) => (
                            <li key={index} className="text-red-600">
                              {detail.row && <span>Row {detail.row}: </span>}
                              {detail.message}
                            </li>
                          )) :
                          // New format
                          uploadStats.failedRows.slice(0, 5).map((row, index) => (
                            <li key={index} className="text-red-600">
                              Row {row.rowNumber}: {row.error || 'Unknown error'}
                            </li>
                          ))
                        }
                        {((uploadStats.details && uploadStats.details.length > 5) ||
                          (uploadStats.failedRows && uploadStats.failedRows.length > 5)) && (
                          <li className="text-red-600">
                            And {uploadStats.details ? 
                              uploadStats.details.length - 5 : 
                              uploadStats.failedRows.length - 5} more issues...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Excel Template Requirements</h3>
          <p className="text-gray-600 mb-4">
            Your Excel file must include the following columns:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Region', required: true, description: 'Region where the centre is located (e.g., Centre)' },
              { name: 'Municipalities', required: true, description: 'Municipality of the centre (e.g., Afanloum)' },
              { name: 'Subdivision', required: true, description: 'Administrative subdivision (e.g., Antenne Communale d\'Afanloum)' },
              { name: 'Department', required: true, description: 'Department name (e.g., Méfou-et-Afamba)' },
              { name: 'Description', required: true, description: 'Details about the centre location (e.g., Vers la résidence du chef de district)' },
              { name: 'Contact Number', required: true, description: 'Phone number for the centre (e.g., 683301391)' },
              { name: 'Wait Time', required: true, description: 'Average wait time (e.g., 15 Mins)' },
              { name: 'Accessibility', required: true, description: 'List of accessibility features separated by comma (e.g., Wheelchair Access, Parking, Public Transport)' },
              { name: 'Opening Time', required: true, description: 'Opening hours in format "HH:MM-HH:MM" (e.g., 08:00-17:00)' },
            ].map((field) => (
              <div key={field.name} className="flex items-start bg-white p-3 rounded-md border border-gray-100">
                <div className="flex-shrink-0 h-5 w-5 text-emerald-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-base text-gray-700">
                    {field.name} <span className="font-medium text-gray-900">(Required)</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  The first row of your Excel file should contain these column headers. The system will automatically skip this header row.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCentre; 
