import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { MenuOverlay } from './MenuOverlay';
import { PageView } from '../types';

interface NavigationProps {
  onNavigate: (page: PageView) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, scrollContainerRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const viewportHeight = window.innerHeight;
      
      // Animation completes within the first 60% of the hero section's height
      const rawScroll = el.scrollTop;
      const normalized = Math.min(1, rawScroll / (viewportHeight * 0.6));
      setScrollProgress(normalized);
    };

    const handleResize = () => setWindowWidth(window.innerWidth);

    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleResize);
    
    return () => {
      element?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollContainerRef]);

  const handleScrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Branding sizes
  const brandingTextSizeClass = 'text-3xl md:text-4xl';
  
  // Adjusted clamp for mobile: Increased slightly for readability
  // Desktop: Normal large size
  // Mobile: Starts at ~1.1rem-1.5rem (was ~0.85rem-1.25rem)
  const startFontSize = windowWidth >= 768 ? 'clamp(2.25rem, 7.5vw, 6rem)' : 'clamp(1.1rem, 5vw, 1.5rem)';
  
  // End size for mobile: ~0.85rem (was 0.65rem)
  const endFontSize = windowWidth >= 768 ? '2.25rem' : '0.85rem';

  // Desktop Side Margin: 100px (Mobile: 24px)
  const sideMarginNum = windowWidth >= 768 ? 100 : 24;
  // Desktop Top/Bottom Margin: 50px (Mobile: 20px)
  const verticalMarginNum = windowWidth >= 768 ? 50 : 20;
  
  const sidePad = `${sideMarginNum}px`;
  const verticalPad = `${verticalMarginNum}px`;

  return (
    <>
      {/* Persistent UI Layer with Difference Blend Mode */}
      <div className="fixed inset-0 z-[60] pointer-events-none mix-blend-difference text-white select-none">
        <div 
          className="relative w-full h-full flex flex-col justify-between"
          style={{ 
            paddingLeft: sidePad, 
            paddingRight: sidePad, 
            paddingTop: verticalPad, 
            paddingBottom: verticalPad 
          }}
        >
          
          {/* Top Bar (Logo and Menu) */}
          <div className="flex justify-between items-center pointer-events-auto">
            <div 
              className="w-[60px] h-[60px] md:w-24 md:h-24 cursor-pointer" 
              onClick={handleScrollToTop}
            >
              <Logo theme="light" className="w-full h-full" />
            </div>
            
            <button 
              className="p-2 hover:opacity-70 transition-opacity"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={windowWidth >= 768 ? 48 : 32} strokeWidth={1} />
            </button>
          </div>

          {/* 
            Animated Slogan: vision. precision. soul. 
          */}
          <div 
            className="absolute transition-all duration-75 ease-out font-poppins flex gap-3 md:gap-12 items-baseline leading-none z-20"
            style={{
              left: `calc(${sidePad} + (1 - ${scrollProgress}) * ${windowWidth >= 768 ? '50px' : '0px'})`, 
              bottom: `calc(${verticalPad} + (1 - ${scrollProgress}) * (50% - ${verticalPad}))`,
              transform: `translateY(${(1 - scrollProgress) * 50}%)`,
              fontSize: `calc(${endFontSize} + (1 - ${scrollProgress}) * (${parseFloat(startFontSize) || 2}rem - ${parseFloat(endFontSize) || 0.85}rem))`, 
            }}
          >
            {/* 
               We simply override style fontSize with a safer JS-only approach for smoothness 
               We map 0->1 scroll to Start->End size
            */}
             <div style={{ 
                fontSize: scrollProgress < 0.5 
                  ? startFontSize 
                  : endFontSize,
                transition: 'font-size 0.3s ease-out',
                display: 'flex',
                gap: windowWidth >= 768 ? '3rem' : '0.5rem' // Slightly increased gap on mobile
             }}>
                <span className="lowercase">vision{scrollProgress < 0.3 ? '.' : ''}</span>
                <span className="lowercase">precision{scrollProgress < 0.3 ? '.' : ''}</span>
                <span className="lowercase">soul{scrollProgress < 0.3 ? '.' : ''}</span>
             </div>
          </div>

          {/* Bottom Bar Branding Container */}
          <div className="flex justify-between items-baseline w-full">
            {/* Invisible placeholder for layout balance */}
            <div className={`${brandingTextSizeClass} font-poppins lowercase opacity-0 pointer-events-none leading-none hidden md:block`}>
              vision precision soul
            </div>
            
            {/* Right Branding: ZERO GEOMETRY */}
            {/* Mobile: text-xs (was text-[10px]), Desktop: text-4xl */}
            <div className="text-xs md:text-4xl font-poppins text-right leading-none tracking-tight flex items-baseline pointer-events-auto ml-auto">
              <span className="font-extralight uppercase tracking-[0.15em]">ZERO</span>
              {/* Reduced spacing on mobile: ml-[2px] instead of ml-1 */}
              <span className="font-normal uppercase ml-[2px] md:ml-3 tracking-normal">GEOMETRY</span>
            </div>
          </div>
        </div>
      </div>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />
    </>
  );
};