import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

interface WorkPageProps {
  onBack: () => void;
}

const WORK_ITEMS = [
  // new premium placeholder_00005.png
  { title: 'Neon Horizons', cat: 'Digital Experience', img: 'https://lh3.googleusercontent.com/d/1pwanPCzZ1qxDcc9pKXCQqGDGJZysmJcG' },
  // premium placeholder_00006.png
  { title: 'Abstract Flow', cat: 'Brand Identity', img: 'https://lh3.googleusercontent.com/d/1DzY7lHG2a7VvqNqPeqygEHaIZ5p0Z5B0' },
  // new premium placeholder_00004.png
  { title: 'Geometric Harmony', cat: 'Product Design', img: 'https://lh3.googleusercontent.com/d/16oqETDgUYe5u1b8PZanPf75Z2uuZC4MX' },
  // premium placeholder_00002.png
  { title: 'System Core', cat: 'Motion Graphics', img: 'https://lh3.googleusercontent.com/d/1dAKVlcZ_nVZjda8XpeZ11HU7JMbwRd3e' },
  // new premium placeholder_00001.png
  { title: 'Type Theory', cat: 'Web Development', img: 'https://lh3.googleusercontent.com/d/1TdWoZFxnjb_3ZwvsJpFEGPHk9RbOMnuH' },
  // new premium placeholder_00000.png
  { title: 'Echo Chamber', cat: 'Campaign', img: 'https://lh3.googleusercontent.com/d/1ddDhmsPFDxTLyve-1A1Fgpy0xfnIv-fP' },
];

export const WorkPage: React.FC<WorkPageProps> = ({ onBack }) => {
    return (
        <div className="fixed inset-0 w-full bg-[#0a0a0a] text-white animate-in fade-in duration-500 overflow-hidden z-40 flex flex-col">
            <button onClick={onBack} className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
            
            <div className="flex-1 overflow-y-auto w-full">
                <div className="min-h-full w-full p-6 md:p-16">
                    <div className="max-w-7xl mx-auto pt-16 md:pt-12 pb-24">
                        <div className="w-16 h-16 md:w-24 md:h-24 mb-8 md:mb-12">
                          <Logo theme="light" className="w-full h-full" />
                        </div>
                        
                        <h1 className="text-4xl md:text-7xl font-bold mb-10 md:mb-16 tracking-tighter font-poppins">Our Work</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
                            {WORK_ITEMS.map((item, i) => (
                                <div key={i} className="group md:cursor-none">
                                    <div className="aspect-video relative overflow-hidden bg-gray-900 mb-4 rounded-sm">
                                        <img 
                                            src={item.img} 
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-100 md:opacity-80 md:group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-transparent md:bg-black/20 md:group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/20 pb-4 md:group-hover:border-[#ccff00] transition-colors">
                                        <h3 className="text-xl md:text-2xl font-bold text-white md:group-hover:text-[#ccff00] transition-colors">{item.title}</h3>
                                        <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500">{item.cat}</span>
                                    </div>
                                </div>
                            ))}
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