import React, { useState, useEffect } from 'react';
import { 
  FunnelIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import ViewReportModal from './components/ViewReportModal';
import ManageReportModal from './components/ManageReportModal';
import SearchAndFilters from './components/SearchAndFilters';
import apiService from '../../../services/apiService';

// Loading skeleton component
const SkeletonLoader = () => (
  <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header skeleton */}
        <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-64"></div>
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-32"></div>
        <div className="h-5 bg-gray-200 animate-pulse rounded-lg w-80"></div>
          </div>
      <div className="h-12 w-44 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
    
    {/* Filters skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg w-40"></div>
        ))}
        </div>
      </div>
      
    {/* Cards skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-48"></div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded w-full"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-24"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );

const ManageReports = () => {
  // State management
  const [reports, setReports] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // All reports from API (for client-side pagination)
  const [allReports, setAllReports] = useState([]);

  // Fetch reports from API
  const fetchReports = async (page = 1) => {
    try {
      setTableLoading(true);
      setError(null);
      
      // Try to get more data to see what's actually available
      const response = await apiService.incidents.getAll(
        page,
        100, // Increased limit to see more data
        statusFilter,
        typeFilter,
        priorityFilter,
        'createdAt',
        'desc',
        '',
        '',
        '',
        '',
        ''
      );
      
      if (response?.data) {
        console.log('API Response:', response.data); // Debug log
        
        // Store all reports for client-side pagination
        const allIncidents = response.data.incidents || [];
        setAllReports(allIncidents);
        
        // Handle pagination data - check if it exists and has the right structure
        const paginationData = response.data.pagination || response.data.meta || {};
        console.log('Pagination Data:', paginationData); // Debug log
        
        // Calculate pagination for client-side display
        const totalReports = paginationData.total || paginationData.totalCount || allIncidents.length;
        const displayLimit = 9; // Display 9 reports per page
        const totalPages = Math.ceil(totalReports / displayLimit);
        
        setPagination({
          total: totalReports,
          page: page,
          limit: displayLimit,
          pages: totalPages
        });
        
        // Set reports for current page (client-side pagination)
        const startIndex = (page - 1) * displayLimit;
        const endIndex = startIndex + displayLimit;
        setReports(allIncidents.slice(startIndex, endIndex));
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      
      // Only redirect to login for specific authentication errors
      if (error.response?.status === 401 || 
          error.message?.includes('Authentication required') || 
          error.message?.includes('Please log in again') ||
          error.message?.includes('Unauthorized')) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 3000);
      } else {
        setError(error.message || 'Failed to load reports. Please try again.');
      }
    } finally {
      setTableLoading(false);
      setInitialLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchReports();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!initialLoading) {
      fetchReports(1);
    }
  }, [statusFilter, typeFilter, priorityFilter]);

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || 
      report.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || 
      report.priority?.toLowerCase() === priorityFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || 
      report.type?.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesStatus && matchesPriority && matchesType;
  });

  // Handle status updates
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      setTableLoading(true);
      console.log('Updating report status:', { reportId, newStatus }); // Debug log
      
      const currentReport = reports.find(report => 
        (report.id === reportId || report._id === reportId)
      );
      
      if (!currentReport) {
        throw new Error('Report not found');
      }
      
      // Use the specific status update endpoint
      const description = `Status updated to ${newStatus}`;
      console.log('Sending status update:', { reportId, newStatus, description }); // Debug log
      await apiService.incidents.updateStatus(reportId, newStatus, description);
      
      setReports(prevReports => 
        prevReports.map(report => 
          (report.id === reportId || report._id === reportId)
            ? { ...report, status: newStatus }
            : report
        )
      );
      
      setSuccessMessage(`Report status updated to ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating report:', error);
      
      // Handle specific authentication errors
      if (error.message?.includes('Authentication required') || 
          error.message?.includes('Please log in again') ||
          error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 3000);
      } else {
        setError(error.message || 'Failed to update report status. Please try again.');
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setTableLoading(false);
    }
  };

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  // Handle manage report
  const handleManageReport = (report) => {
    setSelectedReport(report);
    setIsManageModalOpen(true);
  };

  // Handle export
  const handleExport = () => {
    console.log('Exporting reports...');
    // TODO: Implement export functionality
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'investigating': 'bg-blue-100 text-blue-800 border-blue-200',
      'resolved': 'bg-green-100 text-green-800 border-green-200',
      'dismissed': 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[statusLower] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    const priorityLower = priority?.toLowerCase();
    const styles = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return styles[priorityLower] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Status icon
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    const iconClass = "w-4 h-4";
    
    switch (statusLower) {
      case 'pending':
        return <ClockIcon className={`${iconClass} text-yellow-600`} />;
      case 'investigating':
        return <ExclamationTriangleIcon className={`${iconClass} text-blue-600`} />;
      case 'resolved':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />;
      case 'dismissed':
        return <XMarkIcon className={`${iconClass} text-red-600`} />;
      default:
        return <ClockIcon className={`${iconClass} text-gray-600`} />;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      // Update pagination state
      setPagination(prev => ({ ...prev, page: newPage }));
      
      // Update displayed reports (client-side pagination)
      const displayLimit = 9;
      const startIndex = (newPage - 1) * displayLimit;
      const endIndex = startIndex + displayLimit;
      setReports(allReports.slice(startIndex, endIndex));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (initialLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Alert Messages */}
      {successMessage && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-3" />
            <p className="text-emerald-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">Manage Reports</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          <p className="text-lg text-gray-600 font-medium">
            Review and manage user-submitted incident reports
          </p>
          </div>
          
          <button
          onClick={handleExport}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowDownTrayIcon className="w-5 h-5 mr-3" />
            Export Reports
          </button>
      </header>

      {/* Search and Filters */}
      <SearchAndFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        filteredReports={filteredReports}
        totalReports={pagination.total}
      />
      
      {/* Reports Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Incident Reports</h2>
          </div>
        </div>
        
        {tableLoading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FunnelIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No reports found</h3>
                <p className="text-base text-gray-600 font-medium">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                  <div 
                    key={report.id || report._id} 
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 bg-white hover:border-emerald-200"
                  >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                        report.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        report.status?.toLowerCase() === 'investigating' ? 'bg-blue-50 border-blue-200' :
                        report.status?.toLowerCase() === 'resolved' ? 'bg-green-50 border-green-200' :
                        report.status?.toLowerCase() === 'dismissed' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        {getStatusIcon(report.status)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                          {report.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-600">
                          #{report.referenceNumber || report.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadge(report.status)}`}>
                        {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                      </span>
                      <span className={`text-sm font-bold ${
                        report.priority?.toLowerCase() === 'high' ? 'text-red-600' :
                        report.priority?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                        report.priority?.toLowerCase() === 'low' ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {report.priority?.charAt(0).toUpperCase() + report.priority?.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="mb-4">
                      <p className="text-base text-gray-700 line-clamp-2 mb-3 font-medium">
                        {report.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center font-medium">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                          <span className="font-bold">
                        {report.reporter?.name || report.reporter?.fullDetails?.name || 'Anonymous'}
                          </span>
                      </div>
                        <div className="flex items-center font-medium">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                          <span className="font-bold">{formatDate(report.createdAt)}</span>
                      </div>
                      {report.location && report.location !== 'Unknown Location' && (
                          <div className="flex items-center font-medium">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                            <span className="truncate font-bold">{report.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-wrap gap-2">
                    {/* Quick Action Buttons */}
                    {report.status?.toLowerCase() === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(report.id || report._id, 'investigating')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                          Investigate
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(report.id || report._id, 'resolved')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(report.id || report._id, 'dismissed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                          <XMarkIcon className="w-3 h-3 mr-1" />
                          Dismiss
                        </button>
                      </>
                    )}
                    
                    {report.status?.toLowerCase() === 'investigating' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(report.id || report._id, 'resolved')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(report.id || report._id, 'dismissed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm"
                        >
                          <XMarkIcon className="w-3 h-3 mr-1" />
                          Dismiss
                        </button>
                      </>
                    )}
                    
                    {/* Management and View Buttons */}
                    <button
                      onClick={() => handleManageReport(report)}
                      className="inline-flex items-center px-4 py-2 border border-emerald-300 text-sm font-bold rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage
                    </button>
                    
                    <button
                      onClick={() => handleViewReport(report)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
          )}
          </div>
        )}

        {/* Pagination Controls */}
        {reports.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total || reports.length)} of {pagination.total || reports.length} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    pagination.page === 1
                      ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                        page === pagination.page
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
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    pagination.page === pagination.pages
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

      {/* Manage Report Modal */}
      <ManageReportModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        report={selectedReport}
        onReportUpdated={(reportId, reportTitle, newStatus) => {
          // Update local state when report is updated
          setReports(prevReports => 
            prevReports.map(report => 
              (report.id === reportId || report._id === reportId)
                ? { ...report, status: newStatus }
                : report
            )
          );
          
          // Show success message
          setSuccessMessage(`Incident "${reportTitle}" updated to ${newStatus} successfully!`);
          setTimeout(() => setSuccessMessage(null), 3000);
        }}
      />
    </div>
  );
};

export default ManageReports;