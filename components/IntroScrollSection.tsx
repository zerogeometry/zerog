import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { InteractiveGrid } from './InteractiveGrid';
import { DotMorph } from './DotMorph';
import { PageView } from '../types';

const INTRO_PHRASES = [
  "blending creative mastery",
  "with cutting edge innovation",
  "to craft brands which are",
  "strategically sharp",
  "visually stunning",
  "emotionally resonant"
];

interface IntroScrollSectionProps {
  onNavigate: (page: PageView) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const IntroScrollSection: React.FC<IntroScrollSectionProps> = ({ onNavigate, scrollContainerRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isNightTime, setIsNightTime] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile Check
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    // Check if current time is between 9:30 PM (21:30) and 2:30 AM (02:30)
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      const nightStart = 21 * 60 + 30; // 21:30
      const nightEnd = 2 * 60 + 30;   // 02:30
      
      const isNight = totalMinutes >= nightStart || totalMinutes <= nightEnd;
      setIsNightTime(isNight);
    };

    checkTime();
    const timer = setInterval(checkTime, 60000); // Re-check every minute

    const handleScroll = () => {
      if (!containerRef.current || !scrollContainerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollable = rect.height - windowHeight;
      const currentScroll = -rect.top;
      
      const p = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setProgress(p);
    };

    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      scrollEl?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [scrollContainerRef]);

  // ANIMATION TIMING CONFIGURATION
  // We finish animations by 0.9 to leave 0.9 -> 1.0 as a static "hold" delay
  
  // 1. Phrases end and Side Text starts appearing
  const sideTextTrigger = 0.75; 
  
  // 2. Button starts appearing slightly later
  const buttonTrigger = 0.80;

  // Determine active phrase based on linear progress up to the trigger point
  const activePhraseIndex = Math.min(INTRO_PHRASES.length - 1, Math.floor((progress / sideTextTrigger) * INTRO_PHRASES.length));
  
  // Opacity Ramps: 
  // Text fades in from 0.75 to 0.85 (Multiplying by 10)
  const sideTextOpacity = Math.max(0, Math.min(1, (progress - sideTextTrigger) * 10));
  
  // Button fades in from 0.80 to 0.90 (Multiplying by 10)
  const buttonOpacity = Math.max(0, Math.min(1, (progress - buttonTrigger) * 10));

  // Font Size Logic: 
  // Mobile: Reduced slightly to ensure "cutting edge innovation" fits (0.9rem - 1.3rem)
  // Desktop: 1.66rem min
  const baseFontSize = isMobile 
    ? 'clamp(0.9rem, 4vw, 1.3rem)' 
    : 'clamp(1.66rem, 4.1vw, 4.1rem)';

  return (
    <section 
      ref={containerRef} 
      // Increased height to 700vh to allow for slower scroll and the delay buffer
      className="relative h-[700vh] w-full overflow-visible z-10 snap-start bg-[#f3f4f6]"
    >
      {/* 
        Sticky Viewport 
        Mobile Fixes:
        1. Added pb-32 to lift visual center up (counteracts bottom bars).
        2. Reduced px-4 for more horizontal space.
      */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center px-4 pb-32 md:pb-0 md:px-[100px] overflow-hidden">
        {/* Dynamic Mesh Grid Background */}
        <InteractiveGrid />
        
        {/* Morphing Dots Layer - MOBILE ONLY (Behind text) */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 mix-blend-multiply z-0 pb-32">
           <DotMorph progress={progress} />
        </div>
        
        <div className="container mx-auto relative z-10 w-full flex items-center justify-center h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full lg:h-auto gap-0 lg:gap-12 items-center">
            
            {/* Left Content: Animated Phrases AND Final Text */}
            <div className="relative h-full lg:h-[400px] flex items-center justify-center lg:justify-start font-poppins w-full">
              
              {/* 1. Animated Phrases */}
              {INTRO_PHRASES.map((phrase, i) => {
                const phraseStartP = (i / INTRO_PHRASES.length) * sideTextTrigger;
                const phraseEndP = ((i + 1) / INTRO_PHRASES.length) * sideTextTrigger;
                
                const isActive = i === activePhraseIndex;
                const isPast = progress > phraseEndP;
                const isFuture = progress < phraseStartP;

                if (isFuture) return null;

                const isLastPhrase = i === INTRO_PHRASES.length - 1;
                
                let flyX = 0;
                let flyY = 0;
                let rotation = 0;
                let blur = 0;
                
                if (isPast && !isLastPhrase) {
                    const postActiveProgress = (progress - phraseEndP) / (1 - phraseEndP);
                    
                    // Generate deterministic random values based on index
                    const seed = (i + 1) * 999.99;
                    const r1 = Math.abs(Math.sin(seed)); // 0 to 1
                    const r2 = Math.abs(Math.cos(seed * 0.7)); // 0 to 1
                    
                    // Trajectory logic
                    const minAngle = -70;
                    const maxAngle = 15;
                    const angleSpread = maxAngle - minAngle; 
                    const randomAngle = (r1 * angleSpread) + minAngle; 
                    
                    const randomSpeed = 1500 + (r2 * 1200);

                    const angle = isNightTime 
                      ? ((i * 224.7) % angleSpread) + minAngle 
                      : randomAngle;

                    const speed = isNightTime 
                      ? 2200 + (i % 5) * 800 
                      : randomSpeed;

                    const magnitude = Math.pow(postActiveProgress, isNightTime ? 0.5 : 0.6) * speed;
                    
                    const rad = (angle - 90) * (Math.PI / 180); 
                    flyX = Math.cos(rad) * magnitude;
                    flyY = Math.sin(rad) * magnitude;
                    
                    rotation = isNightTime 
                      ? angle * postActiveProgress * 2.5 
                      : angle * postActiveProgress * 0.5;

                    if (isNightTime) {
                      blur = postActiveProgress * 8;
                    }
                }

                let opacity = 1;
                
                if (isActive) {
                    if (isLastPhrase) {
                        // Fade out the last phrase as the new text fades in
                        opacity = 1 - sideTextOpacity;
                    } else {
                        opacity = 1;
                    }
                } else if (isPast) {
                     if (isLastPhrase) {
                        opacity = 1 - sideTextOpacity;
                     } else {
                        opacity = Math.max(0, 1 - (progress - phraseEndP) * (isNightTime ? 20 : 15));
                     }
                }

                const color = isActive ? 'text-black' : isLastPhrase ? 'text-black' : 'text-gray-400';
                const fontWeight = isActive || (isLastPhrase && progress > phraseEndP) ? '700' : '400';

                return (
                  <div
                    key={i}
                    className={`absolute transition-colors duration-300 ease-out whitespace-nowrap tracking-tight ${color} pointer-events-none w-full flex items-center justify-center lg:justify-start text-center lg:text-left`}
                    style={{
                      transform: `translate(${flyX}px, ${flyY}px) rotate(${rotation}deg)`,
                      opacity: opacity,
                      filter: `blur(${blur}px)`,
                      fontWeight: fontWeight,
                      fontSize: baseFontSize,
                      top: '50%',
                      marginTop: '-0.5em',
                      transformOrigin: 'center center',
                      zIndex: isActive ? 20 : 10 - i,
                      // Ensure it covers full width for centering
                      left: 0,
                      right: 0
                    }}
                  >
                    <span>{phrase.toLowerCase()}</span>
                  </div>
                );
              })}

              {/* 2. Final Reveal Text & CTA */}
              <div 
                className="absolute inset-0 z-30 w-full pointer-events-none"
              >
                  {/* Desktop Layout: Left Aligned, Centered Vertically via Flex */}
                  <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-start space-y-10 w-full pointer-events-auto">
                      <h2 
                        className="font-bold text-left font-poppins text-black leading-[1.05]"
                        style={{ 
                            opacity: sideTextOpacity,
                            transform: `translateY(${(1 - sideTextOpacity) * 40}px)`,
                            fontSize: baseFontSize
                        }}
                      >
                        Great ideas deserve<br />great execution.
                      </h2>
                      
                      <button 
                        onClick={() => onNavigate('contact')}
                        className="bg-white text-black border-2 border-black px-16 py-8 rounded-full flex items-center gap-6 hover:bg-black hover:text-white transition-all group shadow-xl font-mono-jp"
                        style={{ 
                            opacity: buttonOpacity,
                            transform: `translateY(${(1 - buttonOpacity) * 40}px)`
                        }}
                      >
                        <span className="text-xl font-bold tracking-tight">Start Project</span>
                        <ArrowUpRight size={32} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                  </div>

                  {/* Mobile Layout: Text Absolute Center, Button Below */}
                  <div className="lg:hidden absolute inset-0 w-full h-full pointer-events-none">
                      {/* Mobile H2 - Absolutely Centered */}
                      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-center pointer-events-auto">
                           <h2 
                               className="font-bold text-center font-poppins text-black leading-[1.05]"
                               style={{ 
                                   opacity: sideTextOpacity,
                                   transform: `translateY(${(1 - sideTextOpacity) * 40}px)`,
                                   fontSize: baseFontSize
                               }}
                           >
                               Great ideas deserve<br />great execution.
                           </h2>
                      </div>

                      {/* Mobile Button - Positioned below center */}
                      <div className="absolute top-1/2 left-0 w-full pt-32 flex justify-center pointer-events-auto">
                           {/* Reduced mobile button padding (px-8 py-4), font size (text-base), icon size (24) */}
                           <button 
                               onClick={() => onNavigate('contact')}
                               className="bg-white text-black border-2 border-black px-8 py-4 rounded-full flex items-center gap-4 hover:bg-black hover:text-white transition-all group shadow-xl font-mono-jp"
                               style={{ 
                                   opacity: buttonOpacity,
                                   transform: `translateY(${(1 - buttonOpacity) * 40}px)`
                               }}
                           >
                               <span className="text-base font-bold tracking-tight">Start Project</span>
                               <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                           </button>
                      </div>
                  </div>
              </div>

            </div>

            {/* Right Column: Desktop Dots (Placed here to be beside text) */}
            <div className="hidden lg:flex h-full w-full items-center justify-center relative">
               <div className="w-full h-[60vh] relative">
                  <DotMorph progress={progress} />
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};