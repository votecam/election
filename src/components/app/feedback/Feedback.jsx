import React, { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import FeedbackExportModal from './FeedbackExportModal';

// Skeleton feedback item component
const SkeletonFeedbackItem = () => {
  return (
    <div className="border-l-2 border-gray-200 bg-white">
      <div className="px-5 py-4">
        {/* Header row with name, date and rating */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start">
            {/* Name with avatar skeleton */}
            <div className="flex items-center">
              <div className="w-9 h-9 flex-shrink-0 bg-gray-200 animate-pulse mr-3 rounded"></div>
              <div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mb-2"></div>
                <div className="flex items-center mt-1 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                  <div className="w-8 h-3 bg-gray-200 animate-pulse rounded ml-2"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        {/* Feedback content skeleton */}
        <div className="mt-3 pl-12">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton pagination component
const SkeletonPagination = () => {
  return (
    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-48"></div>
        </div>
        <div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [sortOption, setSortOption] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await apiService.feedback.getAllFeedback(pagination.page, pagination.limit);
        
        if (response.status === 'success' && response.data) {
          setFeedbacks(response.data.feedbacks);
          setPagination(response.data.pagination);
        } else {
          throw new Error('Failed to fetch feedback');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Unable to load feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [pagination.page, pagination.limit]);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-500' : 'text-gray-200'}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return (
      <div className="flex space-x-0.5">{stars}</div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Filter and sort feedback
  const filteredFeedback = feedbacks
    .filter(feedback => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          feedback.body.toLowerCase().includes(searchLower) ||
          feedback.name.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortOption) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt); // Recent first
        case 'dateAsc':
          return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        case 'rating':
          return b.rating - a.rating; // Highest rating first
        case 'ratingAsc':
          return a.rating - b.rating; // Lowest rating first
        default:
          return 0;
      }
    });

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header with emerald underline */}
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">User Feedback</h1>
            <div className="w-40 h-0.5 bg-emerald-600 mt-2 mb-3"></div>
            <p className="text-base text-gray-600">What our users are saying about the platform</p>
          </div>
          
          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            disabled={feedbacks.length === 0}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Feedback
          </button>
        </div>
      </header>
      
      <div className="bg-white border-t border-b border-gray-200 md:border md:shadow-sm">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Feedback</h2>
          
          {/* Search and filter controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 pr-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            {/* Sort options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="py-2 px-3 border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="date">Newest First</option>
              <option value="dateAsc">Oldest First</option>
              <option value="rating">Highest Rating</option>
              <option value="ratingAsc">Lowest Rating</option>
            </select>
          </div>
        </div>
        
        {/* Loading state with skeleton UI */}
        {loading && (
          <>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <SkeletonFeedbackItem key={index} />
              ))}
            </div>
            <SkeletonPagination />
          </>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="p-8 text-center">
            <svg 
              className="mx-auto h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="mt-3 text-red-500 font-medium">{error}</p>
            <p className="text-sm text-gray-500 mt-1">Please try again later</p>
          </div>
        )}
        
        {/* Feedback list - Modern design with two columns and emerald outline */}
        {!loading && !error && filteredFeedback.length > 0 ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeedback.map((feedback) => (
              <div 
                key={feedback.id} 
                className="border-l-2 border-emerald-600 bg-white hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="px-5 py-4">
                  {/* Header row with name, date and rating */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start">
                      {/* Name with first letter avatar */}
                      <div className="flex items-center">
                        <div className="w-9 h-9 flex-shrink-0 bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-center mr-3">
                          {feedback.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{feedback.name}</h3>
                          <div className="flex items-center mt-1 space-x-2">
                          {renderStars(feedback.rating)}
                            <span className="text-xs text-gray-500 font-medium">{feedback.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{formatDate(feedback.createdAt)}</span>
                  </div>
                  
                  {/* Feedback content */}
                  <div className="mt-3 pl-12">
                    <p className="text-gray-700">{feedback.body}</p>
                    
                    {/* Admin response - if any */}
                    {feedback.reply && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-start">
                          <div className="w-7 h-7 flex-shrink-0 bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center mr-2">
                            A
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-blue-700">Admin Response</h4>
                            <p className="text-sm text-gray-600 mt-1">{feedback.reply}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              ))}
            </div>
        ) : !loading && !error ? (
          <div className="p-8 text-center">
            <svg 
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <p className="mt-3 text-gray-500 font-medium">No feedback matching your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : null}
        
        {/* Pagination */}
        {!loading && !error && pagination.pages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  pagination.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                  pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(pagination.pages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        pagination.page === page + 1
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === pagination.pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && filteredFeedback.length > 0 && pagination.pages <= 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
            Showing {filteredFeedback.length} of {pagination.total} feedback items
          </div>
        )}
      </div>

      {/* Export Modal */}
      <FeedbackExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        feedbacks={filteredFeedback}
        pagination={pagination}
      />
    </div>
  );
};

export default Feedback; 