import { useState, useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const images = [
    '/images/people(15).jpg',
    '/images/people(8).jpg',
    '/images/people(12).jpg'
  ];

  // Image carousel effect with improved transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
    // Add authentication logic here
  };

  return (
    <div className="h-screen flex flex-row-reverse overflow-hidden">
      {/* Right Column - Image Carousel (larger) */}
      <div className="hidden lg:block lg:w-3/5 bg-slate-900">
        <div className="h-full relative overflow-hidden">
          {/* Background placeholder to prevent white flash */}
          <div className="absolute inset-0 bg-slate-900"></div>
          
          {images.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={img} 
                alt={`People voting ${index + 1}`} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Improved gradient overlay */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 30%, rgba(16,67,70,0.7) 70%, rgba(5,102,95,0.6) 100%)'
              }}></div>
            </div>
          ))}
          
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-0.5 bg-emerald-400"></div>
                <span className="text-emerald-300 text-base font-medium tracking-wider">ADMINISTRATOR ACCESS</span>
              </div>
              <h1 className="text-white text-5xl font-bold leading-tight">
                Election <span className="text-emerald-300">Information System</span>
              </h1>
              <p className="text-white/90 max-w-md leading-relaxed text-lg">
                Centralized management portal for election data, voter information, and administrative oversight.
              </p>
              
              <div className="pt-4 grid grid-cols-2 gap-5 max-w-md">
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-lg">Election Guide</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-lg">Candidate Management</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-lg">Analytics</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-lg">Polling Centers</span>
                </div>
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-lg">Feedback Management</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Modern circular indicators with animated fill */}
              <div className="flex space-x-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="focus:outline-none"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <div className="relative w-3 h-3">
                      <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                        index === currentImageIndex ? 'bg-emerald-400' : 'bg-white/30 hover:bg-white/50'
                      }`}></div>
                      {index === currentImageIndex && (
                        <div className="absolute -inset-1 rounded-full border-2 border-emerald-400/50 animate-ping"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Column - Login Form (smaller) */}
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
          
          {/* Light Gray SVG Background Pattern - Right Side */}
          <div className="absolute top-0 right-0 bottom-0 w-24" style={{ pointerEvents: 'none' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="0.5" fill="#888888" opacity="0.1" />
                </pattern>
                
                <pattern id="dots-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#666666" opacity="0.07" />
                </pattern>
              </defs>
              
              {/* Grid pattern */}
              <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
              
              {/* Larger dots pattern */}
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-pattern)" />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-teal-800 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Administrator Portal</h2>
            <p className="text-gray-600 mt-1">Please authenticate to access the system</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-md hover:shadow-lg transition-shadow duration-300 text-base"
                  placeholder="your@agency.gov"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-md hover:shadow-lg transition-shadow duration-300 text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-gray-500 border-gray-300 rounded focus:ring-gray-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-base text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-base">
                <a href="#" className="text-emerald-700 hover:text-emerald-900 font-medium">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg text-lg"
              >
                Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-base text-gray-600">
              Need an account?{' '}
              <a href="#" className="text-emerald-700 hover:text-emerald-900 font-medium">
                Contact your administrator
              </a>
            </p>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="text-xxl text-center text-gray-500">
              © 2025 All rights reserved. Official Electoral Information System.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;