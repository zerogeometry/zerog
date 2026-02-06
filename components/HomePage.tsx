import React, { useRef, useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { ServicesSection } from './ServicesSection';
import { IntroScrollSection } from './IntroScrollSection';
import { WorkMosaic } from './WorkMosaic';
import { BlackHoleCanvas } from './BlackHoleCanvas';
import { ArrowUpRight } from 'lucide-react';
import { PageView } from '../types';

const REELS = [
  { 
    id: 1, 
    title: '', 
    tags: ['Motion Video', 'Projection Mapping'], 
    // Requested Hero: premium placeholder_00000.png
    img: 'https://lh3.googleusercontent.com/d/1bFfCApp6HY28oI5fWXZ0qk_HtHg7gFSH'
  },
  { 
    id: 2, 
    title: 'Neon Horizons', 
    tags: ['Web Experience', 'Creative Tech'], 
    // new premium placeholder_00005.png
    img: 'https://lh3.googleusercontent.com/d/1pwanPCzZ1qxDcc9pKXCQqGDGJZysmJcG'
  },
  { 
    id: 3, 
    title: 'Abstract Flow', 
    tags: ['Brand Identity', '3D Design'], 
    // premium placeholder_00006.png
    img: 'https://lh3.googleusercontent.com/d/1DzY7lHG2a7VvqNqPeqygEHaIZ5p0Z5B0'
  },
  { 
    id: 4, 
    title: 'Geometric Harmony', 
    tags: ['Typography', 'Motion'], 
    // new premium placeholder_00004.png
    img: 'https://lh3.googleusercontent.com/d/16oqETDgUYe5u1b8PZanPf75Z2uuZC4MX'
  },
  { 
    id: 5, 
    title: 'Dark Matter', 
    tags: ['Art Direction', 'Campaign'], 
    // premium placeholder_00003.png
    img: 'https://lh3.googleusercontent.com/d/19mUYMcAYKncjHoiV0p7UfcxFKicuOMeL'
  },
  { 
    id: 6, 
    title: 'Echo Chamber', 
    tags: ['Digital', 'Sound Design'], 
    // new premium placeholder_00000.png
    img: 'https://lh3.googleusercontent.com/d/1ddDhmsPFDxTLyve-1A1Fgpy0xfnIv-fP'
  },
];

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State for separate control of video appearing and image disappearing
  const [videoInitialized, setVideoInitialized] = useState(false);
  const [imageVisible, setImageVisible] = useState(true);

  useEffect(() => {
    // Trigger fade in after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoad = () => {
    // Give Vimeo a moment to buffer and start playing before revealing it
    // Increased to 2000ms to ensure playback has started to avoid black frame
    setTimeout(() => {
      setVideoInitialized(true);
    }, 2000);
  };

  useEffect(() => {
    if (videoInitialized) {
      // Wait for the video to partially fade in before starting to fade out the image
      // This overlap prevents the "dip to black" or brightness drop
      const timer = setTimeout(() => {
        setImageVisible(false);
      }, 1200); // 1.2s overlap: Video fades in (1s duration), then image fades out
      return () => clearTimeout(timer);
    }
  }, [videoInitialized]);

  // Using slice to skip the first item if it was only for hero, 
  // but keeping REELS[0] structure if needed elsewhere.
  // We will simply use the ID provided for the hero video.
  const HERO_VIDEO_ID = '1161560038';
  const remainingReels = REELS.slice(1);

  return (
    <div 
      ref={scrollContainerRef}
      className="bg-[#0a0a0a] h-screen w-full overflow-y-scroll snap-y snap-mandatory font-sans selection:bg-white selection:text-black scroll-smooth cursor-none"
    >
      {/* Black Fade-In Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a] z-[10000] pointer-events-none transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />

      <Navigation onNavigate={onNavigate} scrollContainerRef={scrollContainerRef} />
      
      {/* 1. Hero Reel Landing Section */}
      {/* Set height to exact 100dvh (dynamic viewport height) and removed sticky positioning to allow immediate scroll to next section */}
      <section className="snap-start h-[100dvh] w-full relative group border-b border-white/20 overflow-hidden bg-[#0a0a0a] m-0 p-0">
        
        <div className="absolute inset-0 w-full h-full bg-black">
          
          {/* Placeholder Image (First Frame) */}
          <img 
             src={REELS[0].img} 
             alt="Hero Background"
             className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover 
                min-w-full min-h-full w-auto h-auto pointer-events-none z-0
                transition-opacity duration-1000 ease-in-out
                ${imageVisible ? 'opacity-100' : 'opacity-0'}
             `}
          />

          {/* Vimeo Background Video */}
          <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 transition-opacity duration-1000 ease-in-out ${videoInitialized ? 'opacity-100' : 'opacity-0'}`}>
            <iframe 
              src={`https://player.vimeo.com/video/${HERO_VIDEO_ID}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ 
                  width: '100vw', 
                  height: '56.25vw', /* Given a 16:9 aspect ratio */ 
                  minHeight: '100vh',
                  minWidth: '177.77vh', /* 16:9 aspect ratio (16/9 * 100vh) */
              }}
              onLoad={handleVideoLoad}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none z-20"></div>
        </div>
      </section>

      {/* 2. Intro Scroll Section */}
      <IntroScrollSection onNavigate={onNavigate} scrollContainerRef={scrollContainerRef} />

      {/* 3. Remaining Video Reels Section */}
      <div className="bg-[#0a0a0a]">
         {remainingReels.map((reel, index) => (
           <div 
             key={reel.id} 
             className="snap-center h-screen w-full relative group border-b border-white/20 last:border-0 overflow-hidden"
             data-cursor-hover="true"
             data-cursor-preview={reel.img}
           >
             <div className="absolute inset-0 w-full h-full">
               <img src={reel.img} alt={reel.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
             </div>
             
             {/* Content: Aligned to px-6 (24px) on mobile to match logo, 100px on desktop. Vertically centered. */}
             <div className="absolute inset-0 px-6 md:px-[100px] z-20 pointer-events-none mix-blend-difference flex flex-col justify-center items-start">
                <div className="max-w-4xl text-left">
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-3.5 tracking-tighter opacity-100 transition-all duration-700">
                      {reel.title}
                    </h3>
                    <div className="flex flex-wrap gap-2.5 opacity-100 transition-all duration-500 delay-100">
                        {reel.tags.map(tag => (
                        <span key={tag} className="border border-white/60 text-white rounded-full px-3.5 py-1 text-[9px] md:text-[10px] uppercase tracking-widest backdrop-blur-sm bg-white/10">
                            {tag}
                        </span>
                        ))}
                    </div>
                </div>
             </div>

             {/* Reel Indicator: Aligned to 100px Right Margin on desktop */}
             <div className="absolute top-1/2 right-4 md:right-[100px] transform -translate-y-1/2 rotate-90 origin-right mix-blend-difference">
                <span className="text-[10px] uppercase tracking-widest text-white/60">Reel 0{index + 2} / 0{REELS.length}</span>
             </div>
           </div>
         ))}
      </div>

      {/* Orbiting Services Section */}
      <ServicesSection onNavigate={onNavigate} scrollContainerRef={scrollContainerRef} />

      {/* Our Work Mosaic Grid */}
      <WorkMosaic onNavigate={onNavigate} />

      {/* Footer */}
      <footer className="snap-start h-screen relative bg-black text-white py-8 px-8 md:px-[100px] flex flex-col justify-between border-t border-white/10 overflow-hidden">
        {/* Black Hole Game Background */}
        <BlackHoleCanvas />

        <div className="container mx-auto flex-1 flex flex-col justify-center relative z-10 pointer-events-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div className="mb-8 md:mb-0 pointer-events-auto">
                <h2 className="text-4xl md:text-7xl font-medium mb-4 tracking-tighter mix-blend-difference">Join our<br />Community</h2>
                {/* Removed uppercase, keeping Title Case */}
                <button 
                  onClick={() => onNavigate('contact')}
                  className="mt-6 border border-white px-6 py-3 rounded-full text-xs tracking-widest hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-colors bg-black/50 backdrop-blur-sm"
                >
                    Start a Project
                </button>
            </div>
            <div className="flex flex-col items-start md:items-end text-right space-y-8 pointer-events-auto">
                <div className="flex flex-col items-start md:items-end text-base text-gray-400 space-y-1 mix-blend-difference">
                    <p>hello@zerogeometry.com</p>
                    <p>London, UK</p>
                </div>
                <div className="flex flex-col items-start md:items-end space-y-3 text-lg font-medium">
                <a href="https://www.linkedin.com/company/zero-geometry/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#ccff00] transition-colors">LinkedIn <ArrowUpRight size={18} /></a>
                </div>
            </div>
            </div>
        </div>
        <div className="container mx-auto pt-4 text-[10px] text-gray-500 flex justify-center items-center uppercase tracking-widest relative z-10 pointer-events-auto">
           <p>&copy; 2026 Zero Geometry</p>
        </div>
      </footer>
    </div>
  );
};