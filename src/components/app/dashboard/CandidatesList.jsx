import React, { useEffect, useState } from 'react';

const CandidatesList = () => {
  const [candidatesWithImages, setCandidatesWithImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sample candidates data - would come from API in production
  const candidatesData = [
    {
      id: 1,
      name: 'Alexander Williams',
      party: 'CPDM',
      position: 'Presidential Candidate'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      party: 'SDF',
      position: 'Vice Presidential Candidate'
    },
    {
      id: 3,
      name: 'Michael Thompson',
      party: 'UNDP',
      position: 'Senate Candidate'
    },
    {
      id: 4,
      name: 'Elizabeth Clark',
      party: 'MRC',
      position: 'Governor Candidate'
    }
  ];

  // Party color and icon mapping
  const getPartyBadge = (party) => {
    switch (party) {
      case 'CPDM':
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-red-50 text-red-600">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v9.5C2 19.58 6.5 22 12 22s10-2.42 10-10.5V7L12 2z"/>
            </svg>
            <span className="truncate max-w-[80px] sm:max-w-none">CPDM</span>
          </span>
        );
      case 'SDF':
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-50 text-blue-600">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,13H5.79L10.1,4.79L11.28,13H13.9L17.9,4.79L19.28,13H22V15H19.72L19,19.24H17.03L16.74,15H7.26L6.97,19.24H5L4.28,15H2V13H3Z" />
            </svg>
            <span className="truncate max-w-[80px] sm:max-w-none">SDF</span>
          </span>
        );
      case 'UNDP':
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-50 text-green-600">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z" />
            </svg>
            <span className="truncate max-w-[80px] sm:max-w-none">UNDP</span>
          </span>
        );
      case 'MRC':
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-purple-50 text-purple-600">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12Z" />
            </svg>
            <span className="truncate max-w-[80px] sm:max-w-none">MRC</span>
          </span>
        );
   
      default:
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-gray-50 text-gray-600">
            <span className="truncate max-w-[80px] sm:max-w-none">{party}</span>
          </span>
        );
    }
  };

  useEffect(() => {
    // Fetch random user images from the API
    fetch('https://randomuser.me/api/?results=5&inc=picture&noinfo')
      .then(response => response.json())
      .then(data => {
        // Combine candidate data with random images
        const updatedCandidates = candidatesData.map((candidate, index) => ({
          ...candidate,
          imageUrl: data.results[index]?.picture?.large || null
        }));
        setCandidatesWithImages(updatedCandidates);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching random user images:', error);
        // Fallback to using candidates without images
        setCandidatesWithImages(candidatesData);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 h-full flex items-center justify-center p-4 sm:p-8">
        <div className="text-gray-500 text-base sm:text-lg">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 h-full relative overflow-hidden">
      {/* Enhanced Elegant Watermark - Hidden on small screens */}
      <div className="absolute -bottom-16 -right-16 pointer-events-none z-0 hidden sm:block">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-50 via-emerald-100 to-transparent opacity-30"></div>
      </div>
      <div className="absolute -top-24 -left-24 pointer-events-none z-0 hidden sm:block">
        <div className="w-72 h-72 rounded-full bg-gradient-to-br from-gray-50 via-gray-100 to-transparent opacity-40"></div>
      </div>
      
      {/* Center subtle pattern - Hidden on small screens */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center hidden sm:flex">
        <div className="w-full h-full max-w-md max-h-md opacity-[0.03]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="candidate-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,10 l 20,0" stroke="#333" strokeWidth="0.5" fill="none" />
                <path d="M 10,0 l 0,20" stroke="#333" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#candidate-grid)" />
          </svg>
        </div>
      </div>
      
      {/* Additional decorative dot pattern - Hidden on small screens */}
      <div className="absolute top-10 right-10 pointer-events-none z-0 hidden sm:block">
        <svg width="80" height="80" viewBox="0 0 80 80" opacity="0.07">
          <pattern id="candidate-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#candidate-dots)" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Candidates</h3>
          <p className="mt-0.5 text-sm sm:text-base text-gray-500">Political party affiliations</p>
        </div>
        
        <div className="flex-grow">
          <ul>
            {candidatesWithImages.slice(0, 4).map((candidate, index) => (
              <li 
                key={candidate.id} 
                className={`px-4 sm:px-6 py-3 sm:py-4 ${index !== 3 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                    {/* Real image from randomuser.me or fallback to initials */}
                    {candidate.imageUrl ? (
                      <img 
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gray-100" 
                        src={candidate.imageUrl} 
                        alt={candidate.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0D9488&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-medium text-base sm:text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base sm:text-lg font-medium text-gray-800 truncate">{candidate.name}</p>
                      <div className="mt-1 sm:mt-0">
                        {getPartyBadge(candidate.party)}
                      </div>
                    </div>
                    <div className="flex flex-col mt-0.5 sm:mt-0">
                      <p className="text-sm sm:text-base text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                        {candidate.party === 'CPDM' ? 'Cameroon People\'s Democratic Movement' : 
                         candidate.party === 'SDF' ? 'Social Democratic Front' : 
                         candidate.party === 'UNDP' ? 'National Union for Democracy and Progress' : 
                         candidate.party === 'MRC' ? 'Cameroon Renaissance Movement' : 
                         candidate.party === 'UPC' ? 'Union of the Peoples of Cameroon' : candidate.party}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">{candidate.position}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-50 mt-auto">
          <a href="/candidates/manage" className="w-full text-center text-sm sm:text-base font-medium text-emerald-600 hover:text-emerald-700 flex items-center justify-center py-1.5 transition-colors">
            View all candidates
            <svg className="ml-1 sm:ml-1.5 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;