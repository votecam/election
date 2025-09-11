import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import PageHeader from './components/PageHeader';
import StatsCards from './components/StatsCards';
import SearchAndFilters from './components/SearchAndFilters';
import ReportsTable from './components/ReportsTable';
import SkeletonLoader from './components/SkeletonLoader';

const AllReports = () => {
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
        },
        {
          id: 5,
          title: 'Equipment Malfunction',
          description: 'Voting machine not working properly at station #456.',
          type: 'Technical Issue',
          submittedBy: 'Robert Brown',
          submittedDate: '2024-01-11',
          status: 'Pending',
          priority: 'High',
          attachments: ['error_screenshot.png']
        },
        {
          id: 6,
          title: 'Staff Shortage',
          description: 'Insufficient staff members at polling location.',
          type: 'Staffing Issue',
          submittedBy: 'Lisa Garcia',
          submittedDate: '2024-01-10',
          status: 'Approved',
          priority: 'Medium',
          attachments: []
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

  // Calculate stats
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'Pending').length,
    approved: reports.filter(r => r.status === 'Approved').length,
    rejected: reports.filter(r => r.status === 'Rejected').length,
    disabled: reports.filter(r => r.status === 'Disabled').length
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <PageHeader />
      <StatsCards stats={stats} loading={loading} />
      <SearchAndFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredReports={filteredReports}
        totalReports={reports.length}
      />
      <ReportsTable filteredReports={filteredReports} />
    </div>
  );
};

export default AllReports;