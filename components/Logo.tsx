import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'light' | 'dark'; // 'light' = white logo, 'dark' = black logo
}

export const Logo: React.FC<LogoProps> = ({ className = '', theme = 'light' }) => {
  // Use filter to generate monochrome versions from the source image
  const imageFilter = theme === 'light' ? 'brightness-0 invert' : 'brightness-0';

  return (
    <div className={`relative flex items-center justify-start overflow-hidden ${className}`}>
      <img 
        src="https://lh3.googleusercontent.com/d/1Q8H813hjSsBmBSkownVjaGK7EIzTGHYz" 
        alt="Zero Geometry Logo"
        className={`w-full h-full object-contain object-left transition-all duration-300 ${imageFilter} scale-100`}
        style={{ imageRendering: 'auto' }}
        loading="eager"
      />
    </div>
  );
};