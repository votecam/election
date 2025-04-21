import React, { useState } from 'react';

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortOption, setSortOption] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample previous feedback - in a real app this would come from an API
  const [previousFeedback] = useState([
    {
      id: 1,
      type: 'issue',
      user: 'John Smith',
      content: 'The polling centre search is very slow when there are many results.',
      date: '2023-11-20',
      rating: 3,
      status: 'under review'
    },
    {
      id: 2,
      type: 'suggestion',
      user: 'Maria Garcia',
      content: 'It would be helpful to have a map view for polling centres.',
      date: '2023-11-18',
      rating: 4,
      status: 'implemented'
    },
    {
      id: 3,
      type: 'compliment',
      user: 'David Johnson',
      content: 'The new dashboard design looks great and is much easier to use!',
      date: '2023-11-15',
      rating: 5,
      status: 'acknowledged'
    },
    {
      id: 4,
      type: 'issue',
      user: 'Sarah Wilson',
      content: 'When exporting data to CSV, some special characters appear corrupted.',
      date: '2023-11-12',
      rating: 2,
      status: 'in progress'
    },
    {
      id: 5,
      type: 'suggestion',
      user: 'Michael Brown',
      content: 'Please add a dark mode option for the dashboard.',
      date: '2023-11-10',
      rating: 4,
      status: 'planned'
    },
    {
      id: 6,
      type: 'compliment',
      user: 'Jennifer Lee',
      content: 'The mobile responsiveness is excellent, works perfectly on my phone!',
      date: '2023-11-07',
      rating: 5,
      status: 'acknowledged'
    },
    {
      id: 7,
      type: 'issue',
      user: 'Robert Taylor',
      content: 'I get an error when trying to upload images larger than 2MB.',
      date: '2023-11-05',
      rating: 2,
      status: 'fixed'
    }
  ]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim() || !userName.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFeedbackText('');
      setUserName('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Get appropriate badge styles based on feedback type or status
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'issue':
        return 'bg-red-100 text-red-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      case 'compliment':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-purple-100 text-purple-800';
      case 'planned':
        return 'bg-indigo-100 text-indigo-800';
      case 'implemented':
        return 'bg-emerald-100 text-emerald-800';
      case 'fixed':
        return 'bg-emerald-100 text-emerald-800';
      case 'acknowledged':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return (
      <div className="flex">{stars}</div>
    );
  };

  // Filter and sort feedback
  const filteredFeedback = previousFeedback
    .filter(feedback => {
      // Filter by type
      if (filterType !== 'all' && feedback.type !== filterType) {
        return false;
      }
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          feedback.content.toLowerCase().includes(searchLower) ||
          feedback.user.toLowerCase().includes(searchLower) ||
          feedback.status.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortOption) {
        case 'date':
          return new Date(b.date) - new Date(a.date); // Recent first
        case 'dateAsc':
          return new Date(a.date) - new Date(b.date); // Oldest first
        case 'rating':
          return b.rating - a.rating; // Highest rating first
        case 'ratingAsc':
          return a.rating - b.rating; // Lowest rating first
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 w-full max-w-full">
      {/* Header with emerald underline */}
      <header className="mb-8 relative">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
            <div className="h-1 w-24 bg-emerald-500 rounded mt-2"></div>
            <p className="text-gray-600 mt-3">Manage and respond to user feedback about the application</p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">User Feedback List</h2>
              
              {/* Search and filter controls */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 py-2 pr-3 border border-gray-300 rounded-md text-base focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <svg 
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Type filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="py-2 px-3 border border-gray-300 bg-white rounded-md text-base focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="issue">Issues</option>
                  <option value="suggestion">Suggestions</option>
                  <option value="compliment">Compliments</option>
                </select>
                
                {/* Sort options */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-2 px-3 border border-gray-300 bg-white rounded-md text-base focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="date">Newest First</option>
                  <option value="dateAsc">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                  <option value="ratingAsc">Lowest Rating</option>
                </select>
              </div>
            </div>
            
            {filteredFeedback.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-lg">{feedback.user}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(feedback.rating)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getBadgeStyle(feedback.type)}`}>
                              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-base text-gray-500 whitespace-nowrap">{feedback.date}</span>
                          <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getBadgeStyle(feedback.status)}`}>
                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1).replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 text-base">{feedback.content}</p>
                      
                      <div className="flex justify-end space-x-2 mt-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors">
                          Reply
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="mt-4 text-gray-500 text-lg">No feedback matching your filters</p>
                <p className="text-base text-gray-400 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
            
            {filteredFeedback.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-base text-gray-500">
                Showing {filteredFeedback.length} of {previousFeedback.length} feedback items
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Feedback Form in the side panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Add New Feedback</h2>
            </div>
            
            <div className="p-6">
              {submitSuccess && (
                <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-emerald-800">
                        Feedback added successfully
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="user-name" className="block text-base font-medium text-gray-700 mb-1">
                    User Name
                  </label>
                  <input
                    id="user-name"
                    name="user-name"
                    type="text"
                    className="block w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                    placeholder="Enter user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="feedback-type" className="block text-base font-medium text-gray-700 mb-1">
                    Feedback Type
                  </label>
                  <div className="relative">
                    <select
                      id="feedback-type"
                      name="feedback-type"
                      className="block w-full rounded-md border-gray-300 pr-10 focus:border-emerald-500 focus:ring-emerald-500 text-base appearance-none"
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                    >
                      <option value="suggestion">Suggestion</option>
                      <option value="issue">Issue Report</option>
                      <option value="compliment">Compliment</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-emerald-600">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-base font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-full p-1"
                      >
                        <svg 
                          className={`w-7 h-7 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="feedback-text" className="block text-base font-medium text-gray-700 mb-1">
                    Feedback Message
                  </label>
                  <textarea
                    id="feedback-text"
                    name="feedback-text"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                    placeholder="Enter feedback details"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`inline-flex justify-center py-2.5 px-5 rounded-md text-base font-medium text-white transition-all ${
                      isSubmitting || !feedbackText.trim() || !userName.trim()
                        ? 'bg-emerald-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
                    disabled={isSubmitting || !feedbackText.trim() || !userName.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Add Feedback'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <h3 className="text-base font-medium text-gray-700 mb-2">Feedback Status Guide</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                  <span className="text-sm text-gray-600">Under Review - Feedback is being assessed</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-purple-400 mr-2"></span>
                  <span className="text-sm text-gray-600">In Progress - Work has begun on this item</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-indigo-400 mr-2"></span>
                  <span className="text-sm text-gray-600">Planned - Scheduled for future implementation</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 mr-2"></span>
                  <span className="text-sm text-gray-600">Implemented/Fixed - Issue resolved or feature added</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 