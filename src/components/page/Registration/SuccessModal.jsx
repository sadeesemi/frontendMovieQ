import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export function SuccessModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your account has been created successfully. Redirecting to login...
        </p>
        <div className="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
}