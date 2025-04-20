import React from 'react';

const RegisterCandidate = () => {
  return (
    <div className="w-full max-w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Register Candidate</h1>
        <p className="text-gray-600 mt-1">Add new candidates to the electoral system</p>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hello!</h2>
        <p className="text-gray-600">This is the Register Candidate page. Here you'll be able to add new candidates to the election system.</p>
      </div>
    </div>
  );
};

export default RegisterCandidate; 