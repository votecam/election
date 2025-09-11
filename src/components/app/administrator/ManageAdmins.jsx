import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    // Filter admins based on search term
    const filtered = admins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [admins, searchTerm]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      // const response = await apiService.users.getAllAdministrators();
      
      // Mock data for now - replace with actual API call
      const mockAdmins = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Super Admin',
          status: 'Active',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'Admin',
          status: 'Active',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'Admin',
          status: 'Inactive',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-15'
        }
      ];
      
      setAdmins(mockAdmins);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to fetch administrators'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete admin
  const confirmDeleteAdmin = async () => {
    try {
      // This would be replaced with actual API call
      // await apiService.users.deleteAdministrator(adminToDelete.id);
      
      setAdmins(admins.filter(admin => admin.id !== adminToDelete.id));
      
      // Close the delete confirmation
      setShowDeleteConfirmation(false);
      setAdminToDelete(null);
      
      setAlert({
        show: true,
        type: 'success',
        message: `${adminToDelete.name} has been deleted successfully`
      });
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to delete administrator'
      });
    }
  };
  
  // Cancel delete
  const cancelDeleteAdmin = () => {
    setShowDeleteConfirmation(false);
    setAdminToDelete(null);
  };

  // Handle view admin details
  const handleViewAdmin = (admin) => {
    // This would open a view modal or navigate to a details page
    console.log('View admin:', admin);
    // For now, we'll show an alert with admin details
    alert(`Administrator Details:\n\nName: ${admin.name}\nEmail: ${admin.email}\nRole: ${admin.role}\nStatus: ${admin.status}\nCreated: ${formatDate(admin.createdAt)}\nLast Login: ${formatDate(admin.lastLogin)}`);
  };

  // Handle edit admin
  const handleEditAdmin = (admin) => {
    // This would open an edit modal or navigate to an edit page
    console.log('Edit admin:', admin);
    // For now, we'll show an alert
    alert(`Edit functionality for ${admin.name} would be implemented here.`);
  };

  const handleToggleStatus = async (adminId, currentStatus, adminName) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      // This would be replaced with actual API call
      // await apiService.users.updateAdministratorStatus(adminId, newStatus);
      
      setAdmins(admins.map(admin => 
        admin.id === adminId ? { ...admin, status: newStatus } : admin
      ));
      
      setAlert({
        show: true,
        type: 'success',
        message: `${adminName} status updated to ${newStatus}`
      });
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Failed to update administrator status'
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Administrators</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-2">View and manage all administrator accounts</p>
      </header>

      {/* Alert Message */}
      {alert.show && (
        <div className={`mb-6 p-4 ${
          alert.type === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-500' : 
          'bg-red-50 border-l-4 border-red-500'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {alert.type === 'success' ? (
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-800">
                {alert.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Stats */}
      <div className="bg-white border border-gray-100 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">All Administrators</h2>
              <p className="text-gray-600 mt-1">Total: {filteredAdmins.length} administrator(s)</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Administrators Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-2 text-gray-600">Loading administrators...</span>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No administrators found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new administrator.'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Administrator
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin, index) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-gray-900">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-base font-medium text-gray-900">{admin.name}</div>
                        <div className="text-base text-gray-500">{admin.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        admin.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {formatDate(admin.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewAdmin(admin)}
                          className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                          title="Edit Administrator"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(admin.id, admin.status, admin.name)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            admin.status === 'Active'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                          title={admin.status === 'Active' ? 'Deactivate Administrator' : 'Activate Administrator'}
                        >
                          {admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                          title="Delete Administrator"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Administrator</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <strong>{adminToDelete?.name}</strong>? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmDeleteAdmin}
              >
                Delete
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelDeleteAdmin}
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

export default ManageAdmins;
