import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Election Information System. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer; 