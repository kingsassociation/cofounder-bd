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
      <div className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      
      {/* Brand Name */}
      {variant === 'full' && (
        <span className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap">
          <span className="text-brand-primary">StyleHunt</span>
          <span className="text-brand-accent">BD</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
