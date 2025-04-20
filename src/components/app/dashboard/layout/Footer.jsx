import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Election Information System. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-emerald-600 text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-600 hover:text-emerald-600 text-sm">
            Terms of Service
          </a>
          <a href="#" className="text-gray-600 hover:text-emerald-600 text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 