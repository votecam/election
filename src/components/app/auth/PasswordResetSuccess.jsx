import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from './AuthInfo';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setIsVisible(true), 100);

    // Redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <AuthInfo />
      
      {/* Left Column - Success Message (smaller) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-8 py-6 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Single Fingerprint - Top Left */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-32 -left-40 w-[500px] h-[500px]">
            <img 
              src="/images/fingerprint.svg" 
              alt="Fingerprint" 
              className="w-full h-full object-contain"
              style={{ 
                filter: "invert(23%) sepia(30%) saturate(340%) hue-rotate(165deg) brightness(95%) contrast(85%)", 
                opacity: 0.03,
                mixBlendMode: "multiply" 
              }}
            />
          </div>
          
          {/* Circular SVG Background Pattern */}
          <div className="absolute top-0 -right-[30rem] h-full w-[40rem] flex items-center opacity-40" style={{ pointerEvents: 'none' }}>
            <div className="relative w-[40rem] h-[40rem]">
              <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots-pattern-small" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="#345554" opacity="0.15" />
                  </pattern>
                </defs>
                
                {/* Only small dot pattern in circle */}
                <circle cx="100" cy="100" r="100" fill="url(#dots-pattern-small)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="/images/logo(2).png" 
              alt="Election Information System Logo" 
              className="w-28 h-28 object-contain mb-1"
            />
            <h2 className="text-3xl font-black text-gray-800">Password Reset Successful</h2>
            <p className="text-gray-700 mt-1 text-lg font-medium">Your password has been reset successfully</p>
          </div>
          
          <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="bg-white p-8 rounded-none shadow-lg border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-emerald-600">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600 text-center text-lg">
                  You will be redirected to the login page in a moment...
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="text-lg text-center text-gray-600 font-medium">
              © 2025 All rights reserved. Official Electoral Information System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess; 