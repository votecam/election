import React, { useEffect, useState } from 'react';
import { XMarkIcon, DocumentTextIcon, UserIcon, CalendarIcon, TagIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const ViewReportModal = ({ isOpen, onClose, report, onReportUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDeleteError(null);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
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
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  // Handle delete button click
  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setDeleteError(null);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // TODO: Implement delete API call when available
      // await apiService.reports.deleteReport(report.id);
      
      // For now, just simulate success
      console.log('Deleting report:', report.id);
      
      // Successfully deleted
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      
      // Notify parent component about the deletion
      if (typeof onReportUpdated === 'function') {
        onReportUpdated(report.id, report.title);
      }
      
      onClose();
    } catch (error) {
      console.error("Error during delete operation:", error);
      setDeleteError(error.message || 'An error occurred while deleting the report');
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteError(null);
  };

  // Handle approve action
  const handleApprove = async () => {
    try {
      // TODO: Implement approve API call when available
      console.log('Approving report:', report.id);
      
      // Notify parent component about the update
      if (typeof onReportUpdated === 'function') {
        onReportUpdated(report.id, report.title, 'approved');
      }
      
      onClose();
    } catch (error) {
      console.error("Error during approve operation:", error);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    try {
      // TODO: Implement reject API call when available
      console.log('Rejecting report:', report.id);
      
      // Notify parent component about the update
      if (typeof onReportUpdated === 'function') {
        onReportUpdated(report.id, report.title, 'rejected');
      }
      
      onClose();
    } catch (error) {
      console.error("Error during reject operation:", error);
    }
  };

  return (
    <div className="relative z-[100]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-emerald-600/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 100 }}
      />

      {/* Modal container - slide from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 101 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
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
          {report ? (
            <>
              {/* Report Title and Status */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-3xl font-bold text-gray-800">{report.title}</h3>
                  <p className="text-xl text-gray-600 mt-1">{report.type}</p>
                  
                  {/* Status and Priority */}
                  <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getPriorityBadge(report.priority)}`}>
                      {report.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Report Description</h4>
                <p className="text-base text-gray-700 leading-relaxed">{report.description}</p>
              </div>

              {/* Details Section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Report Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Submitted By</p>
                      <p className="text-base font-medium">{report.submittedBy}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Report Type</p>
                      <p className="text-base font-medium">{report.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="text-base font-medium">{report.submittedDate}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Report ID</p>
                      <p className="text-base font-medium">#{report.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              {report.attachments && report.attachments.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.attachments.map((attachment, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                            <PaperClipIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment}</p>
                            <p className="text-xs text-gray-500">Attachment {index + 1}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Buttons */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove();
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Approve Report
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject();
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject Report
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Delete Report
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No report selected</h3>
              <p className="mt-1 text-sm text-gray-500">Please select a report to view its details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Report</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this report? This action cannot be undone.
                    </p>
                    {deleteError && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-600">{deleteError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                  isDeleting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReportModal;
