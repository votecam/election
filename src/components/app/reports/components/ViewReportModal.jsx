import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon, DocumentTextIcon, UserIcon, CalendarIcon, TagIcon, PaperClipIcon } from '@heroicons/react/24/outline';


// Video Player Component
const VideoPlayer = ({ media, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          src={media.url ? (media.url.startsWith('http') ? media.url : `https://api.votecam.org${media.url}`) : media.src}
          className="w-full h-64 bg-black"
          poster={media.thumbnail ? (media.thumbnail.startsWith('http') ? media.thumbnail : `https://api.votecam.org${media.thumbnail}`) : undefined}
          preload="metadata"
          controls={isPlaying}
          onClick={togglePlayPause}
        />
        
        {/* Play/Pause Overlay - Only show when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none">
            <div className="pointer-events-auto">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-white hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="w-8 h-8 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Custom Controls Overlay - Show when playing */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Video {index + 1}</span>
          <span className="text-xs text-gray-500">• {formatTime(duration)}</span>
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Voice Note Player Component
const VoiceNotePlayer = ({ media, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        cancelAnimationFrame(animationRef.current);
      } else {
        audio.play();
        animateFrequency();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const animateFrequency = () => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateFrequency);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate frequency bars for visualization
  const generateFrequencyBars = () => {
    const bars = [];
    const barCount = 20;
    for (let i = 0; i < barCount; i++) {
      const height = isPlaying ? Math.random() * 100 : Math.random() * 20;
      bars.push(
        <div
          key={i}
          className={`bg-emerald-500 transition-all duration-75 ${isPlaying ? 'animate-pulse' : ''}`}
          style={{
            height: `${height}%`,
            width: '3px',
            borderRadius: '2px'
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isPlaying 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Voice Note Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Voice Note {index + 1}</span>
            <span className="text-xs text-gray-500">• {formatTime(duration)}</span>
          </div>

          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Frequency Visualization */}
        <div className="flex items-end space-x-1 h-12">
          {generateFrequencyBars()}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={media.url ? (media.url.startsWith('http') ? media.url : `https://api.votecam.org${media.url}`) : media.src}
        preload="metadata"
        volume={volume}
      />
    </div>
  );
};

const ViewReportModal = ({ isOpen, onClose, report }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'investigating': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Disabled': 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800',
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };



  // Handle image click
  const handleImageClick = (index) => {
    if (expandedImageIndex === index) {
      setExpandedImageIndex(null); // Collapse if already expanded
    } else {
      setExpandedImageIndex(index); // Expand the clicked image
    }
  };

  return (
    <div className="relative z-[100]">
      {/* Backdrop with blur effect */}
      <div 
        className={`fixed inset-0 bg-emerald-600/30 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ zIndex: 100 }}
      />

      {/* Modal container - slide from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 101 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Report Details</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          {report ? (
            <>
              {/* Report Title and Status */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                  <div className="text-center sm:text-left flex-1">
                  <h3 className="text-4xl font-bold text-gray-800">{report.title || 'Untitled Incident'}</h3>
                  <p className="text-2xl text-gray-600 mt-1">
                    {report.type ? report.type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ') : 'Unknown Type'}
                  </p>
                  
                  {/* Status and Priority */}
                  <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getStatusBadge(report.status)}`}>
                      {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getPriorityBadge(report.priority)}`}>
                      {report.priority?.charAt(0).toUpperCase() + report.priority?.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Report Description</h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {report.description || 'No description provided for this incident.'}
                </p>
              </div>

              {/* Details Section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Report Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-base text-gray-500">Submitted By</p>
                      <p className="text-lg font-medium">
                        {report.reporter?.name || report.reporter?.fullDetails?.name || 'Anonymous'}
                        {report.reporter?.isAnonymous && (
                          <span className="ml-2 text-sm text-gray-500">(Anonymous)</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-base text-gray-500">Report Type</p>
                      <p className="text-lg font-medium">
                        {report.type ? report.type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ') : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-base text-gray-500">Submission Date</p>
                      <p className="text-lg font-medium">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : report.date ? `${report.date} ${report.time || ''}` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-base text-gray-500">Report ID</p>
                      <p className="text-lg font-medium">
                        #{report.referenceNumber || report.id || report._id || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {report.location && report.location !== 'Unknown Location' && (
                    <div className="md:col-span-2 mt-4">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-base font-medium">{report.location}</p>
                    </div>
                  )}
                  
                  {report.tags && report.tags.length > 0 && (
                    <div className="md:col-span-2 mt-4">
                      <p className="text-sm text-gray-500">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Map Section */}
              {report.coordinates && (
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Incident Location</h4>
                  
                  {/* Map Container */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="h-64 w-full relative">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.coordinates.lng-0.01},${report.coordinates.lat-0.01},${report.coordinates.lng+0.01},${report.coordinates.lat+0.01}&layer=mapnik&marker=${report.coordinates.lat},${report.coordinates.lng}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Incident Location Map"
                      ></iframe>
                    </div>
                    
                    {/* Coordinates Info */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-gray-500">Latitude</span>
                          </div>
                          <span className="text-sm font-mono font-semibold text-gray-800">
                            {report.coordinates.lat}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-500">Longitude</span>
                          </div>
                          <span className="text-sm font-mono font-semibold text-gray-800">
                            {report.coordinates.lng}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              {report.timeline && report.timeline.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-4">Incident Timeline</h4>
                  <div className="space-y-4">
                    {report.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-lg font-medium text-gray-900">
                              {event.action ? event.action.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ') : 'Event'}
                            </p>
                            <span className="text-sm text-gray-500">
                              {event.timestamp ? new Date(event.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Unknown time'}
                            </span>
                          </div>
                          <p className="text-base text-gray-600 mt-1">
                            {event.description || 'No description available'}
                          </p>
                          {event.user && (
                            <p className="text-sm text-gray-500 mt-1">
                              by {event.user.name} ({event.user.role})
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Section */}
              <div className="bg-gray-50 rounded-lg p-5 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Attached Media</h4>
                {report.media && report.media.length > 0 ? (
                  <div className="space-y-6">
                    {/* Images */}
                    {report.media.filter(media => media.type === 'image').length > 0 && (
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Images ({report.media.filter(media => media.type === 'image').length})
                        </h5>
                        
                        {/* Expanded Image */}
                        {expandedImageIndex !== null && (
                          <div className="mb-6 bg-black rounded-lg overflow-hidden">
                            <div className="relative">
                              <img
                                src={report.media.filter(media => media.type === 'image')[expandedImageIndex]?.url ? 
                                  (report.media.filter(media => media.type === 'image')[expandedImageIndex].url.startsWith('http') ? 
                                    report.media.filter(media => media.type === 'image')[expandedImageIndex].url : 
                                    `https://api.votecam.org${report.media.filter(media => media.type === 'image')[expandedImageIndex].url}`) : 
                                  report.media.filter(media => media.type === 'image')[expandedImageIndex]?.src}
                                alt={`Expanded incident image ${expandedImageIndex + 1}`}
                                className="w-full h-96 object-contain"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.png';
                                }}
                              />
                              <button
                                onClick={() => setExpandedImageIndex(null)}
                                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="p-3 bg-gray-800 text-white">
                              <p className="text-sm">Image {expandedImageIndex + 1}</p>
                              {report.media.filter(media => media.type === 'image')[expandedImageIndex]?.size && (
                                <p className="text-xs text-gray-300">{(report.media.filter(media => media.type === 'image')[expandedImageIndex].size / 1024 / 1024).toFixed(1)} MB</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {report.media.filter(media => media.type === 'image').map((media, index) => (
                            <div 
                              key={index} 
                              className={`bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer ${
                                expandedImageIndex === index ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
                              }`}
                            >
                              <img
                                src={media.url ? (media.url.startsWith('http') ? media.url : `https://api.votecam.org${media.url}`) : media.src}
                                alt={`Incident image ${index + 1}`}
                                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                                onClick={() => handleImageClick(index)}
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.png';
                                }}
                              />
                              <div className="p-2">
                                <p className="text-xs text-gray-600">Image {index + 1}</p>
                                {media.size && (
                                  <p className="text-xs text-gray-500">{(media.size / 1024 / 1024).toFixed(1)} MB</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {report.media.filter(media => media.type === 'video').length > 0 && (
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Videos ({report.media.filter(media => media.type === 'video').length})
                        </h5>
                        <div className="space-y-4">
                          {report.media.filter(media => media.type === 'video').map((media, index) => (
                            <VideoPlayer key={index} media={media} index={index} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audio/Voice Notes */}
                    {report.media.filter(media => media.type === 'audio').length > 0 && (
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          Voice Notes ({report.media.filter(media => media.type === 'audio').length})
                        </h5>
                        <div className="space-y-4">
                          {report.media.filter(media => media.type === 'audio').map((media, index) => (
                            <VoiceNotePlayer key={index} media={media} index={index} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No media attached</h3>
                    <p className="mt-1 text-sm text-gray-500">This incident report has no media files attached.</p>
                  </div>
                )}
              </div>

            </>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No report selected</h3>
              <p className="mt-1 text-sm text-gray-500">Please select a report to view its details.</p>
            </div>
          )}
        </div>
      </div>



    </div>
  );
};

export default ViewReportModal;
