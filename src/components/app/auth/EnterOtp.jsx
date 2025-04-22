import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from './AuthInfo';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    // Update OTP array
    const newOtp = [...otp];
    // Only take the last character if user pastes multiple digits
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus to next input after entry
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
    
    // Arrow left/right navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is numeric and has the right length
    if (!/^\d+$/.test(pastedData)) {
      return;
    }
    
    // Fill the OTP inputs with pasted digits
    const digits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    digits.forEach((digit, idx) => {
      if (idx < 6) {
        newOtp[idx] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (digits.length < 6) {
      inputRefs.current[digits.length].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('OTP Submitted:', otpValue);
    // Navigate to next page or process verification
    if (otpValue.length === 6) {
      navigate('/ResetPassword');
    }
  };

  const handleResendCode = () => {
    console.log('Resending OTP code');
    // Implement resend logic here
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <AuthInfo />
      
      {/* Left Column - OTP Verification Form (smaller) */}
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
            <h2 className="text-3xl font-black text-gray-800">Verify OTP Code</h2>
            <p className="text-gray-700 mt-1 text-lg font-medium text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="otp-input" className="block text-base font-semibold text-gray-700 mb-1">
                Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <div className="relative flex-1" key={index}>
                    <input
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : null}
                      className="w-full aspect-square text-center px-0 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-xl font-bold bg-white"
                      style={{ 
                        "--tw-ring-color": "#00694B",
                        "--tw-border-opacity": 1,
                        "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Didn't receive the code? <button type="button" onClick={handleResendCode} className="text-emerald-700 font-medium hover:underline">Resend</button>
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-4 px-5 text-white font-semibold rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)", 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                Verify Code
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600 font-medium">
              Need to go back?{' '}
              <a href="#" 
                onClick={handleBackToLogin}
                className="hover:text-emerald-900 font-semibold"
                style={{ color: "#00694B" }}>
                Back to login
              </a>
            </p>
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

export default OTPVerification;