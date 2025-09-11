import React, { useState, useEffect } from 'react';
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
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate loading user-submitted reports
    const timer = setTimeout(() => {
      setLoading(false);
      // Mock data for user-submitted reports
      setReports([
        {
          id: 1,
          title: 'Polling Station Issue Report',
          description: 'Long lines at polling station #123 due to technical difficulties with voting machines.',
          type: 'Incident Report',
          submittedBy: 'John Doe',
          submittedDate: '2024-01-15',
          status: 'Pending',
          priority: 'High',
          attachments: ['incident_photo.jpg', 'machine_error_log.txt']
        },
        {
          id: 2,
          title: 'Voter Registration Problem',
          description: 'Several voters unable to find their names on the registration list.',
          type: 'Registration Issue',
          submittedBy: 'Sarah Wilson',
          submittedDate: '2024-01-14',
          status: 'Approved',
          priority: 'Medium',
          attachments: ['registration_list.pdf']
        },
        {
          id: 3,
          title: 'Security Concern',
          description: 'Suspicious activity observed near polling station entrance.',
          type: 'Security Report',
          submittedBy: 'Mike Johnson',
          submittedDate: '2024-01-13',
          status: 'Rejected',
          priority: 'High',
          attachments: ['security_footage.mp4']
        },
        {
          id: 4,
          title: 'Accessibility Issue',
          description: 'Wheelchair ramp not accessible at polling location.',
          type: 'Accessibility Report',
          submittedBy: 'Emma Davis',
          submittedDate: '2024-01-12',
          status: 'Disabled',
          priority: 'Medium',
          attachments: ['accessibility_photo.jpg']
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Handle report actions
  const handleReportAction = (reportId, action) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, status: action }
          : report
      )
    );
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

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header with emerald underline */}
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">User Reports</h1>
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

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder-gray-500"
                placeholder="Search reports by title, description, or submitter..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
            
            <div className="flex items-center space-x-2 text-base text-gray-600">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold text-emerald-600">{filteredReports.length}</span>
              <span>of</span>
              <span className="font-semibold text-gray-800">{reports.length}</span>
              <span>reports</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reports Cards Layout */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">User-Submitted Reports</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                {/* Report Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed">{report.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getPriorityBadge(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted By</label>
                    <p className="text-base text-gray-900 font-medium">{report.submittedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-base text-gray-900">{report.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-base text-gray-900">{report.submittedDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Attachments</label>
                    <p className="text-base text-gray-900">
                      {report.attachments && report.attachments.length > 0 ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {report.attachments.length} file(s)
                        </span>
                      ) : (
                        'None'
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  {report.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleReportAction(report.id, 'Approved')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReportAction(report.id, 'Rejected')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </>
                  )}
                  {report.status !== 'Disabled' && (
                    <button
                      onClick={() => handleReportAction(report.id, 'Disabled')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      Disable
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // TODO: Implement view details functionality
                      console.log('View report details:', report.id);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;