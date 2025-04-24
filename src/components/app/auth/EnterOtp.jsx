import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthInfo from './AuthInfo';
import Alert from '../../common/Alert';
import apiService from '../../../services/apiService';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from location state (passed from ForgotPassword)
  const email = location.state?.email || '';

  // If no email is provided, redirect back to forgot password
  useEffect(() => {
    if (!email) {
      // Show error message about missing email
      setAlert({
        show: true,
        type: 'error',
        message: 'Email address is missing. Please try again.'
      });
      
      // Redirect back to forgot password page after a short delay
      setTimeout(() => {
        navigate('/ForgotPassword');
      }, 2000);
    }
  }, [email, navigate]);

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const validateOtp = () => {
    const newErrors = {};
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      newErrors.otp = 'Please enter all 6 digits of the verification code';
    } else if (!/^\d{6}$/.test(otpValue)) {
      newErrors.otp = 'Verification code must contain only numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Clear error when user types
    if (errors.otp) {
      setErrors({});
    }

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
    
    // Clear error when user pastes
    if (errors.otp) {
      setErrors({});
    }
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP
    if (!validateOtp()) {
      return;
    }
    
    setIsLoading(true);
    const otpValue = otp.join('');
    
    try {
      // Call the API to verify OTP
      await apiService.auth.verifyOtp(email, otpValue);
      
      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: 'OTP verified successfully'
      });
      
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        navigate('/ResetPassword', { state: { email, otp: otpValue } });
      }, 1500);
    } catch (error) {
      // Show error message
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Unable to verify OTP. Please try again.'
      });
      
      // Auto-hide error alert after 3 seconds
      setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    try {
      setIsLoading(true);
      
      // Call the API to resend OTP
      await apiService.auth.resendOtp(email);
      
      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: 'New verification code has been sent to your email'
      });
      
      // Disable resend button and start countdown
      setResendDisabled(true);
      setCountdown(60);
      
      // Clear current OTP fields
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      // Show error message
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to resend verification code. Please try again.'
      });
      
      // Auto-hide error alert after 3 seconds
      setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 3000);
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Alert Component */}
          <Alert 
            type={alert.type} 
            message={alert.message} 
            show={alert.show} 
            onClose={() => setAlert({...alert, show: false})} 
          />
          
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
                      className={`w-full aspect-square text-center px-0 py-3 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-xl font-bold bg-white`}
                      style={{ 
                        "--tw-ring-color": "#00694B",
                        "--tw-border-opacity": 1,
                        "--tw-border-color": errors.otp ? "rgba(239, 68, 68, var(--tw-border-opacity))" : "rgba(0, 105, 75, var(--tw-border-opacity))"
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
              {errors.otp && <p className="mt-1 text-sm text-red-600 text-center">{errors.otp}</p>}
              <p className="mt-2 text-sm text-gray-500 text-center">
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  onClick={handleResendCode} 
                  disabled={resendDisabled}
                  className={`text-emerald-700 font-medium hover:underline ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend'}
                </button>
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-5 text-white font-semibold rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)", 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify Code'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600 font-medium">
              Remember your password?{' '}
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