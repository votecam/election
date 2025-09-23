import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import jsPDF from 'jspdf';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch users from API

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching users from API...'); // Debug log
        
        const response = await apiService.users.getAllCitizens(
          pagination.page,
          pagination.limit
        );
        
        console.log('API Response:', response); // Debug log
        
        if (response?.data?.users) {
          setUsers(response.data.users);
          setPagination(response.data.pagination || {
            total: response.data.users.length,
            page: pagination.page,
            limit: pagination.limit,
            pages: Math.ceil((response.data.pagination?.total || response.data.users.length) / pagination.limit)
          });
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        
        // Handle specific authentication errors
        if (error.message?.includes('Authentication required') || 
            error.message?.includes('Please log in again') ||
            error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => window.location.href = '/login', 3000);
        } else if (error.message?.includes('Admin privileges required') ||
                   error.response?.status === 403) {
          setError('You do not have permission to view user data. Admin privileges required.');
        } else {
          setError(error.message || 'Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.page]);

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'joinedDate' || sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Helper function to wrap text
  const wrapText = (text, maxWidth, doc) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  // Export users to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF('landscape'); // Landscape orientation
      
      // Add VOTECAM logo
      const logoUrl = '/images/logo(3).png';
      doc.addImage(logoUrl, 'PNG', 20, 10, 40, 20);
      
      // Add subtitle (moved to the right of logo)
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0); // Black color
      doc.text('Users Report', 70, 25);
      
      // Add date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 70, 35);
      
      // Add summary
      doc.setFontSize(10);
      doc.text(`Total Users: ${users.length}`, 70, 45);
      doc.text(`Active Users: ${users.filter(user => user.isActive).length}`, 70, 50);
      doc.text(`Inactive Users: ${users.filter(user => !user.isActive).length}`, 70, 55);
      
      // Add table headers
      let yPosition = 70;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      // Draw header background (wider for landscape)
      doc.setFillColor(34, 197, 94); // Emerald color
      doc.rect(20, yPosition - 5, 250, 8, 'F');
      
      // Header text with better spacing for landscape
      doc.setTextColor(255, 255, 255);
      doc.text('#', 22, yPosition);
      doc.text('Name', 35, yPosition);
      doc.text('Email', 80, yPosition);
      doc.text('Phone', 140, yPosition);
      doc.text('Status', 180, yPosition);
      doc.text('Verified', 210, yPosition);
      doc.text('Join Date', 240, yPosition);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      
      // Add user data
      doc.setFont('helvetica', 'normal');
      users.forEach((user, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); // Light gray
          doc.rect(20, yPosition - 5, 250, 8, 'F');
        }
        
        // Row number
        doc.text((index + 1).toString(), 22, yPosition);
        
        // User name (more space in landscape)
        const userName = user.name || 'N/A';
        const nameLines = wrapText(userName, 40, doc); // More space for names
        
        if (nameLines.length > 1) {
          doc.text(nameLines[0].substring(0, 35) + '...', 35, yPosition);
        } else {
          doc.text(userName, 35, yPosition);
        }
        
        // Email (much more space in landscape)
        const userEmail = user.email || 'N/A';
        const emailLines = wrapText(userEmail, 55, doc); // Much more space for emails
        
        if (emailLines.length > 1) {
          doc.text(emailLines[0].substring(0, 50) + '...', 80, yPosition);
        } else {
          doc.text(userEmail, 80, yPosition);
        }
        
        // Phone
        doc.text(user.phone || 'N/A', 140, yPosition);
        
        // Status
        doc.text(user.isActive ? 'Active' : 'Inactive', 180, yPosition);
        
        // Verified
        doc.text(user.isVerified ? 'Yes' : 'No', 210, yPosition);
        
        // Join Date
        doc.text(formatDate(user.createdAt), 240, yPosition);
        
        yPosition += 10;
        
        // Check if we need a new page (adjusted for landscape)
        if (yPosition > 180) {
          doc.addPage('landscape');
          yPosition = 20;
        }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Add small logo in footer
        doc.addImage(logoUrl, 'PNG', 20, doc.internal.pageSize.height - 15, 15, 8);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${i} of ${pageCount}`, 40, doc.internal.pageSize.height - 10);
        doc.text('Generated by VOTECAM Election Management System', doc.internal.pageSize.width - 120, doc.internal.pageSize.height - 10);
      }
      
      // Save the PDF
      doc.save(`votecam-users-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-1 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-4 md:mt-0"></div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="h-10 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="px-3 py-5">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-5">
                      <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <header>
              <h1 className="text-4xl font-bold text-gray-800">Users</h1>
              <div className="w-24 h-0.5 bg-emerald-600 rounded-sm mt-1"></div>
              <p className="text-base text-gray-600 mt-2">Manage and view all system users</p>
            </header>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Users
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-3xl">
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
                  className="block w-full pl-12 pr-4 py-4 text-lg font-medium text-gray-700 bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
                  placeholder="Search users by name, email, or phone number..."
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-5 py-3 text-base font-medium transition-colors ${
                  showFilters 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {searchTerm && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2 text-base text-gray-600">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-semibold text-emerald-600">{filteredAndSortedUsers.length}</span>
                <span>of</span>
                <span className="font-semibold text-gray-800">{users.length}</span>
                <span>users</span>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-300 px-4 py-3 pr-10 text-base font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                  <option value="createdAt">Join Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                </div>
                
              <div className="relative">
                  <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-300 px-4 py-3 pr-10 text-base font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                </div>
                
              <div className="relative">
                  <select
                  className="w-full appearance-none bg-white border-2 border-gray-300 px-4 py-3 pr-10 text-base font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              </div>
            </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-3 py-5 text-left text-base font-semibold text-gray-700 uppercase w-16">
                    #
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-5 text-left text-base font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>User</span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-5 text-left text-base font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Email</span>
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-5 text-left text-base font-semibold text-gray-700 uppercase">
                    Phone
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-5 text-left text-base font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Joined Date</span>
                      <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-5 text-center text-base font-semibold text-gray-700 uppercase w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.length > 0 ? (
                  filteredAndSortedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 py-5 whitespace-nowrap text-lg font-semibold text-gray-800 text-center">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-lg text-gray-700 font-medium">{user.email}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-700 font-medium">
                        {user.phone}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-700 font-medium">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(user.isActive ? 'active' : 'inactive')}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">No Users Found</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">
                          {searchTerm ? 'No users match your search criteria.' : 'No users have been registered yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && users.length > 0 && pagination.pages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                      pagination.page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                            pagination.page === page
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                      pagination.page === pagination.pages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Users;