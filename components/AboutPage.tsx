import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] text-white overflow-hidden z-40 animate-in fade-in duration-500 flex flex-col">
      {/* Background Effect - Removed BlackHoleCanvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0f0f] to-black opacity-50" />
      </div>

      <button 
        onClick={onBack}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors mix-blend-difference"
      >
        <X size={32} className="text-white" />
      </button>
      
      {/* Content Container - Relative z-10 to sit above background */}
      {/* Mobile: Scrollable area. Desktop: Remains scrollable inside this flex child */}
      <div className="flex-1 overflow-y-auto relative z-10 w-full">
          <div className="max-w-5xl mx-auto pt-16 md:pt-20 pb-20 p-6 md:p-16">
            <div className="w-16 h-16 md:w-24 md:h-24 mb-8 md:mb-12">
              <Logo theme="light" className="w-full h-full" />
            </div>
            
            {/* Title Section */}
            <h1 className="text-4xl md:text-7xl mb-8 md:mb-12 font-poppins leading-tight">
              <span className="font-normal block">ABOUT</span>
              <span className="font-extralight tracking-tight">ZERO</span> <span className="font-normal tracking-tight">GEOMETRY</span>
            </h1>
            
            {/* Main Body Text */}
            <div className="space-y-6 md:space-y-8 text-sm md:text-lg text-gray-400 font-mono leading-relaxed max-w-4xl backdrop-blur-sm md:backdrop-blur-none bg-black/40 md:bg-transparent p-6 md:p-0 rounded-xl md:rounded-none border border-white/10 md:border-0">
              <p className="text-white font-medium">
                Great ideas deserve great execution.
              </p>
              <p>
                Founded in 2021 and reimagined in 2025, Zero Geometry emerged from a passion to help great ideas, brands and products flourish.
              </p>
              <p>
                We don't see limits - we are inventors and visionaries. A team of creative strategists, designers, storytellers, and digital transformation experts who are committed to turning bold ideas into unforgettable brands and experiences.
              </p>
              <p>
                Whether you're a startup establishing your business identity, or an enterprise launching a new product, we're here to help you achieve the extraordinary, with vision, precision and soul.
              </p>

              {/* Pillars Grid */}
              <div className="pt-10 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-white/10 mt-8 md:mt-12">
                 <div className="space-y-3 md:space-y-4">
                    <h3 className="text-white font-poppins font-bold text-lg md:text-xl tracking-wide">VISION</h3>
                    <p className="text-xs md:text-sm leading-relaxed text-gray-500">
                      As serial creatives and innovators, we know what it takes to launch impactful, memorable brands, products and campaigns.
                    </p>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <h3 className="text-white font-poppins font-bold text-lg md:text-xl tracking-wide">PRECISION</h3>
                    <p className="text-xs md:text-sm leading-relaxed text-gray-500">
                      We apply industry-leading project, brand and design frameworks to drive efficiency and engineer outstanding results without the fluff.
                    </p>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <h3 className="text-white font-poppins font-bold text-lg md:text-xl tracking-wide">SOUL</h3>
                    <p className="text-xs md:text-sm leading-relaxed text-gray-500">
                      Decades of experience bless us with deep understanding of how to apply technology without compromising human authenticity.
                    </p>
                 </div>
              </div>
            </div>
          </div>
      </div>

      {/* Fixed Footer (Mobile Only) */}
      <div className="md:hidden p-6 pt-4 pb-8 border-t border-white/10 bg-[#0a0a0a] shrink-0 z-50">
         <button className="w-full bg-white text-black font-bold py-4 rounded-full flex justify-between items-center px-8">
            <span>Start Project</span>
            <ArrowUpRight size={20} />
         </button>
      </div>
    </div>
  );
};