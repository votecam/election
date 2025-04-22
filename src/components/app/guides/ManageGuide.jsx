import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageGuide = () => {
  // Sample data - in a real application, this would come from an API
  const [guides, setGuides] = useState([
    { 
      id: 1, 
      title: 'Voter Registration Guidelines', 
      uploadDate: '2023-09-15',
      fileType: 'PDF',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Election Officer Training Manual', 
      uploadDate: '2023-10-02',
      fileType: 'PDF',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Candidate Nomination Process', 
      uploadDate: '2023-08-30',
      fileType: 'DOCX',
      status: 'inactive'
    },
    { 
      id: 4, 
      title: 'Party Registration Requirements', 
      uploadDate: '2023-11-05',
      fileType: 'PDF',
      status: 'active'
    },
    { 
      id: 5, 
      title: 'Electoral Process Overview', 
      uploadDate: '2023-07-22',
      fileType: 'PPTX',
      status: 'active'
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const menuButtonRefs = useRef({});
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close action menu
      if (activeMenu !== null && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRefs.current[activeMenu] && 
          !menuButtonRefs.current[activeMenu].contains(event.target)) {
        setActiveMenu(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);
  
  // Calculate dropdown position
  const getDropdownPosition = (id) => {
    if (!menuButtonRefs.current[id]) return {};
    
    const button = menuButtonRefs.current[id];
    const rect = button.getBoundingClientRect();
    const dropdownWidth = 160;
    const dropdownHeight = 130; // Approximate height of dropdown

    // Check if the dropdown would go beyond the bottom of the viewport
    const viewportHeight = window.innerHeight;
    const belowSpace = viewportHeight - rect.bottom;
    const aboveSpace = rect.top;
    
    // Check if there's more space above or below
    if (belowSpace < dropdownHeight && aboveSpace > belowSpace) {
      // Position above if there's not enough space below
      return {
        position: 'fixed',
        bottom: `${viewportHeight - rect.top + window.scrollY + 5}px`,
        left: `${rect.left + window.scrollX - 100}px`,
        width: `${dropdownWidth}px`
      };
    } else {
      // For items near the right edge, place dropdown to the left
      const viewportWidth = window.innerWidth;
      const rightSpace = viewportWidth - rect.right;
      
      if (rightSpace < dropdownWidth + 10) {
        return {
          position: 'fixed',
          top: `${rect.top + window.scrollY}px`,
          right: `${viewportWidth - rect.left + 10}px`,
          width: `${dropdownWidth}px`
        };
      }
      
      // Default: position to the right
      return {
        position: 'fixed',
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.right + window.scrollX + 5}px`,
        width: `${dropdownWidth}px`
      };
    }
  };
  
  // Handle search
  const filteredGuides = guides.filter(guide => {
    return guide.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle guide deletion
  const handleDeleteGuide = (id) => {
    setGuides(guides.filter(guide => guide.id !== id));
    setActiveMenu(null);
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'PDF':
        return (
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'DOCX':
        return (
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'PPTX':
        return (
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'XLSX':
        return (
          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-800">Manage Guides</h1>
          <div className="w-24 h-0.5 bg-emerald-600 rounded-sm mt-1"></div>
          <p className="text-sm text-gray-600 mt-2">View and manage guide documents</p>
        </header>
        
        <div className="mt-4 md:mt-0">
          <Link
            to="/app/guides/upload"
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-none shadow-sm text-white focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-300"
            style={{ 
              background: "linear-gradient(to right, #00694B, #005941)",
              "--tw-ring-color": "#00694B" 
            }}
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z"></path>
            </svg>
            Upload New Guide
          </Link>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {/* Vertical separator line */}
          <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
          <input
            type="text"
            className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-base font-medium bg-white"
            style={{ 
              "--tw-ring-color": "#00694B",
              "--tw-border-opacity": 1,
              "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
            }}
            placeholder="Search guides by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Guides Table */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-700 uppercase w-16">
                  #
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-medium text-gray-700 uppercase">
                  Guide Title
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-sm font-medium text-gray-700 uppercase">
                  Upload Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-medium text-gray-700 uppercase w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuides.length > 0 ? (
                filteredGuides.map((guide, index) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-md">
                          {getFileIcon(guide.fileType)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {guide.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {guide.uploadDate}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center relative">
                      <button
                        ref={el => menuButtonRefs.current[guide.id] = el}
                        onClick={() => setActiveMenu(activeMenu === guide.id ? null : guide.id)}
                        className="text-gray-500 hover:text-emerald-600 focus:outline-none"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {activeMenu === guide.id && (
                        <div
                          ref={menuRef}
                          className="fixed bg-white border border-gray-200 rounded-md shadow-md z-50"
                          style={getDropdownPosition(guide.id)}
                        >
                          <div className="py-1">
                            <button
                              className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                console.log('View guide', guide.id);
                                setActiveMenu(null);
                              }}
                            >
                              <svg className="mr-2 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </button>
                            <button
                              className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                console.log('Edit guide', guide.id);
                                setActiveMenu(null);
                              }}
                            >
                              <svg className="mr-2 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => handleDeleteGuide(guide.id)}
                            >
                              <svg className="mr-2 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No guides found matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageGuide; 