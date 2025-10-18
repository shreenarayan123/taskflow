import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative">
        {/* Main spinner */}
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-600 rounded-full opacity-20 animate-ping`}></div>
      </div>
      
      {text && (
        <p className="mt-4 text-gray-600 animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;