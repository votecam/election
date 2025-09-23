import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import PageHeader from './components/PageHeader';
import StatsCards from './components/StatsCards';
import SearchAndFilters from './components/SearchAndFilters';
import ReportsTable from './components/ReportsTable';
import SkeletonLoader from './components/SkeletonLoader';

const AllReports = () => {
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [locationFilter, setLocationFilter] = useState('');
  const [reporterIdFilter, setReporterIdFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    dismissed: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [error, setError] = useState(null);

  const fetchIncidents = async (page = 1, isFilterChange = false) => {
    if (isFilterChange) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    // Check authentication before making API call
    if (!apiService.checkAuth()) {
      setError('Your session has expired. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    try {
      // Build query parameters for the API call
      const queryParams = {
        page,
        limit: pagination.itemsPerPage,
        status: statusFilter,
        type: typeFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder
      };

      // Add optional parameters if they have values
      if (locationFilter) queryParams.location = locationFilter;
      if (reporterIdFilter) queryParams.reporterId = reporterIdFilter;
      if (dateFromFilter) queryParams.dateFrom = dateFromFilter;
      if (dateToFilter) queryParams.dateTo = dateToFilter;

      const response = await apiService.incidents.getAll(
        queryParams.page,
        queryParams.limit,
        queryParams.status,
        queryParams.type,
        queryParams.priority,
        queryParams.sortBy,
        queryParams.sortOrder,
        queryParams.search,
        queryParams.location,
        queryParams.reporterId,
        queryParams.dateFrom,
        queryParams.dateTo
      );

      if (response && response.data) {
        setReports(response.data.incidents || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 50
        });
        setStats(response.data.stats || {
          total: 0,
          pending: 0,
          investigating: 0,
          resolved: 0,
          dismissed: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        });
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      
      // Handle authentication errors specifically
      if (error.message?.includes('Authentication required') || error.message?.includes('Please log in again')) {
        setError('You need to be logged in to view incident reports. Please log in and try again.');
        // Optionally redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
      setError(error.message || 'Failed to load incidents. Please try again later.');
      }
    } finally {
      if (isFilterChange) {
        setFilterLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchIncidents(1, false); // Initial load
  }, []);

  // Filter changes
  useEffect(() => {
    fetchIncidents(1, true); // Reset to first page when filters change
  }, [statusFilter, typeFilter, priorityFilter, sortBy, sortOrder, locationFilter, reporterIdFilter, dateFromFilter, dateToFilter]);

  // Since we're now doing server-side filtering, we use reports directly
  const filteredReports = reports;

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchIncidents(newPage);
  };


  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <PageHeader />
      <StatsCards stats={stats} loading={loading} />
      
      {error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Incident Reports</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {error.includes('Server error') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Server Issue Detected</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The backend API is experiencing issues. This is likely a temporary server problem. 
                      Please try again in a few minutes or contact your system administrator.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => fetchIncidents(1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <SearchAndFilters 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            filteredReports={filteredReports}
            totalReports={pagination.totalItems}
          />
          <ReportsTable 
            filteredReports={filteredReports} 
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={filterLoading}
            error={error}
          />
        </>
      )}
    </div>
  );
};

export default AllReports;