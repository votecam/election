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

  // Define animation styles
  const animationStyles = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes slideUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInSlow {
      0% { opacity: 0; }
      30% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fadeInItem {
      0% { opacity: 0; transform: translateX(-10px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.8s ease-in-out forwards;
    }
    .animate-slideUp {
      animation: slideUp 1s ease-out forwards;
    }
    .animate-fadeInSlow {
      animation: fadeInSlow 1.5s ease-in-out forwards;
    }
    .animate-fadeInItem {
      opacity: 0;
      animation: fadeInItem 0.6s ease-out forwards;
    }
  `;

  // Image carousel effect with improved transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Add a function to handle image preloading
  useEffect(() => {
    // Preload all images to ensure smooth transitions
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
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
      <style jsx>{animationStyles}</style>
      {/* Right Column - Image Carousel (larger) */}
      <div className="hidden lg:block lg:w-3/5 bg-slate-900">
        <div className="h-full relative overflow-hidden">
          {/* Background placeholder to prevent white flash */}
          <div className="absolute inset-0 bg-slate-900"></div>
          
          {images.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1500 transform-gpu ${
                index === currentImageIndex 
                  ? 'opacity-100 z-10 scale-100 blur-0' 
                  : index === (currentImageIndex + 1) % images.length 
                    ? 'opacity-0 z-0 scale-110 blur-sm rotate-1' 
                    : 'opacity-0 z-0 scale-110 blur-sm -rotate-1'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img 
                src={img} 
                alt={`People voting ${index + 1}`} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Improved gradient overlay with animation */}
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.88) 60%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.82) 100%)',
                  animation: index === currentImageIndex ? 'gradientPulse 6s ease-in-out infinite' : 'none'
                }}
              >
                <style jsx>{`
                  @keyframes gradientPulse {
                    0%, 100% { opacity: 0.95; }
                    50% { opacity: 1; }
                  }
                `}</style>
              </div>
              
              {/* Floating particles effect for active slide */}
              {index === currentImageIndex && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-emerald-400/20 z-10"
                      style={{
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float${i % 3 + 1} ${Math.random() * 15 + 10}s linear infinite`
                      }}
                    ></div>
                  ))}
                  <style jsx>{`
                    @keyframes float1 {
                      0% { transform: translateY(0) translateX(0); opacity: 0; }
                      10% { opacity: 0.6; }
                      90% { opacity: 0.6; }
                      100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                    }
                    @keyframes float2 {
                      0% { transform: translateY(0) translateX(0); opacity: 0; }
                      10% { opacity: 0.4; }
                      90% { opacity: 0.4; }
                      100% { transform: translateY(-70px) translateX(-30px); opacity: 0; }
                    }
                    @keyframes float3 {
                      0% { transform: translateY(0) translateX(0); opacity: 0; }
                      10% { opacity: 0.3; }
                      90% { opacity: 0.3; }
                      100% { transform: translateY(-50px) translateX(50px); opacity: 0; }
                    }
                  `}</style>
                </div>
              )}
            </div>
          ))}
          
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-0.5" style={{ backgroundColor: "#00694B" }}></div>
                <span className="text-white text-xl font-semibold tracking-wider animate-fadeIn">VOTECAM ADMINISTRATOR PORTAL</span>
              </div>
              <h1 className="text-white text-6xl font-black leading-tight mb-4 animate-slideUp">
                Election <span style={{ color: "#BF3533" }} className="font-black">Information System</span>
              </h1>
              <p className="text-white/95 leading-relaxed text-2xl mt-6 font-medium animate-fadeInSlow">
                Your trusted resource for accurate election information, helping citizens <br /> stay informed about voting processes, candidates, and polling locations <br /> to enhance civic participation.
              </p>
              
              <div className="pt-6 grid grid-cols-2 gap-x-8 gap-y-5 max-w-md mt-20">
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.1s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Voter Guides</span>
                </div>
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.2s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Candidate Profiles</span>
                </div>
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.3s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Polling Locations</span>
                </div>
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.4s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Key Dates</span>
                </div>
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.5s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Civic Education</span>
                </div>
                <div className="flex items-start space-x-3 animate-fadeInItem" style={{ animationDelay: '0.6s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-0.5 flex-shrink-0" style={{ color: "white" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-medium text-2xl">Citizen Feedback</span>
                </div>
              </div>
              
              <div className="space-y-5">
               
                
                {/* Modern indicators styled like the image */}
                
              </div>
            </div>
            
            {/* Move indicators to bottom of overlay */}
            <div className="flex space-x-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`h-1.5 rounded-full transition-colors duration-300 ${
                    index === 1 ? 'w-10' : 'w-4'
                  } ${
                    index === currentImageIndex 
                      ? 'bg-white'
                      : 'bg-white/30 hover:bg-white/50'
                  }`} style={index === currentImageIndex && index === 1 ? { backgroundColor: "#00694B" } : {}}></div>
                </button>
              ))}
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
              src="/images/logo(3).png" 
              alt="Election Information System Logo" 
              className="w-28 h-28 object-contain mb-1"
            />
            <h2 className="text-3xl font-black text-gray-800">Login to your account</h2>
            <p className="text-gray-700 mt-1 text-lg font-medium">Please authenticate to access the system</p>
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
              <label htmlFor="password" className="block text-base font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600">
                    <path d="M18 8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8ZM5 10V20H19V10H5ZM11 14H13V16H11V14ZM7 14H9V16H7V14ZM15 14H17V16H15V14ZM16 8V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8H16Z"></path>
                  </svg>
                </div>
                {/* Vertical separator line */}
                <div className="absolute inset-y-2 left-12 w-px bg-gray-300"></div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="pl-16 w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:border-emerald-600 transition-shadow duration-300 text-lg font-medium bg-white"
                  style={{ 
                    "--tw-ring-color": "#00694B",
                    "--tw-border-opacity": 1,
                    "--tw-border-color": "rgba(0, 105, 75, var(--tw-border-opacity))"
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-gray-600 hover:text-gray-800">
                      <path d="M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z"></path>
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
                  className="h-5 w-5 border-gray-300 rounded focus:ring-emerald-500"
                  style={{ 
                    "--tw-ring-color": "#00694B",
                    color: "#00694B" 
                  }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-lg text-gray-700 font-medium">
                  Remember me
                </label>
              </div>
              
              <div className="text-base">
                <a href="#" 
                  className="hover:text-emerald-900 font-semibold text-lg"
                  style={{ color: "#00694B" }}>
                  Forgot password?
                </a>
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
                Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600 font-medium">
              Need an account?{' '}
              <a href="#" 
                className="hover:text-emerald-900 font-semibold"
                style={{ color: "#00694B" }}>
                Contact your administrator
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

export default Login;