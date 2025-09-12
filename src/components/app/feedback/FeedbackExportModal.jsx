import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import apiService from '../../../services/apiService';

const FeedbackExportModal = ({ isOpen, onClose, feedbacks, pagination }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const pdfRef = useRef(null);

  // Control visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Generate preview data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, feedbacks:', feedbacks.length, 'pagination:', pagination);
      if (feedbacks.length > 0) {
        generatePreviewData();
      } else {
        // If no feedbacks, still create basic preview data
        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        setPreviewData({
          date: currentDate,
          stats: { total: 0, averageRating: 0, ratingDistribution: {5:0,4:0,3:0,2:0,1:0} },
          feedbacks: [],
          previewFeedbacks: []
        });
      }
    }
  }, [isOpen, feedbacks, pagination]);

  const generatePreviewData = async () => {
    console.log('Generating preview data...');
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    // Fetch ALL feedback data for the PDF
    let allFeedbacks = [...feedbacks];
    console.log('Initial feedbacks:', allFeedbacks.length);
    
    // If we have pagination and there are more pages, fetch all data
    if (pagination.pages > 1) {
      console.log('Fetching all pages:', pagination.pages);
      try {
        const allPagesData = [];
        for (let page = 1; page <= pagination.pages; page++) {
          const response = await apiService.feedback.getAllFeedback(page, pagination.limit);
          if (response.status === 'success' && response.data && response.data.feedbacks) {
            allPagesData.push(...response.data.feedbacks);
          }
        }
        allFeedbacks = allPagesData;
        console.log('All pages data:', allFeedbacks.length);
      } catch (error) {
        console.error('Error fetching all feedback data:', error);
        // Fallback to current feedbacks if API fails
      }
    }

    const stats = {
      total: pagination.total,
      averageRating: allFeedbacks.length > 0 
        ? (allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / allFeedbacks.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: allFeedbacks.filter(fb => fb.rating === 5).length,
        4: allFeedbacks.filter(fb => fb.rating === 4).length,
        3: allFeedbacks.filter(fb => fb.rating === 3).length,
        2: allFeedbacks.filter(fb => fb.rating === 2).length,
        1: allFeedbacks.filter(fb => fb.rating === 1).length,
      }
    };

    const previewData = {
      date: currentDate,
      stats,
      feedbacks: allFeedbacks, // Include ALL feedback data
      previewFeedbacks: allFeedbacks.slice(0, 10) // Show first 10 for preview only
    };
    
    console.log('Setting preview data:', previewData);
    setPreviewData(previewData);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const generatePDF = async () => {
    if (!previewData) {
      console.error('No preview data available');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting PDF generation...');
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 295;
      let yPosition = 20;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      console.log('PDF document created, starting content generation...');

      // Helper function to add text with word wrap
      const addText = (text, fontSize = 12, isBold = false, color = '#000000', x = margin) => {
        try {
          pdf.setFontSize(fontSize);
          pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
          pdf.setTextColor(color);
          
          const lines = pdf.splitTextToSize(text, contentWidth);
          for (let i = 0; i < lines.length; i++) {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(lines[i], x, yPosition);
            yPosition += fontSize * 0.4;
          }
          yPosition += 5;
        } catch (error) {
          console.error('Error adding text:', error);
        }
      };

      // Helper function to add a line
      const addLine = (color = '#00694B', width = 0.5) => {
        try {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.setDrawColor(color);
          pdf.setLineWidth(width);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        } catch (error) {
          console.error('Error adding line:', error);
        }
      };

      // Add logo at the top (simplified approach)
      try {
        console.log('Attempting to add logo...');
        const logoUrl = '/images/logo(2).png';
        
        // Try to load logo with a timeout
        const logoPromise = new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          const timeout = setTimeout(() => {
            console.log('Logo loading timeout, continuing without logo');
            resolve();
          }, 3000);
          
          img.onload = () => {
            clearTimeout(timeout);
            try {
              const logoWidth = 35;
              const logoHeight = (img.height * logoWidth) / img.width;
              pdf.addImage(img, 'PNG', margin, yPosition, logoWidth, logoHeight);
              yPosition += logoHeight + 5;
              console.log('Logo added successfully');
              resolve();
            } catch (error) {
              console.log('Error adding logo to PDF:', error);
              resolve();
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            console.log('Logo failed to load, continuing without logo');
            resolve();
          };
          
          img.src = logoUrl;
        });
        
        await logoPromise;
      } catch (error) {
        console.log('Logo loading failed, continuing without logo:', error);
      }

      console.log('Adding header section...');
      
      // Professional Header
      try {
        // VOTE CAM branding on the right side
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 102, 75); // Emerald green
        pdf.text('VOTE CAM', pageWidth - margin - 25, yPosition + 5, { align: 'right' });
        
        // Main title on the left side
        pdf.setFontSize(20);
        pdf.setTextColor(0, 0, 0);
        pdf.text('User Feedback Report', margin, yPosition + 5);
        yPosition += 20; // More space after title
        
        // Subtitle
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Comprehensive Feedback Analysis & Statistics', margin, yPosition);
        yPosition += 12;
        
        // Date and time
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Generated on: ${previewData.date} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
        yPosition += 30;
        
        // Professional line separator
        addLine('#00694B', 1);
      } catch (error) {
        console.error('Error adding header:', error);
        // Fallback to simple header - no duplicate content
        addLine();
      }

      console.log('Adding statistics section...');
      
      // Detailed Statistics Section
      try {
        addText('Detailed Statistics', 16, true);
        yPosition += 5;
        
        // Rating distribution in a simple format
        addText('Rating Distribution:', 12, true);
        yPosition += 8;
        
        // Simple table format
        for (let rating = 5; rating >= 1; rating--) {
          const count = previewData.stats.ratingDistribution[rating] || 0;
          const percentage = previewData.stats.total > 0 ? ((count / previewData.stats.total) * 100).toFixed(1) : '0.0';
          addText(`${rating} Stars: ${count} feedback (${percentage}%)`, 11);
        }
        
        yPosition += 15;
        addLine('#E5E7EB', 0.5);
      } catch (error) {
        console.error('Error adding statistics:', error);
        addText('Statistics could not be generated', 12, true);
        addLine();
      }

      console.log('Adding feedback data section...');
      
      // All Feedback Data with simplified formatting
      try {
        addText('Detailed Feedback Responses', 16, true);
        yPosition += 15;

        previewData.feedbacks.forEach((feedback, index) => {
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }

          // Professional feedback header with background
          pdf.setFillColor(248, 250, 252); // Light gray background
          pdf.roundedRect(margin, yPosition, contentWidth, 12, 1, 1, 'F');
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 102, 75);
          pdf.text(`Feedback #${index + 1}`, margin + 5, yPosition + 8);
          
          // Rating badge
          pdf.setFillColor(0, 102, 75);
          pdf.roundedRect(pageWidth - margin - 25, yPosition + 2, 20, 8, 1, 1, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.text(`${feedback.rating}/5`, pageWidth - margin - 20, yPosition + 7, { align: 'center' });
          
          yPosition += 15;
          
          // Feedback content
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          
          // Date
          pdf.text(`Date: ${formatDate(feedback.createdAt)}`, margin, yPosition);
          yPosition += 5;
          
          // User info
          if (feedback.userName) {
            pdf.text(`User: ${feedback.userName}`, margin, yPosition);
            yPosition += 5;
          }
          
          if (feedback.userEmail) {
            pdf.text(`Email: ${feedback.userEmail}`, margin, yPosition);
            yPosition += 5;
          }
          
          // Message with proper formatting
          pdf.setFont('helvetica', 'bold');
          pdf.text('Message:', margin, yPosition);
          yPosition += 5;
          
          pdf.setFont('helvetica', 'normal');
          const messageLines = pdf.splitTextToSize(feedback.message || feedback.body || 'No message provided', contentWidth - 10);
          pdf.text(messageLines, margin + 5, yPosition);
          yPosition += (messageLines.length * 4) + 5;
          
          // Admin response if exists
          if (feedback.reply) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 102, 75);
            pdf.text('Admin Response:', margin, yPosition);
            yPosition += 5;
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            const replyLines = pdf.splitTextToSize(feedback.reply, contentWidth - 10);
            pdf.text(replyLines, margin + 5, yPosition);
            yPosition += (replyLines.length * 4) + 5;
          }
          
          yPosition += 10;
          
          // Add separator line between feedbacks
          if (index < previewData.feedbacks.length - 1) {
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.2);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
          }
        });
      } catch (error) {
        console.error('Error adding feedback data:', error);
        addText('Feedback data could not be generated', 12, true);
      }

      console.log('Adding footer and saving PDF...');
      
      // Simple Footer
      try {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          
          // Simple footer text
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text('VOTE CAM - User Feedback Report', margin, pageHeight - 10);
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
      } catch (error) {
        console.error('Error adding footer:', error);
      }

      // Save the PDF with professional filename
      try {
        const fileName = `VOTE-CAM-Feedback-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        console.log('PDF saved successfully:', fileName);
        onClose();
      } catch (error) {
        console.error('Error saving PDF:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Try a simplified fallback PDF generation
      try {
        console.log('Attempting fallback PDF generation...');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Simple header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('VOTE CAM - Feedback Report', 20, 30);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${previewData.date}`, 20, 45);
        
        // Simple statistics
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Summary', 20, 65);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total Feedback: ${previewData.stats.total}`, 20, 80);
        pdf.text(`Average Rating: ${previewData.stats.averageRating.toFixed(1)}/5`, 20, 90);
        
        // Simple feedback list
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Feedback List', 20, 110);
        
        let yPos = 125;
        previewData.feedbacks.forEach((feedback, index) => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. Rating: ${feedback.rating}/5`, 20, yPos);
          yPos += 8;
          
          pdf.setFont('helvetica', 'normal');
          const message = feedback.message || feedback.body || 'No message';
          const lines = pdf.splitTextToSize(message, 170);
          pdf.text(lines, 20, yPos);
          yPos += (lines.length * 4) + 10;
        });
        
        // Save fallback PDF
        const fileName = `VOTE-CAM-Feedback-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        console.log('Fallback PDF saved successfully');
        onClose();
        
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        alert('Error generating PDF. Please try again or contact support.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative z-[200]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-emerald-600/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 200 }}
      />

      {/* Modal container - slide from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 201 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
          <h2 className="text-2xl font-bold text-gray-800">Export Feedback Report</h2>
          <div className="flex items-center space-x-3">
            <button 
              type="button"
              onClick={generatePDF}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ 
                "--tw-ring-color": "#00694B" 
              }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </span>
              )}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          {previewData && (
            <div ref={pdfRef} className="bg-white p-6 border border-gray-200 rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">User Feedback Report</h1>
                <div className="w-24 h-0.5 bg-emerald-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">Generated on {previewData.date}</p>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Summary Statistics</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                    <h3 className="text-sm font-semibold text-emerald-800">Total Feedback</h3>
                    <p className="text-xl font-bold text-emerald-600">{previewData.stats.total}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800">Average Rating</h3>
                    <p className="text-xl font-bold text-blue-600">{previewData.stats.averageRating}/5</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <h3 className="text-sm font-semibold text-purple-800">Report Date</h3>
                    <p className="text-sm font-bold text-purple-600">{previewData.date}</p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Rating Distribution</h2>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center">
                      <span className="w-6 text-xs font-medium text-gray-600">{rating}★</span>
                      <div className="flex-1 mx-3">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-emerald-600 h-3 rounded-full"
                            style={{ 
                              width: `${previewData.stats.total > 0 ? (previewData.stats.ratingDistribution[rating] / previewData.stats.total) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-8 text-xs text-gray-600 text-right">
                        {previewData.stats.ratingDistribution[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback List */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Feedback (Sample)</h2>
                <div className="space-y-4">
                  {previewData.previewFeedbacks.map((feedback, index) => (
                    <div key={feedback.id || index} className="border-l-2 border-emerald-600 pl-3 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{feedback.name}</h3>
                          <div className="flex items-center mt-1">
                            {renderStars(feedback.rating)}
                            <span className="ml-1 text-xs text-gray-600">({feedback.rating}/5)</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(feedback.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-2 leading-relaxed">{feedback.body}</p>
                      {feedback.reply && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-800 mb-1">Admin Response:</h4>
                          <p className="text-xs text-blue-700">{feedback.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-3">
                <p>This report was generated from the Election Management System</p>
                <p>For questions about this report, please contact the system administrator</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {previewData ? (
              <div className="flex items-center justify-between">
                <span>Preview showing {previewData.previewFeedbacks?.length || 0} of {previewData.feedbacks?.length || 0} feedback items</span>
                <span className="text-emerald-600 font-medium">PDF will include ALL {previewData.feedbacks?.length || 0} feedback items</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-gray-500">Loading preview data...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackExportModal;
