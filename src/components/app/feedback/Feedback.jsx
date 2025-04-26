import React, { useState } from 'react';

const Feedback = () => {
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
      rating: 3
    },
    {
      id: 2,
      type: 'suggestion',
      user: 'Maria Garcia',
      content: 'It would be helpful to have a map view for polling centres.',
      date: '2023-11-18',
      rating: 4
    },
    {
      id: 3,
      type: 'compliment',
      user: 'David Johnson',
      content: 'The new dashboard design looks great and is much easier to use!',
      date: '2023-11-15',
      rating: 5
    },
    {
      id: 4,
      type: 'issue',
      user: 'Sarah Wilson',
      content: 'When exporting data to CSV, some special characters appear corrupted.',
      date: '2023-11-12',
      rating: 2
    },
    {
      id: 5,
      type: 'suggestion',
      user: 'Michael Brown',
      content: 'Please add a dark mode option for the dashboard.',
      date: '2023-11-10',
      rating: 4
    },
    {
      id: 6,
      type: 'compliment',
      user: 'Jennifer Lee',
      content: 'The mobile responsiveness is excellent, works perfectly on my phone!',
      date: '2023-11-07',
      rating: 5
    },
    {
      id: 7,
      type: 'issue',
      user: 'Robert Taylor',
      content: 'I get an error when trying to upload images larger than 2MB.',
      date: '2023-11-05',
      rating: 2
    }
  ]);

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
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          feedback.content.toLowerCase().includes(searchLower) ||
          feedback.user.toLowerCase().includes(searchLower)
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
    <div className="w-full">
      {/* Header with emerald underline */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
        <div className="w-32 h-0.5 bg-emerald-600 rounded-sm mt-2"></div>
        <p className="text-gray-600 text-lg mt-1">View user feedback about the application</p>
      </header>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-gray-800">User Feedback List</h2>
          
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
                className="pl-10 py-2 pr-3 border border-gray-300 rounded-none text-base focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300"
                style={{ 
                  "--tw-ring-color": "#00694B",
                  "--tw-border-opacity": 1,
                  "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                }}
              />
            </div>
            
            {/* Sort options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="py-2 px-3 border border-gray-300 bg-white rounded-none text-base focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300"
              style={{ 
                "--tw-ring-color": "#00694B",
                "--tw-border-opacity": 1,
                "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
              }}
            >
              <option value="date">Newest First</option>
              <option value="dateAsc">Oldest First</option>
              <option value="rating">Highest Rating</option>
              <option value="ratingAsc">Lowest Rating</option>
            </select>
          </div>
        </div>
        
        {filteredFeedback.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-lg">{feedback.user}</span>
                        <div className="flex items-center mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <span className="text-base text-gray-500 whitespace-nowrap">{feedback.date}</span>
                    </div>
                    
                    <p className="text-gray-700 mt-3 text-base">{feedback.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg 
              className="mx-auto h-14 w-14 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
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
  );
};

export default Feedback; 