import React, { useState, useEffect } from 'react';
import { PageView } from '../types';

interface WorkMosaicProps {
  onNavigate: (page: PageView) => void;
}

interface WorkItem {
  id: number;
  title: string;
  img: string;
  // Grid positions (1-based)
  col: number;
  row: number;
  w: number;
  h: number;
}

const WORK_ITEMS: WorkItem[] = [
  // Row 1-4 (Top Half)
  // Item 1: Top Left Large (6x4) -> new premium placeholder_00005.png
  { id: 1, title: 'Neon Horizons', img: 'https://lh3.googleusercontent.com/d/1pwanPCzZ1qxDcc9pKXCQqGDGJZysmJcG', col: 1, row: 1, w: 6, h: 4 },
  // Item 2: Top Mid Portrait (3x4) -> premium placeholder_00006.png
  { id: 2, title: 'Abstract Flow', img: 'https://lh3.googleusercontent.com/d/1DzY7lHG2a7VvqNqPeqygEHaIZ5p0Z5B0', col: 7, row: 1, w: 3, h: 4 },
  // Item 3: Top Right Small (3x2) -> new premium placeholder_00004.png
  { id: 3, title: 'Geometric Harmony', img: 'https://lh3.googleusercontent.com/d/16oqETDgUYe5u1b8PZanPf75Z2uuZC4MX', col: 10, row: 1, w: 3, h: 2 },
  // Item 4: Top Right Small 2 (3x2) - below Item 3 -> premium placeholder_00002.png
  { id: 4, title: 'System Core', img: 'https://lh3.googleusercontent.com/d/1dAKVlcZ_nVZjda8XpeZ11HU7JMbwRd3e', col: 10, row: 3, w: 3, h: 2 },

  // Row 5-8 (Bottom Half)
  // Item 5: Bottom Left Portrait (3x4) -> new premium placeholder_00001.png
  { id: 5, title: 'Type Theory', img: 'https://lh3.googleusercontent.com/d/1TdWoZFxnjb_3ZwvsJpFEGPHk9RbOMnuH', col: 1, row: 5, w: 3, h: 4 },
  // Item 6: Bottom Mid Portrait (3x4) -> premium placeholder_00000.png
  { id: 6, title: 'Zero Point', img: 'https://lh3.googleusercontent.com/d/1bFfCApp6HY28oI5fWXZ0qk_HtHg7gFSH', col: 4, row: 5, w: 3, h: 4 },
  // Item 7: Bottom Right Landscape (6x2) -> new premium placeholder_00000.png
  { id: 7, title: 'Echo Chamber', img: 'https://lh3.googleusercontent.com/d/1ddDhmsPFDxTLyve-1A1Fgpy0xfnIv-fP', col: 7, row: 5, w: 6, h: 2 },
  // Item 8: Bottom Right Landscape 2 (6x2) - below Item 7 -> premium placeholder_00003.png
  { id: 8, title: 'Dark Matter', img: 'https://lh3.googleusercontent.com/d/19mUYMcAYKncjHoiV0p7UfcxFKicuOMeL', col: 7, row: 7, w: 6, h: 2 },
];

export const WorkMosaic: React.FC<WorkMosaicProps> = ({ onNavigate }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Changed to 1024 for Tablet/Mobile handling
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Grid Config
  const ROWS = 8;
  const COLS = 12;

  // Generate grid cells
  const renderGridCells = () => {
    const cells = [];
    const occupied = new Set<string>();

    // Mark occupied cells
    WORK_ITEMS.forEach(item => {
      for (let r = item.row; r < item.row + item.h; r++) {
        for (let c = item.col; c < item.col + item.w; c++) {
          occupied.add(`${r}-${c}`);
        }
      }
    });

    // Generate full grid
    for (let r = 1; r <= ROWS; r++) {
      for (let c = 1; c <= COLS; c++) {
        const key = `${r}-${c}`;
        
        // Skip if occupied by a work item
        if (occupied.has(key)) continue;

        cells.push(
          <div
            key={key}
            className="w-full h-full bg-[#0a0a0a] border border-white/5 hover:bg-[#1a1a1a] transition-colors duration-75 ease-linear"
            style={{
              gridColumn: c,
              gridRow: r,
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <section className="h-screen w-full bg-[#0a0a0a] snap-start relative flex flex-col overflow-hidden">
      {/* Title - Visible on Desktop, Hidden on Mobile to allow scroll */}
      <div className={`absolute top-[140px] md:top-[160px] left-0 z-20 px-8 md:px-[100px] pointer-events-none ${isMobile ? 'hidden' : 'block'}`}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mix-blend-difference">
          Our Work
        </h2>
      </div>

      {isMobile ? (
        // Mobile Layout: Smooth Vertical Scroll with Rhythm
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden pt-32 pb-24 px-6 scrollbar-hide">
           <div className="mb-10 pointer-events-none">
              <h2 className="text-4xl font-bold text-white tracking-tighter">
                Our Work
              </h2>
              <div className="w-12 h-1 bg-[#ccff00] mt-4" />
           </div>

           {/* Mobile: Butt thumbnails vertically (gap-0), equal size (aspect-square), overlay content bottom left */}
           <div className="flex flex-col gap-0 w-full">
             {WORK_ITEMS.map((item) => (
                 <div 
                    key={item.id} 
                    className="relative w-full aspect-square group overflow-hidden block"
                    onClick={() => onNavigate('work')}
                 >
                    <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover opacity-100 block" 
                        style={{ display: 'block' }} // Force block to remove inline spacing
                    />
                    
                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Content Overlay - Bottom Left */}
                    <div className="absolute bottom-0 left-0 p-6 w-full flex items-baseline justify-start gap-3">
                       <span className="text-sm font-mono text-[#ccff00] tracking-widest font-bold">
                          0{item.id}
                       </span>
                       <h3 className="text-white font-bold text-xl tracking-tight leading-none">
                          {item.title}
                       </h3>
                    </div>
                 </div>
             ))}
           </div>
           
           {/* Bottom spacer for safe scrolling past nav bars */}
           <div className="h-32"></div>
        </div>
      ) : (
        // Desktop Mosaic Grid
        <div className="w-full h-full grid grid-cols-12 grid-rows-8 gap-0">
          {/* Render Filler Cells */}
          {renderGridCells()}

          {/* Render Work Items */}
          {WORK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden cursor-none border border-black"
              style={{
                gridColumn: `${item.col} / span ${item.w}`,
                gridRow: `${item.row} / span ${item.h}`,
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onNavigate('work')}
              data-cursor-hover="true"
              data-cursor-preview={item.img}
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105 opacity-60 group-hover:opacity-100 block"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-mono text-[#ccff00] uppercase tracking-widest">0{item.id}</span>
                </div>
                <div>
                   <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                </div>
              </div>

              {/* Borders to blend with grid */}
              <div className="absolute inset-0 border border-white/10 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};