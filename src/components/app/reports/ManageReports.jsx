import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ViewReportModal from './components/ViewReportModal';
import apiService from '../../../services/apiService';

// Skeleton loader component
const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-48 mb-2"></div>
            <div className="h-1 bg-gray-200 animate-pulse rounded w-32 mb-3"></div>
            <div className="h-5 bg-gray-200 animate-pulse rounded w-64"></div>
          </div>
          <div className="h-12 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
      
      {/* Search skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ManageReports = () => {
  // State for reports data
  const [reports, setReports] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // State for the view modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch reports from API
  const fetchReports = async (page = 1) => {
    try {
      setTableLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call when available
      // const data = await apiService.reports.getAllReports(page);
      
      // Mock data for now
      const mockData = {
        reports: [
          {
            id: 1,
            title: 'Polling Station Issue Report',
            description: 'Long lines at polling station #123 due to technical difficulties with voting machines. Voters are experiencing significant delays and some machines are not functioning properly.',
            type: 'Incident Report',
            submittedBy: 'John Doe',
            submittedDate: '2024-01-15',
            status: 'Pending',
            priority: 'High',
            attachments: ['incident_photo.jpg', 'machine_error_log.txt'],
            location: 'Polling Station #123',
            contactInfo: 'john.doe@email.com'
          },
          {
            id: 2,
            title: 'Voter Registration Problem',
            description: 'Several voters unable to find their names on the registration list. This is causing confusion and delays at the polling station.',
            type: 'Registration Issue',
            submittedBy: 'Sarah Wilson',
            submittedDate: '2024-01-14',
            status: 'Approved',
            priority: 'Medium',
            attachments: ['registration_list.pdf'],
            location: 'Central Polling Station',
            contactInfo: 'sarah.wilson@email.com'
          },
          {
            id: 3,
            title: 'Security Concern',
            description: 'Suspicious activity observed near polling station entrance. Unauthorized individuals attempting to access restricted areas.',
            type: 'Security Report',
            submittedBy: 'Mike Johnson',
            submittedDate: '2024-01-13',
            status: 'Rejected',
            priority: 'High',
            attachments: ['security_footage.mp4'],
            location: 'Main Polling Station',
            contactInfo: 'mike.johnson@email.com'
          },
          {
            id: 4,
            title: 'Accessibility Issue',
            description: 'Wheelchair ramp not accessible at polling location. Disabled voters unable to access the building.',
            type: 'Accessibility Report',
            submittedBy: 'Emma Davis',
            submittedDate: '2024-01-12',
            status: 'Disabled',
            priority: 'Medium',
            attachments: ['accessibility_photo.jpg'],
            location: 'Community Center',
            contactInfo: 'emma.davis@email.com'
          },
          {
            id: 5,
            title: 'Equipment Malfunction',
            description: 'Voting machine not working properly at station #456. Multiple voters reporting issues with ballot scanning.',
            type: 'Technical Issue',
            submittedBy: 'Robert Brown',
            submittedDate: '2024-01-11',
            status: 'Pending',
            priority: 'High',
            attachments: ['error_screenshot.png'],
            location: 'Polling Station #456',
            contactInfo: 'robert.brown@email.com'
          },
          {
            id: 6,
            title: 'Staff Shortage',
            description: 'Insufficient staff members at polling location. Long lines and delays due to understaffing.',
            type: 'Staffing Issue',
            submittedBy: 'Lisa Garcia',
            submittedDate: '2024-01-10',
            status: 'Approved',
            priority: 'Medium',
            attachments: [],
            location: 'Elementary School',
            contactInfo: 'lisa.garcia@email.com'
          }
        ],
        pagination: {
          total: 6,
          page: 1,
          limit: 10,
          pages: 1
        }
      };
      
      setReports(mockData.reports);
      setPagination(mockData.pagination);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please try again.');
    } finally {
      setTableLoading(false);
      setInitialLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchReports();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setOpenMenuId(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || report.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || report.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Handle report actions
  const handleReportAction = async (reportId, action) => {
    try {
      setTableLoading(true);
      
      // TODO: Replace with actual API call when available
      // await apiService.reports.updateReportStatus(reportId, action);
      
      // Update local state for now
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: action }
            : report
        )
      );
      
      setSuccessMessage(`Report ${action.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating report:', error);
      setError('Failed to update report. Please try again.');
    } finally {
      setTableLoading(false);
    }
  };

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  // Handle delete report
  const handleDeleteReport = (report) => {
    setReportToDelete(report);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // TODO: Replace with actual API call when available
      // await apiService.reports.deleteReport(reportToDelete.id);
      
      // Update local state for now
      setReports(prevReports => 
        prevReports.filter(report => report.id !== reportToDelete.id)
      );
      
      setSuccessMessage(`Report "${reportToDelete.title}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setShowDeleteConfirmation(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Failed to delete report. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
  };

  if (initialLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Manage Reports</h1>
            <div className="w-40 h-0.5 bg-emerald-600 mt-2 mb-3"></div>
            <p className="text-base text-gray-600">Review and manage user-submitted reports</p>
          </div>
          
          {/* Export Button */}
          <button
            onClick={() => {
              // TODO: Implement export functionality
              console.log('Export reports data');
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

      {/* Advanced Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder-gray-500"
                placeholder="Search reports by title, description, submitter, or type..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disabled">Disabled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            >
              <option value="all">All Types</option>
              <option value="incident report">Incident Report</option>
              <option value="registration issue">Registration Issue</option>
              <option value="security report">Security Report</option>
              <option value="accessibility report">Accessibility Report</option>
              <option value="technical issue">Technical Issue</option>
              <option value="staffing issue">Staffing Issue</option>
            </select>
            
            {/* Clear Filters */}
            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
            
            <div className="flex items-center space-x-2 text-base text-gray-600">
              <FunnelIcon className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-emerald-600">{filteredReports.length}</span>
              <span>of</span>
              <span className="font-semibold text-gray-800">{reports.length}</span>
              <span>reports</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reports Notifications Layout */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">User-Submitted Reports</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tableLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-start space-x-4 p-4">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      report.status === 'Pending' ? 'bg-yellow-100' :
                      report.status === 'Approved' ? 'bg-green-100' :
                      report.status === 'Rejected' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        report.status === 'Pending' ? 'text-yellow-600' :
                        report.status === 'Approved' ? 'text-green-600' :
                        report.status === 'Rejected' ? 'text-red-600' :
                        'text-gray-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(report.priority)}`}>
                            {report.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-base leading-relaxed mb-2">{report.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {report.submittedBy}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {report.type}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {report.submittedDate}
                          </span>
                          {report.attachments && report.attachments.length > 0 && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {report.attachments.length} attachment(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {report.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleReportAction(report.id, 'Approved')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'Rejected')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                      {report.status !== 'Disabled' && (
                        <button
                          onClick={() => handleReportAction(report.id, 'Disabled')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                          Disable
                        </button>
                      )}
                      <button
                        onClick={() => handleViewReport(report)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredReports.length === 0 && !tableLoading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* View Report Modal */}
      <ViewReportModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        report={selectedReport}
        onReportUpdated={(reportId, reportTitle, action) => {
          if (action) {
            handleReportAction(reportId, action);
          }
        }}
      />

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
                      Are you sure you want to delete the report "{reportToDelete?.title}"? This action cannot be undone.
                    </p>
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
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setReportToDelete(null);
                }}
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

export default ManageReports;
