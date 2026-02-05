import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface BookingPageProps {
  onBack: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 md:p-8 relative animate-in fade-in duration-500 overflow-y-auto">
            <button onClick={onBack} className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
            
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center pt-16 md:pt-0 pb-12 md:pb-0">
                <div className="text-left">
                    <div className="inline-block p-3 rounded-full bg-white/5 mb-4 md:mb-6">
                        <Calendar size={24} className="text-[#ccff00] md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">SCHEDULE A <br/>CONSULTATION</h1>
                    <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-lg font-poppins leading-relaxed">
                        Select a time to speak with our strategy team. We'll discuss your brand's current geometry, identify friction points, and plot a new trajectory.
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2"><Clock size={16} /> 30 Minute Intro</div>
                        <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center gap-2">Google Meet</div>
                    </div>
                </div>
                
                {/* Mock Calendar Widget */}
                <div className="bg-white rounded-lg p-4 md:p-6 text-black shadow-2xl w-full">
                    <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-gray-100 pb-4">
                        <span className="font-bold text-base md:text-lg">October 2026</span>
                        <div className="flex gap-2">
                             <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">&lt;</button>
                             <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">&gt;</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4 text-center text-[10px] md:text-xs font-semibold text-gray-400">
                        <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 md:gap-2 text-xs md:text-sm font-medium">
                        {[...Array(31)].map((_, i) => (
                            <button 
                                key={i} 
                                className={`aspect-square rounded-full flex items-center justify-center transition-colors ${i === 14 ? 'bg-black text-white' : 'hover:bg-gray-100'} ${i < 4 ? 'text-gray-300 pointer-events-none' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold uppercase mb-3 text-gray-500">Available Times</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="py-2 border border-gray-200 rounded text-xs md:text-sm hover:border-black transition-colors">09:00 AM</button>
                            <button className="py-2 border border-gray-200 rounded text-xs md:text-sm hover:border-black transition-colors">10:30 AM</button>
                            <button className="py-2 bg-black text-white rounded text-xs md:text-sm">02:00 PM</button>
                            <button className="py-2 border border-gray-200 rounded text-xs md:text-sm hover:border-black transition-colors">04:15 PM</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};