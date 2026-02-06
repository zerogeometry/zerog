import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import { InteractiveGrid } from './InteractiveGrid';

const SERVICES_DATA = [
  { 
    id: '1', 
    title: 'Brand Strategy', 
    desc: 'Discovering the authentic soul of your business to define a positioning that resonates, through rigorous market analysis, competitor landscaping, and archetypal mapping.',
    // new premium placeholder_00003.png
    img: 'https://lh3.googleusercontent.com/d/1tlXBpApTDxUb_JYX3jVRJXEu2h69kFh0' 
  },
  { 
    id: '2', 
    title: 'Brand Design', 
    desc: 'Crafting identities that sing to all senses, expressing your authentic brand personality through iconography, typography and storytelling.',
    // premium placeholder_00001.png
    img: 'https://lh3.googleusercontent.com/d/1xtJaO6OqHvtNXwYTOGQXUtXeois0sogT' 
  },
  { 
    id: '3', 
    title: 'Product Design', 
    desc: 'Designing physical items with precision and bringing them to market with creative campaigns, demonstrations, and modern immersive experiences.',
    // new premium placeholder_00002.png
    img: 'https://lh3.googleusercontent.com/d/139JuKvXqaLfpbdAbTtDzap1cyos9BYpF' 
  },
  { 
    id: '4', 
    title: 'Web Design & Build', 
    desc: 'High performance apps and websites which blend functional utility with motion-rich user experience. Engineered for resonance, engagement and retention.',
    // premium placeholder_00002.png
    img: 'https://lh3.googleusercontent.com/d/1dAKVlcZ_nVZjda8XpeZ11HU7JMbwRd3e' 
  },
  { 
    id: '5', 
    title: 'Graphics & Motion', 
    desc: 'Breathing life into brands with compelling visuals, gripping video storytelling, and impactful media and marketing assets.',
    // new premium placeholder_00001.png
    img: 'https://lh3.googleusercontent.com/d/1TdWoZFxnjb_3ZwvsJpFEGPHk9RbOMnuH' 
  },
  { 
    id: '6', 
    title: 'Content', 
    desc: 'Platforming your product, services and team to create new touchpoints, build trust, and strengthen your brand culture and community.',
    // premium placeholder_00005.png
    img: 'https://lh3.googleusercontent.com/d/1-GVp1BghAY8fom_2oeSbNMOoDj28qHo_' 
  },
];

interface ServicesSectionProps {
  onNavigate: (page: PageView) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigate, scrollContainerRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !scrollContainerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // We map the scroll progress through this section to the service index
      // The section is tall (400vh) to allow for scrolling through items
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Effective scrollable area is the height minus one viewport
        const scrollableHeight = rect.height - windowHeight;
        const scrolled = -rect.top; // How far we've scrolled into the section
        
        // Normalize to 0-1
        let progress = scrolled / scrollableHeight;
        progress = Math.max(0, Math.min(1, progress));
        
        const index = Math.min(SERVICES_DATA.length - 1, Math.floor(progress * SERVICES_DATA.length));
        setActiveIndex(index);
      }
    };

    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => scrollEl?.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[400vh] w-full bg-[#f3f4f6] snap-start"
    >
      {/* 
        Sticky Viewport - Switched to 100dvh for proper mobile vertical centering
        Mobile: pt-24 ensures content clears the top navigation logo area.
      */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-start pt-24 lg:pt-0 lg:justify-center overflow-hidden">
        {/* Background Grid */}
        <InteractiveGrid />
        
        {/* Main Layout Grid */}
        <div className="relative z-10 w-full h-full max-w-[1800px] mx-auto px-8 md:px-[60px] lg:px-[100px] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center content-start lg:content-normal">
          
          {/* Left Column: Vertically Centered Logo */}
          <div className="hidden lg:flex lg:col-span-2 h-full items-center justify-start">
             <div className="w-24 h-24 lg:w-48 lg:h-48">
                <Logo theme="dark" className="w-full h-full" />
             </div>
          </div>

          {/* Center Column: Rotating Services Menu */}
          {/* Mobile: Fixed height 100px to ensure stability. */}
          <div className="col-span-1 lg:col-span-5 h-[100px] lg:h-[60vh] relative flex items-center justify-center lg:justify-start z-0 -mt-2 lg:mt-0">
              <div className="relative w-full h-full pointer-events-none">
                  {SERVICES_DATA.map((service, i) => {
                      const offset = i - activeIndex; 
                      
                      // Rotation Logic:
                      const angleDeg = offset * 25;
                      const angleRad = angleDeg * (Math.PI / 180);
                      const radius = 350; 
                      
                      // Mobile: Reduced vertical spacing (35px)
                      const mobileSpacing = 35;
                      const x = isMobile ? 0 : (Math.cos(angleRad) * radius) - radius;
                      const y = isMobile ? offset * mobileSpacing : Math.sin(angleRad) * radius;
                      
                      // Visibility limits
                      if (Math.abs(offset) > 4) return null;

                      // Styles
                      const isActive = i === activeIndex;
                      const opacity = 1 - Math.abs(offset) * 0.25;
                      const scale = 1 - Math.abs(offset) * 0.1;
                      
                      return (
                           <div 
                              key={service.id}
                              className="absolute top-1/2 transition-all duration-500 ease-out flex items-center whitespace-nowrap justify-center lg:justify-start"
                              style={{
                                  // Mobile: Centered horizontally (left: 50%, translate-x: -50%)
                                  // Desktop: Aligned left (left: 12, translate-x: 0)
                                  left: isMobile ? '50%' : '3rem',
                                  transform: `translate(${x}px, ${y}px) translateY(-50%) translateX(${isMobile ? '-50%' : '0'}) scale(${scale})`,
                                  opacity: Math.max(0, opacity),
                                  zIndex: 10 - Math.abs(offset),
                                  // Enhance depth perception
                                  filter: isActive ? 'none' : 'blur(1px)'
                              }}
                           >
                              <span 
                                className={`
                                  font-poppins font-bold tracking-tighter transition-colors duration-300
                                  ${isActive ? 'text-2xl lg:text-6xl text-black' : 'text-xl lg:text-5xl text-gray-400'}
                                `}
                              >
                                  {service.title}
                              </span>
                           </div>
                      );
                  })}
              </div>
          </div>

          {/* Right Column: Reel UI, Description, Button */}
          {/* Replaced justify-between with flex-col + gap to ensure fixed positioning */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-start items-center lg:items-start lg:pl-12 w-full z-20 relative mt-6 lg:mt-0">
             
             {/* Reel Container (16:9) - Fixed Aspect Ratio */}
             <div className="w-full aspect-video bg-black/5 rounded-lg overflow-hidden border border-black/10 relative shadow-2xl group bg-[#f3f4f6]">
                  {SERVICES_DATA.map((s, i) => (
                      <div 
                        key={s.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      >
                         <img 
                           src={s.img} 
                           alt={s.title}
                           className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                      </div>
                  ))}
             </div>

             {/* Description - Fixed Height Container */}
             {/* Fixed at 140px mobile / 160px desktop to prevent layout shifts. Overflow hidden implies no scrolling. */}
             <div className="h-[140px] lg:h-[160px] w-full flex flex-col items-center lg:items-start text-center lg:text-left mt-6 lg:mt-8 justify-start">
                  <h3 className="hidden lg:block text-2xl font-bold mb-3 text-black font-poppins">{SERVICES_DATA[activeIndex].title}</h3>
                  
                  <p className="text-sm lg:text-base text-gray-700 font-mono leading-relaxed max-w-lg lg:border-l-2 pl-0 lg:pl-4 border-black/20">
                      {SERVICES_DATA[activeIndex].desc}
                  </p>
             </div>

             {/* CTA Button - Fixed Position via Parent Flow */}
             <div className="mt-2 lg:mt-0">
                 <button 
                   className="px-10 lg:px-12 py-4 lg:py-5 bg-white border border-black text-black text-sm lg:text-sm font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                   onClick={() => onNavigate('contact')}
                 >
                    Make an Appointment
                 </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};