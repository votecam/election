import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from './AuthInfo';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <AuthInfo />
      
      {/* Left Column - Success Message */}
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
                <circle cx="100" cy="100" r="100" fill="url(#dots-pattern-small)" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="text-center py-8">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/images/logo(2).png" 
                alt="Election Information System Logo" 
                className="w-28 h-28 object-contain mb-2"
              />
              
              {/* Success Icon */}
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-100 animate-ping opacity-75"></div>
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-gray-800 mb-3">Password Reset Successful!</h2>
              <p className="text-lg text-gray-600 font-medium max-w-sm mx-auto mb-8">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              
              {/* Back to Login Button */}
              <button
                onClick={handleBackToLogin}
                className="w-full sm:w-2/3 py-4 px-6 text-white font-semibold rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl hover:shadow-md"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)",
                  "--tw-ring-color": "#00694B"
                }}
              >
                Back to Login
              </button>
              
              {/* Security Reminder */}
             
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-4">
              <p className="text-lg text-center text-gray-600 font-medium">
                © 2025 All rights reserved. Official Electoral Information System.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess; 