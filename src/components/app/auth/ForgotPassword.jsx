import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthInfo from './AuthInfo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset submitted for:', email);
    // Redirect to the EmailConfirmation page
    navigate('/EmailConfirmation');
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <AuthInfo />
      
      {/* Left Column - Forgot Password Form (smaller) */}
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
            <h2 className="text-3xl font-black text-gray-800">Forgot Password</h2>
            <p className="text-gray-700 mt-1 text-lg font-medium">Enter your email to receive a password reset link</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                    <path d="M2.24283 6.85435L11.4895 1.3086C11.8062 1.11865 12.2019 1.11872 12.5185 1.30878L21.7573 6.85433C21.9079 6.9447 22 7.10743 22 7.28303V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7.28315C2 7.10748 2.09218 6.94471 2.24283 6.85435ZM4 8.13261V19H20V8.13214L12.0037 3.33237L4 8.13261ZM12.0597 13.6983L17.3556 9.23532L18.6444 10.7647L12.074 16.3017L5.36401 10.7717L6.63599 9.2283L12.0597 13.6983Z"></path>
                  </svg>
                </div>
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-lg font-medium bg-white"
                  style={{ 
                    "--tw-ring-color": "#00694B",
                    "--tw-border-opacity": 1,
                    "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                  }}
                  placeholder="your@agency.gov"
                  required
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full py-4 px-5 text-white font-semibold rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-xl"
                style={{ 
                  background: "linear-gradient(to right, #00694B, #005941)", 
                  "--tw-ring-color": "#00694B" 
                }}
              >
                Reset Password
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

export default ForgotPassword; 