import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';
import apiService from '../../../../services/apiService';

const ManageReportModal = ({ isOpen, onClose, report, onReportUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showStatusForm, setShowStatusForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowStatusForm(false);
      setSelectedStatus('');
      setStatusDescription('');
      setUpdateError(null);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      
      const incidentId = report.id || report._id;
      const description = statusDescription || `Status updated to ${selectedStatus}`;
      
      await apiService.incidents.updateStatus(incidentId, selectedStatus, description);
      
      // Notify parent component about the update
      if (typeof onReportUpdated === 'function') {
        onReportUpdated(incidentId, report.title, selectedStatus);
      }
      
      setShowStatusForm(false);
      setSelectedStatus('');
      setStatusDescription('');
      onClose();
    } catch (error) {
      console.error("Error updating incident:", error);
      setUpdateError(error.message || 'Failed to update incident');
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = (status, description) => {
    setSelectedStatus(status);
    setStatusDescription(description);
    setShowStatusForm(true);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'investigating': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-red-100 text-red-800',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800',
    };
    return styles[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-gray-800">Manage Report</h2>
            <p className="text-lg text-gray-600 mt-2">Update status and add timeline notes</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {report ? (
            <>
              {/* Report Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{report.title}</h3>
                  <div className="flex space-x-3">
                    <span className={`text-base font-bold ${
                      report.status?.toLowerCase() === 'pending' ? 'text-yellow-600' :
                      report.status?.toLowerCase() === 'investigating' ? 'text-blue-600' :
                      report.status?.toLowerCase() === 'resolved' ? 'text-green-600' :
                      report.status?.toLowerCase() === 'dismissed' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {report.status}
                    </span>
                    <span className={`text-base font-bold ${
                      report.priority?.toLowerCase() === 'high' ? 'text-red-600' :
                      report.priority?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                      report.priority?.toLowerCase() === 'low' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {report.priority}
                    </span>
                  </div>
                </div>
                <p className="text-base text-gray-700 mb-3 leading-relaxed">{report.description}</p>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Reference:</span> {report.referenceNumber || 'N/A'}
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Location:</span> {report.location || 'N/A'}
                </div>
              </div>

              {/* Quick Actions */}
              {!showStatusForm && (
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-5">Quick Actions</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {report.status?.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleQuickAction('investigating', 'Escalated to investigation after initial review')}
                        className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-3" />
                          <div className="text-left">
                        <div className="text-xl font-bold text-blue-800">Investigate</div>
                            <div className="text-base text-blue-600">Escalate for detailed investigation</div>
                          </div>
                        </div>
                        <div className="text-xl text-blue-600">→</div>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleQuickAction('resolved', 'Incident resolved after review')}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                        <div className="text-left">
                        <div className="text-xl font-bold text-green-800">Resolve</div>
                            <div className="text-base text-green-600">Mark incident as resolved</div>
                        </div>
                      </div>
                        <div className="text-xl text-green-600">→</div>
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction('dismissed', 'Incident dismissed after review')}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <XIcon className="h-5 w-5 text-red-600 mr-3" />
                        <div className="text-left">
                        <div className="text-xl font-bold text-red-800">Dismiss</div>
                            <div className="text-base text-red-600">Dismiss incident as invalid</div>
                        </div>
                      </div>
                        <div className="text-xl text-red-600">→</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Status Update Form */}
              {showStatusForm && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-2xl font-bold text-gray-800">Update Status</h4>
                    <button
                      onClick={() => {
                        setShowStatusForm(false);
                        setSelectedStatus('');
                        setStatusDescription('');
                        setUpdateError(null);
                      }}
                      className="text-lg text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        New Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Select status...</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Timeline Description
                      </label>
                      <textarea
                        value={statusDescription}
                        onChange={(e) => setStatusDescription(e.target.value)}
                        placeholder="Add a description for the timeline..."
                        rows={5}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <p className="text-base text-gray-500 mt-2">
                        This description will be added to the incident timeline
                      </p>
                    </div>
                    
                    {updateError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-lg text-red-600 font-medium">{updateError}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Management Options */}
              {!showStatusForm && (
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-gray-800 mb-5">Additional Actions</h4>
                  <div className="space-y-4">
                    <button className="w-full text-left p-5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-xl font-bold text-gray-800">Export Report</div>
                      <div className="text-base text-gray-600 mt-1">Generate PDF report for this incident</div>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Report Selected</h3>
              <p className="text-base text-gray-600">Please select a report to manage.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {showStatusForm && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowStatusForm(false);
                  setSelectedStatus('');
                  setStatusDescription('');
                  setUpdateError(null);
                }}
                className="px-6 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || !selectedStatus}
                className={`px-8 py-3 text-lg font-bold text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isUpdating || !selectedStatus ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReportModal;
