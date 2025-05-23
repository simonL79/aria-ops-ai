
import React from 'react';
import { useParams } from 'react-router-dom';

const FreeScanResults = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Scan Results</h1>
        <p className="text-gray-600 text-center">
          Scan results for ID: {id}
        </p>
        <p className="text-gray-600 text-center mt-2">
          Results page coming soon...
        </p>
      </div>
    </div>
  );
};

export default FreeScanResults;
