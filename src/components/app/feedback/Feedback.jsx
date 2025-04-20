import React, { useState } from 'react';

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Sample previous feedback - in a real app this would come from an API
  const [previousFeedback] = useState([
    {
      id: 1,
      type: 'issue',
      content: 'The polling centre search is very slow when there are many results.',
      date: '2023-11-20',
      status: 'under review'
    },
    {
      id: 2,
      type: 'suggestion',
      content: 'It would be helpful to have a map view for polling centres.',
      date: '2023-11-18',
      status: 'implemented'
    },
    {
      id: 3,
      type: 'compliment',
      content: 'The new dashboard design looks great and is much easier to use!',
      date: '2023-11-15',
      status: 'acknowledged'
    }
  ]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFeedbackText('');
      
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
      case 'implemented':
        return 'bg-emerald-100 text-emerald-800';
      case 'acknowledged':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Feedback</h1>
        <p className="text-gray-600 mt-1">Share your thoughts, suggestions, or report issues</p>
      </header>
      
      {/* Feedback Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Feedback</h2>
        
        {submitSuccess && (
          <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Thank you for your feedback! We appreciate your input.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="feedback-type" className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Type
            </label>
            <select
              id="feedback-type"
              name="feedback-type"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="suggestion">Suggestion</option>
              <option value="issue">Issue Report</option>
              <option value="compliment">Compliment</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-700 mb-1">
              Your Feedback
            </label>
            <textarea
              id="feedback-text"
              name="feedback-text"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              placeholder="Please share your thoughts, suggestions, or report an issue..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              disabled={isSubmitting || !feedbackText.trim()}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Previous Feedback */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Your Previous Feedback</h2>
        </div>
        
        {previousFeedback.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {previousFeedback.map((feedback) => (
              <div key={feedback.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(feedback.type)}`}>
                        {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 ml-3">{feedback.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{feedback.content}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyle(feedback.status)}`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1).replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            <p>You haven't submitted any feedback yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback; 