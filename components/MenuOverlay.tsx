import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { PageView } from '../types';
import { InteractiveGrid } from './InteractiveGrid';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageView) => void;
}

const MENU_ITEMS: { label: string; key: PageView; img: string }[] = [
  // premium placeholder_00006.png
  { label: 'About', key: 'about', img: 'https://lh3.googleusercontent.com/d/1DzY7lHG2a7VvqNqPeqygEHaIZ5p0Z5B0' },
  // new premium placeholder_00004.png
  { label: 'Our Services', key: 'services', img: 'https://lh3.googleusercontent.com/d/16oqETDgUYe5u1b8PZanPf75Z2uuZC4MX' },
  // new premium placeholder_00001.png
  { label: 'Contact', key: 'contact', img: 'https://lh3.googleusercontent.com/d/1TdWoZFxnjb_3ZwvsJpFEGPHk9RbOMnuH' },
];

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col animate-in fade-in duration-500 overflow-hidden">
      
      {/* Dynamic Background Image Layers */}
      {MENU_ITEMS.map((item) => (
         <div 
            key={item.key}
            className={`absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none ${hoveredImage === item.img ? 'opacity-40' : 'opacity-0'}`}
         >
            <img 
              src={item.img} 
              alt="" 
              className="w-full h-full object-cover grayscale opacity-60 scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
         </div>
      ))}

      {/* Grid overlay for texture - Low opacity to blend with images */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <InteractiveGrid />
      </div>

      {/* Header */}
      <div className="relative z-50 flex justify-between items-start p-8 md:p-14">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20">
              <Logo theme="light" className="w-full h-full" />
            </div>
            <h1 className="text-xl md:text-3xl font-poppins font-light tracking-wide uppercase hidden md:block opacity-80">
                ZERO <span className="font-semibold">GEOMETRY</span>
            </h1>
         </div>
         <button 
            onClick={onClose} 
            className="hover:rotate-90 transition-transform duration-500 p-2 text-white hover:text-[#ccff00]"
         >
            <X size={40} strokeWidth={1} />
         </button>
      </div>

      {/* Main Content */}
      <div className="relative z-40 flex-1 flex flex-col md:flex-row px-8 md:px-[100px] pb-8 md:pb-14">
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6">
          {MENU_ITEMS.map((item, index) => (
            <button 
              key={item.key} 
              className="group text-left relative block w-full md:w-auto"
              onClick={() => {
                onNavigate(item.key);
                onClose();
              }}
              onMouseEnter={() => setHoveredImage(item.img)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="flex items-baseline gap-6 md:gap-8">
                {/* Number */}
                <span className="text-xs md:text-sm font-mono text-gray-500 group-hover:text-[#ccff00] transition-colors duration-300">
                  0{index + 1}
                </span>
                
                {/* Text - Solid White */}
                <span 
                  className="text-5xl md:text-8xl font-poppins font-bold uppercase tracking-tighter transition-all duration-300 group-hover:translate-x-4 text-white group-hover:text-[#ccff00]"
                >
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </nav>

        {/* Sidebar Info & Secondary Actions */}
        <div className="md:w-1/3 flex flex-col justify-end items-start md:items-end space-y-12 text-left md:text-right pt-12 md:pt-0 md:border-l border-white/10 md:pl-12">
            
            <div className="flex flex-col space-y-6 items-start md:items-end w-full">
                <button 
                  className="text-xl md:text-2xl font-poppins font-light text-white hover:text-[#ccff00] transition-colors flex items-center gap-3 group w-full md:w-auto justify-start md:justify-end" 
                  onClick={() => {
                    onNavigate('booking');
                    onClose();
                  }}
                >
                  Book Appointment <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
                <a href="https://www.linkedin.com/company/zero-geometry/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
        </div>
      </div>
    </div>
  );
};