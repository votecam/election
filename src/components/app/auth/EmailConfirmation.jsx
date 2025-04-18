import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from './AuthInfo';

const EmailConfirmation = () => {
  const lottieContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleResend = () => {
    console.log('Resending password reset email');
    // Add resend logic here
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <AuthInfo />
      
      {/* Left Column - Email Confirmation */}
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
          <div className="text-center py-10">
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/images/logo(2).png" 
                alt="Election Information System Logo" 
                className="w-28 h-28 object-contain mb-1"
              />
            </div>
            
            {/* Lottie Animation - Better Balanced Size */}
            <div className="mb-6 mx-auto" style={{ width: "200px", height: "200px" }}>
              <img 
                src="/images/lottiefile.gif" 
                alt="Email Sent Animation" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h2 className="text-3xl font-black text-gray-800 mb-4">Check Your Email</h2>
            <p className="text-lg text-gray-700 mb-6 font-medium max-w-md mx-auto">
              We've sent a password reset link to <strong>immaxstrendy1@gmail.com</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResend}
                className="w-full py-4 px-5 text-white font-semibold rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)", 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                Resend Email
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="w-full py-4 px-5 border-2 border-[#00694B] text-[#00694B] font-semibold rounded-none hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
                style={{ 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                Back to Login
              </button>
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

export default EmailConfirmation; 