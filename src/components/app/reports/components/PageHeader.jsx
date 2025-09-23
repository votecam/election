import React from 'react';

const PageHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">All Reports</h1>
          <div className="w-40 h-0.5 bg-emerald-600 mt-2 mb-3"></div>
          <p className="text-lg text-gray-600">Overview of all user-submitted reports</p>
        </div>
        
        {/* Export Button */}
        <button
          onClick={() => {
            // TODO: Implement export functionality
            console.log('Export all reports data');
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Reports
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
