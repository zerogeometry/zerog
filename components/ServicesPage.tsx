import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

interface ServicesPageProps {
  onBack: () => void;
  initialServiceId?: string | null;
}

interface SubService {
  name: string;
  description: string;
}

interface ServiceData {
  id: string;
  title: string;
  description: string;
  image: string;
  subservices: SubService[];
}

const SERVICES_DATA: ServiceData[] = [
  {
    id: '01',
    title: 'Brand',
    description: 'Discovering the soul and DNA of your business',
    image: 'https://lh3.googleusercontent.com/d/1xtJaO6OqHvtNXwYTOGQXUtXeois0sogT',
    subservices: [
      { name: 'Brand Strategy & Research', description: 'Data-driven insights to define your market position, target audience, and long-term roadmap for growth.' },
      { name: 'Brand Positioning', description: 'Strategic alignment of your offering to stand out, capture market share, and dominate your niche.' },
      { name: 'Visual Identity Systems', description: 'Distinctive logos, typography, and design frameworks that make your brand instantly recognizable.' },
      { name: 'Verbal Identity & Narrative', description: 'Compelling messaging, tone of voice, and brand stories that resonate deeply with your ideal customers.' },
      { name: 'Rebranding', description: 'Strategic brand evolution to help you pivot, modernize, and reignite growth in a crowded landscape.' }
    ]
  },
  {
    id: '02',
    title: 'Product',
    description: 'Design excellence in the physical and digital worlds',
    image: 'https://lh3.googleusercontent.com/d/139JuKvXqaLfpbdAbTtDzap1cyos9BYpF',
    subservices: [
      { name: 'UX/UI & Prototyping', description: 'Intuitive interfaces and interactive prototypes that validate ideas and guarantee seamless user journeys.' },
      { name: 'Product Visualization & Demos', description: 'Stunning 3D renders and interactive demos that clearly communicate your product\'s value before launch.' },
      { name: 'Spatial & Exhibition Design', description: 'Immersive physical environments and booth designs that captivate audiences and drive in-person engagement.' },
      { name: 'Go-To-Market Assets', description: 'High-converting pitch decks, sales materials, and launch collateral designed to accelerate adoption.' }
    ]
  },
  {
    id: '03',
    title: 'Web',
    description: 'Engineered for resonance, engagement and retention',
    image: 'https://lh3.googleusercontent.com/d/1dAKVlcZ_nVZjda8XpeZ11HU7JMbwRd3e',
    subservices: [
      { name: 'UI/UX', description: 'Frictionless, beautifully crafted web interfaces engineered to maximize user engagement and conversions.' },
      { name: 'Full-Stack Development & CMS', description: 'Robust, scalable web builds and seamless content management systems tailored to your business operations.' },
      { name: 'Immersive Web (WebGL & 3D)', description: 'Cutting-edge, interactive 3D web experiences that captivate users and set you apart from competitors.' },
      { name: 'AI Agents & Automation', description: 'Intelligent tools and automated workflows that streamline operations and elevate your customer support.' },
      { name: 'Technical SEO & Performance', description: 'Optimized site speeds and search architectures that guarantee top-tier visibility and organic traffic.' }
    ]
  },
  {
    id: '04',
    title: 'Media',
    description: 'Visual storytelling and immersive experiences',
    image: 'https://lh3.googleusercontent.com/d/1TdWoZFxnjb_3ZwvsJpFEGPHk9RbOMnuH',
    subservices: [
      { name: 'Creative & Art Direction', description: 'High-level aesthetic leadership to ensure all your visual touchpoints align with your core brand vision.' },
      { name: 'Video & Motion Design', description: 'Cinematic video production and dynamic animations that tell your story and capture audience attention.' },
      { name: 'Campaign & Content Production', description: 'High-impact digital and print assets designed to fuel your marketing campaigns and drive real action.' },
      { name: 'Immersive & Experiential Media', description: 'Boundary-pushing AR, VR, and projection mapping that turn passive viewers into active participants.' }
    ]
  }
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBack, initialServiceId }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  // New State for Subservice Interactions
  const [hoveredSubservice, setHoveredSubservice] = useState<SubService | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (initialServiceId) {
      const index = SERVICES_DATA.findIndex(s => s.id === initialServiceId);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [initialServiceId]);

  // Reset interaction states when activeIndex changes
  useEffect(() => {
     setExpandedIndices([]);
     setHoveredSubservice(null);
  }, [activeIndex]);

  const toggleExpansion = (index: number) => {
    setExpandedIndices(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Handle Scroll / Wheel Navigation (Desktop)
  const handleWheel = useCallback((e: WheelEvent) => {
    const now = Date.now();
    // Throttle scroll events to prevent skipping too fast (500ms cooldown)
    if (now - lastScrollTime < 500) return;

    if (e.deltaY > 20) {
      setActiveIndex(prev => (prev + 1) % SERVICES_DATA.length);
      setLastScrollTime(now);
    } else if (e.deltaY < -20) {
      setActiveIndex(prev => (prev - 1 + SERVICES_DATA.length) % SERVICES_DATA.length);
      setLastScrollTime(now);
    }
  }, [lastScrollTime]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Swipe Handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
       setActiveIndex(prev => (prev + 1) % SERVICES_DATA.length);
    }
    if (isRightSwipe) {
       setActiveIndex(prev => (prev - 1 + SERVICES_DATA.length) % SERVICES_DATA.length);
    }
  }

  const activeService = SERVICES_DATA[activeIndex];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0a] text-white overflow-hidden z-40 animate-in fade-in duration-500 flex flex-col md:flex-row">
      
      {/* Mobile Close / Header (Only visible on small screens) */}
      <div className="md:hidden absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
         <div className="w-10 h-10 pointer-events-auto">
            <Logo theme="light" className="w-full h-full" />
         </div>
         <button onClick={onBack} className="p-2 bg-white/10 rounded-full pointer-events-auto">
            <X size={20} />
         </button>
      </div>

      {/* Close Button Desktop */}
      <button 
        onClick={onBack} 
        className="hidden md:block fixed top-8 right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors group"
      >
        <X size={32} className="group-hover:rotate-90 transition-transform duration-300 mix-blend-difference" />
      </button>

      {/* MOBILE: Fixed Layout Container */}
      {/* 
         Structure for Mobile (Flex Col):
         1. Spacer for Header (mt-20)
         2. Carousel Container (Fixed Height)
         3. Description Container (Dynamic Height with Padding)
         4. List Container (Flex-1, Scrollable)
         5. Button Container (Fixed Height)
      */}
      <div className="md:hidden flex flex-col w-full h-full pt-20">
          
          {/* CAROUSEL (Fixed Position/Size) */}
          {/* Reduced height to 15vh and padding. Added Swipe handlers. */}
          <div 
             className="relative h-[15vh] min-h-[100px] w-full flex items-center justify-center border-b border-white/10 bg-[#0a0a0a] z-30 shrink-0 touch-pan-y"
             onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}
             onTouchEnd={onTouchEnd}
          >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                 {SERVICES_DATA.map((service, index) => {
                    const len = SERVICES_DATA.length;
                    let offset = (index - activeIndex + len) % len;
                    if (offset > len / 2) offset -= len;
                    if (offset < -len / 2) offset += len;

                    if (Math.abs(offset) > 1) return null;

                    return (
                       <button 
                         key={service.id}
                         onClick={() => setActiveIndex(index)}
                         className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out flex flex-col items-center justify-center"
                         style={{
                           transform: `translate(calc(-50% + ${offset * 140}px), -50%) scale(${1 - Math.abs(offset) * 0.2})`,
                           opacity: 1 - Math.abs(offset) * 0.6,
                           zIndex: 10 - Math.abs(offset),
                           width: '160px'
                         }}
                       >
                         <span className={`text-xs font-mono mb-1 transition-colors duration-300 ${index === activeIndex ? 'text-[#ccff00]' : 'text-gray-500'}`}>
                            {service.id}
                         </span>
                         <span className={`text-2xl font-poppins font-bold uppercase tracking-tighter transition-colors duration-300 ${index === activeIndex ? 'text-white' : 'text-gray-600'}`}>
                            {service.title}
                         </span>
                       </button>
                    );
                 })}
              </div>
          </div>

          {/* DESCRIPTION (Dynamic Height with Padding) */}
          {/* Replaced fixed height with py-6 for increased spacing */}
          <div className="flex items-center justify-center py-6 shrink-0 px-8 bg-[#0a0a0a]">
             <p key={activeService.id} className="text-sm font-light text-gray-300 leading-tight animate-in fade-in duration-300 text-center max-w-xs line-clamp-2">
                 {activeService.description}
             </p>
          </div>

          {/* SUBSERVICES (Scrollable) */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-6 bg-[#0a0a0a]">
              <div className="space-y-0 w-full pb-4">
                  {activeService.subservices.map((sub, i) => (
                      <div 
                        key={`${activeService.id}-${i}`} 
                        className="border-b border-white/10 animate-in slide-in-from-right-4 fade-in duration-500"
                        style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                      >
                          <div 
                              className="py-3 flex justify-between items-center group/item cursor-pointer"
                              onClick={() => toggleExpansion(i)}
                          >
                              <span className={`text-sm font-light transition-colors duration-300 ${expandedIndices.includes(i) ? 'text-white' : 'text-gray-500'}`}>
                                  {sub.name}
                              </span>
                              <div className={`w-1 h-1 rounded-full bg-[#ccff00] transition-opacity duration-300 ${expandedIndices.includes(i) ? 'opacity-100' : 'opacity-50'}`} />
                          </div>
                          
                          {/* Expanded Content */}
                          {expandedIndices.includes(i) && (
                              <div className="pb-4 pr-4 text-xs text-gray-400 font-mono leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300">
                                  {sub.description}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>

          {/* BUTTON (Fixed Bottom) */}
          <div className="p-6 pt-4 pb-8 border-t border-white/10 bg-[#0a0a0a] shrink-0">
             <button className="w-full bg-white text-black font-bold py-4 rounded-full flex justify-between items-center px-8">
                <span>Start Project</span>
                <ArrowUpRight size={20} />
             </button>
          </div>
      </div>


      {/* COLUMN 1: CATEGORY TITLES (Left 1/3) - DESKTOP ONLY */}
      <div className="hidden md:flex w-full md:w-1/3 h-full border-r border-white/10 flex-col relative bg-[#0a0a0a] z-20">
         
         {/* Desktop Logo */}
         <div className="hidden md:block absolute top-8 left-12 w-16 h-16">
            <Logo theme="light" className="w-full h-full" />
         </div>

         {/* Navigation List */}
         {/* Increased padding from pl-20 pr-12 to pl-28 pr-12 for more left space */}
         <div className="flex-1 flex flex-col justify-center pl-28 pr-12 gap-4 overflow-hidden relative z-10">
             {SERVICES_DATA.map((service, index) => {
                 const isActive = index === activeIndex;
                 return (
                     <button 
                        key={service.id}
                        onClick={() => setActiveIndex(index)}
                        className={`relative flex items-baseline text-left group/item w-full transition-transform duration-500 ease-out ${isActive ? 'translate-x-8' : 'hover:translate-x-4'}`}
                     >
                        <div className="flex items-baseline gap-6">
                             <span className={`font-mono text-sm transition-colors duration-300 ${isActive ? 'text-[#ccff00]' : 'text-gray-600 group-hover/item:text-[#ccff00]'}`}>
                                {service.id}
                             </span>
                             <span className={`font-poppins font-bold text-6xl uppercase tracking-tighter transition-all duration-300 ${isActive ? 'text-white scale-105 origin-left' : 'text-gray-600 group-hover/item:text-gray-300'}`}>
                                {service.title}
                             </span>
                        </div>
                     </button>
                 );
             })}
         </div>

         {/* Scroll Indicator */}
         <div className="hidden md:flex p-12 text-xs font-mono text-gray-600 gap-2 items-center">
            <div className="w-1 h-1 bg-[#ccff00] rounded-full animate-pulse" />
            SCROLL TO EXPLORE
         </div>
      </div>

      {/* COLUMN 2: VISUALS (Middle 1/3) - DESKTOP ONLY (Image Removed on Mobile) */}
      <div className="hidden md:block w-full md:w-1/3 h-full border-r border-white/10 relative overflow-hidden group bg-black">
          
          {/* Animated Image Layer */}
          <div className="absolute inset-0 w-full h-full">
               {SERVICES_DATA.map((service, index) => (
                   <div 
                     key={service.id}
                     className={`
                        absolute inset-0 transition-opacity duration-700 ease-in-out
                        ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                     `}
                   >
                       {/* Full Color Image */}
                       <img 
                          src={service.image} 
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                       />
                       
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none" />
                   </div>
               ))}
          </div>

          {/* Description Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 z-20 pointer-events-none">
               <div className="overflow-hidden w-full">
                   <p key={activeService.id} className="text-sm md:text-base lg:text-lg xl:text-xl font-light text-gray-200 animate-in slide-in-from-bottom-4 duration-500 fade-in whitespace-nowrap tracking-tight overflow-hidden text-ellipsis">
                       {activeService.description}
                   </p>
               </div>
          </div>
      </div>

      {/* COLUMN 3: DETAILS (Right 1/3) - DESKTOP ONLY SECTION (Mobile uses the separate structure above) */}
      <div className="hidden md:flex w-full md:w-1/3 flex-1 md:h-full flex-col bg-[#0a0a0a]">
          {/* Increased md:px-32 to md:px-40 for more side padding */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8 md:px-40 md:py-12 flex flex-col justify-start md:justify-center">
              
              <div className="space-y-0 w-full">
                  {activeService.subservices.map((sub, i) => (
                      <div 
                        key={`${activeService.id}-${i}`} 
                        className="py-3 md:py-4 border-b border-white/10 flex justify-between items-center group/item animate-in slide-in-from-right-4 fade-in duration-500 cursor-default"
                        style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                        onMouseEnter={() => setHoveredSubservice(sub)}
                        onMouseLeave={() => setHoveredSubservice(null)}
                      >
                          <span className={`text-sm md:text-base font-light transition-colors duration-300 ${hoveredSubservice?.name === sub.name ? 'text-white' : 'text-gray-500 group-hover/item:text-white'}`}>
                              {sub.name}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full bg-[#ccff00] transition-opacity duration-300 ${hoveredSubservice?.name === sub.name ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`} />
                      </div>
                  ))}
              </div>

              {/* Description Container */}
              {/* 
                  Updated:
                  - Removed border/bg (transparent)
                  - Increased top margin (mt-16)
                  - Fixed height (h-[100px]) to prevent layout shift
                  - Removed padding (p-0) to align with text
              */}
              <div className="mt-16 h-[100px] flex items-start transition-all duration-300">
                  {hoveredSubservice ? (
                      <p className="text-sm text-gray-300 animate-in fade-in slide-in-from-top-1 duration-200 font-mono leading-relaxed">
                          {hoveredSubservice.description}
                      </p>
                  ) : (
                      <p className="text-sm text-gray-600 italic font-mono">
                          Hover over a service to learn more.
                      </p>
                  )}
              </div>

          </div>

          {/* Added pb-12 for mobile padding. Updated md:px-32 to md:px-40 to match list. */}
          <div className="p-6 pb-12 md:p-8 md:px-40 md:py-12 border-t border-white/10 mt-auto shrink-0">
             {/* Updated Button: Rounded full, removed uppercase, removed wide tracking */}
             <button className="w-full bg-white text-black font-bold py-4 md:py-6 rounded-full hover:bg-[#ccff00] transition-colors flex justify-between items-center px-8 group">
                <span>Start Project</span>
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>
      </div>

    </div>
  );
};