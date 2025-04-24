import { useState, useEffect } from 'react';

const AuthSidebar = ({ title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/people(15).png',
    '/images/people(8).png',
    '/images/people(12).png'
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

  return (
    <div className="hidden lg:block lg:w-3/5 bg-slate-900">
      <style>{animationStyles}</style>
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
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.82) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.78) 60%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.72) 100%)',
                animation: index === currentImageIndex ? 'gradientPulse 6s ease-in-out infinite' : 'none'
              }}
            >
              <style jsx>{`
                @keyframes gradientPulse {
                  0%, 100% { opacity: 0.85; }
                  50% { opacity: 0.9; }
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
              Your trusted resource for accurate election information, helping citizens <br /> 
              stay informed about voting processes, candidates, and polling locations <br /> 
              to enhance civic participation.
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
  );
};

export default AuthSidebar; 