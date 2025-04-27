import React, { useEffect, useState } from 'react';
import apiService from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';

// Skeleton candidate item component
const SkeletonCandidateItem = () => {
  return (
    <li className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-50">
      <div className="flex items-center animate-pulse">
        <div className="flex-shrink-0 relative">
          {/* Skeleton avatar */}
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200"></div>
          
          {/* Skeleton party badge */}
          <div className="absolute bottom-0 right-0 z-20">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 border-2 border-white"></div>
          </div>
        </div>
        
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Skeleton name */}
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40"></div>
          </div>
          <div className="flex flex-col mt-2 sm:mt-1.5">
            {/* Skeleton party name */}
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-40 sm:w-48 mb-1.5"></div>
            {/* Skeleton position */}
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
          </div>
        </div>
      </div>
    </li>
  );
};

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Fetch candidates and parties data when component mounts
  useEffect(() => {
    const fetchCandidatesData = async () => {
      try {
        setLoading(true);
        
        // Fetch parties first to build a lookup table
        const partiesResponse = await apiService.parties.getAll();
        
        // Create a map of party IDs to party data for quick lookup
        const partiesMap = {};
        if (partiesResponse && partiesResponse.status === 'success' && Array.isArray(partiesResponse.data)) {
          partiesResponse.data.forEach(party => {
            partiesMap[party.id] = {
              id: party.id,
              name: party.name,
              logo: party.logo,
              color: party.color || getDefaultPartyColor(party.name)
            };
          });
          setParties(partiesMap);
        }
        
        // Fetch candidates - use a larger limit and then slice to ensure we get exactly 4
        const candidatesResponse = await apiService.candidates.getAll(1, 10);
        
        if (candidatesResponse && candidatesResponse.candidates) {
          // Limit to exactly 4 candidates
          setCandidates(candidatesResponse.candidates.slice(0, 4));
        } else {
          throw new Error('Failed to fetch candidate data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Could not load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidatesData();
  }, []);
  
  // Helper function to get a default color based on party name
  const getDefaultPartyColor = (partyName) => {
    if (!partyName) return '#808080';
    
    const colorMap = {
      'CPDM': '#d32f2f', // red
      'SDF': '#1976d2',  // blue
      'UNDP': '#388e3c', // green
      'MRC': '#7b1fa2',  // purple
      'UPC': '#ef6c00'   // orange
    };
    
    // Try exact match first
    if (colorMap[partyName]) return colorMap[partyName];
    
    // Otherwise use the first letter to determine a color
    const firstChar = partyName.charAt(0).toUpperCase();
    const charCode = firstChar.charCodeAt(0);
    const colors = Object.values(colorMap);
    return colors[charCode % colors.length];
  };
  
  // Party badge component based on party ID
  const getPartyBadge = (partyId) => {
    const party = parties[partyId] || { name: partyId };
    const partyColor = party.color || getDefaultPartyColor(party.name);
    const bgColorClass = getBgColorClass(party.name);
    
        return (
      <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium ${bgColorClass}`}>
        {party.logo ? (
          <img 
            src={party.logo} 
            alt={party.name}
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              // Replace with SVG icon on error
              e.target.style.display = 'none';
              e.target.parentNode.insertBefore(
                createSVGElement(),
                e.target.nextSibling
              );
            }}
          />
        ) : (
          // Default SVG if no logo is available
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v9.5C2 19.58 6.5 22 12 22s10-2.42 10-10.5V7L12 2z"/>
            </svg>
        )}
        <span className="truncate max-w-[80px] sm:max-w-none">{party.name}</span>
          </span>
        );
  };
  
  // Helper function to create an SVG element as fallback
  const createSVGElement = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 2L2 7v9.5C2 19.58 6.5 22 12 22s10-2.42 10-10.5V7L12 2z");
    svg.appendChild(path);
    
    return svg;
  };
  
  // Helper to get appropriate Tailwind color classes based on party name
  const getBgColorClass = (partyName) => {
    if (!partyName) return 'bg-gray-50 text-gray-600';
    
    const classMap = {
      'CPDM': 'bg-red-50 text-red-600',
      'SDF': 'bg-blue-50 text-blue-600',
      'UNDP': 'bg-green-50 text-green-600',
      'MRC': 'bg-purple-50 text-purple-600',
      'UPC': 'bg-orange-50 text-orange-600'
    };
    
    for (const key in classMap) {
      if (partyName.includes(key)) {
        return classMap[key];
      }
    }
    
    // Fallback based on first letter
    const firstChar = partyName.charAt(0).toUpperCase();
    const charCode = firstChar.charCodeAt(0) % 5;
    
    const fallbackClasses = [
      'bg-red-50 text-red-600',
      'bg-blue-50 text-blue-600',
      'bg-green-50 text-green-600',
      'bg-purple-50 text-purple-600',
      'bg-orange-50 text-orange-600'
    ];
    
    return fallbackClasses[charCode];
  };
  
  // Helper to get initials from a name
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Format position for display
  const formatPosition = (position) => {
    if (!position) return '';
    
    // Convert kebab-case or snake_case to Title Case
    const formatted = position
      .replace(/[-_]/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    
    return formatted;
  };
  
  // Get full party name
  const getPartyFullName = (partyId) => {
    const party = parties[partyId] || { name: partyId };
    
    const partyNameMap = {
      'CPDM': 'Cameroon People\'s Democratic Movement',
      'SDF': 'Social Democratic Front',
      'UNDP': 'National Union for Democracy and Progress',
      'MRC': 'Cameroon Renaissance Movement',
      'UPC': 'Union of the Peoples of Cameroon'
    };
    
    // Try to match the party name against our map
    for (const key in partyNameMap) {
      if (party.name && party.name.includes(key)) {
        return partyNameMap[key];
      }
    }
    
    // If no match, return the party name we have
    return party.name;
  };

  // Add a function to handle navigation
  const handleViewAllCandidates = (e) => {
    e.preventDefault();
    navigate('/app/candidates/manage');
  };

  if (loading) {
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
            <div className="h-7 sm:h-8 bg-gray-200 rounded w-32 sm:w-40 animate-pulse"></div>
            <div className="mt-1 h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-56 animate-pulse"></div>
          </div>
          
          <div className="flex-grow">
            <ul>
              {[...Array(4)].map((_, index) => (
                <SkeletonCandidateItem key={index} />
              ))}
            </ul>
          </div>
          
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-50 mt-auto">
            <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 h-full flex items-center justify-center p-4 sm:p-8">
        <div className="text-red-500 text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
          >
            Try Again
          </button>
        </div>
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
          {candidates.length > 0 ? (
          <ul>
              {candidates.map((candidate, index) => (
              <li 
                key={candidate.id} 
                  className={`px-4 sm:px-6 py-3 sm:py-4 ${index !== candidates.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 relative">
                      {/* Candidate image or fallback to initials */}
                      {candidate.candidate_image ? (
                      <img 
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gray-100" 
                          src={candidate.candidate_image} 
                        alt={candidate.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0D9488&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-medium text-base sm:text-lg">
                          {getInitials(candidate.name)}
                      </div>
                    )}
                    
                    {/* Party Badge positioned at bottom right of the profile image */}
                    <div className="absolute bottom-0 right-0 z-20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white overflow-hidden bg-white shadow-sm">
                          {candidate.party_id && parties[candidate.party_id]?.logo ? (
                            // Use actual party logo if available
                            <img 
                              src={parties[candidate.party_id].logo} 
                              alt={parties[candidate.party_id]?.name || ''}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                // Fallback to initials on error
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `<span class="${getBgColorClass(parties[candidate.party_id]?.name)} w-full h-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
                                  ${getInitials(parties[candidate.party_id]?.name || candidate.party_id)}
                                </span>`;
                              }}
                            />
                          ) : (
                            // Fallback to party initials
                            <span 
                              className={`${getBgColorClass(parties[candidate.party_id]?.name)} w-full h-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold`}
                            >
                              {getInitials(parties[candidate.party_id]?.name || candidate.party_id)}
                            </span>
                          )}
                        </div>
                    </div>
                  </div>
                  
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base sm:text-lg font-medium text-gray-800 truncate">{candidate.name}</p>
                    </div>
                    <div className="flex flex-col mt-0.5 sm:mt-0">
                      <p className="text-sm sm:text-base text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                          {getPartyFullName(candidate.party_id)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">{formatPosition(candidate.position)}</p>
                      </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <svg className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">No candidates found</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-50 mt-auto">
          <button 
            onClick={handleViewAllCandidates}
            className="w-full text-center text-sm sm:text-base font-medium text-emerald-600 hover:text-emerald-700 flex items-center justify-center py-1.5 transition-colors"
          >
            View all candidates
            <svg className="ml-1 sm:ml-1.5 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;