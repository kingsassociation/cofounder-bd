'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon-only';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-100">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      
      {/* Brand Name */}
      {variant === 'full' && (
        <span className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap">
          <span className="text-gray-900">Abed</span>
          <span className="text-brand-600 ml-1">Interior</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
