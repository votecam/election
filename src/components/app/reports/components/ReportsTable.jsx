import React, { useState, useMemo, useEffect } from 'react';
import ViewReportModal from './ViewReportModal';

const ReportsTable = ({ filteredReports, pagination, onPageChange, loading, error }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'investigating': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Disabled': 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800',
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format incident type for display
  const formatIncidentType = (type) => {
    if (!type) return 'Unknown';
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = useMemo(() => {
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, startIndex, endIndex]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when filteredReports changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredReports]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Incident Reports Overview</h2>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[60px]">#</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[300px]">Incident Details</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Reporter</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">Type</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Priority</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">Date & Time</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReports.map((report, index) => (
                <tr key={report._id || report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="text-lg font-bold text-gray-800 text-center">
                      {startIndex + index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="space-y-2">
                      <div className="text-lg font-semibold text-gray-900 leading-tight">{report.title}</div>
                      <div className="text-base text-gray-600 leading-relaxed max-w-md">{report.description}</div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="bg-gray-100 px-3 py-1.5 rounded-md font-mono text-sm">#{report.referenceNumber}</span>
                        {report.location && (
                          <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate max-w-[150px]">{report.location}</span>
                          </span>
                        )}
                        {report.media && report.media.length > 0 && (
                          <div className="flex items-center space-x-3 text-gray-500">
                            {report.media.filter(m => m.type === 'image').length > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {report.media.filter(m => m.type === 'image').length} image(s)
                              </span>
                            )}
                            {report.media.filter(m => m.type === 'video').length > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {report.media.filter(m => m.type === 'video').length} video(s)
                              </span>
                            )}
                            {report.media.filter(m => m.type === 'audio').length > 0 && (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                {report.media.filter(m => m.type === 'audio').length} voice note(s)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="text-base font-medium text-gray-900">{report.reporter?.name || 'Anonymous'}</div>
                    {report.reporter?.isAnonymous && (
                      <div className="text-sm text-gray-500 mt-1">Anonymous Report</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="text-base text-gray-900 leading-tight">{formatIncidentType(report.type)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getPriorityBadge(report.priority)}`}>
                      {report.priority?.charAt(0).toUpperCase() + report.priority?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <div className="text-base font-medium text-gray-900">{formatDate(report.createdAt)}</div>
                    <div className="text-sm text-gray-500 mt-1">{report.time}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-normal">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
        {filteredReports.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredReports.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                        page === currentPage
                          ? 'text-white bg-emerald-600 border-emerald-600'
                          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* View Report Modal */}
      <ViewReportModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        report={selectedReport}
      />
    </>
  );
};

export default ReportsTable;
