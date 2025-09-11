import React, { useState, useEffect } from 'react';

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
  const [sortField, setSortField] = useState('joinedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration - replace with actual API call
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      joinedDate: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      joinedDate: '2024-01-16T14:20:00Z',
      status: 'active'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567892',
      joinedDate: '2024-01-17T09:15:00Z',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '+1234567893',
      joinedDate: '2024-01-18T16:45:00Z',
      status: 'active'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      phone: '+1234567894',
      joinedDate: '2024-01-19T11:30:00Z',
      status: 'active'
    },
    {
      id: 6,
      name: 'Diana Davis',
      email: 'diana.davis@example.com',
      phone: '+1234567895',
      joinedDate: '2024-01-20T13:20:00Z',
      status: 'active'
    },
    {
      id: 7,
      name: 'Eve Miller',
      email: 'eve.miller@example.com',
      phone: '+1234567896',
      joinedDate: '2024-01-21T08:10:00Z',
      status: 'inactive'
    },
    {
      id: 8,
      name: 'Frank Garcia',
      email: 'frank.garcia@example.com',
      phone: '+1234567897',
      joinedDate: '2024-01-22T15:35:00Z',
      status: 'active'
    },
    {
      id: 9,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      phone: '+1234567898',
      joinedDate: '2024-01-23T12:00:00Z',
      status: 'active'
    },
    {
      id: 10,
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      phone: '+1234567899',
      joinedDate: '2024-01-24T09:45:00Z',
      status: 'active'
    },
    {
      id: 11,
      name: 'Ivy Chen',
      email: 'ivy.chen@example.com',
      phone: '+1234567800',
      joinedDate: '2024-01-25T14:30:00Z',
      status: 'active'
    },
    {
      id: 12,
      name: 'Jack Anderson',
      email: 'jack.anderson@example.com',
      phone: '+1234567801',
      joinedDate: '2024-01-26T11:15:00Z',
      status: 'inactive'
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await apiService.users.getAll(pagination.page, pagination.limit);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers(mockUsers);
        setPagination({
          total: mockUsers.length,
          page: 1,
          limit: 10,
          pages: Math.ceil(mockUsers.length / 10)
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
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
      user.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'joinedDate') {
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
                onClick={() => {
                  // TODO: Implement export functionality
                  console.log('Export users data');
                }}
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
                className={`inline-flex items-center px-5 py-3 border rounded-lg text-base font-medium transition-colors ${
                  showFilters 
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  >
                    <option value="joinedDate">Join Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortField('joinedDate');
                    setSortDirection('desc');
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
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
                    onClick={() => handleSort('joinedDate')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Joined Date</span>
                      <SortIcon field="joinedDate" />
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
                        {formatDate(user.joinedDate)}
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
          {!loading && !error && filteredAndSortedUsers.length > 0 && pagination.pages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, filteredAndSortedUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredAndSortedUsers.length}</span> results
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
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
                          onClick={() => setPagination(prev => ({ ...prev, page }))}
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
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
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