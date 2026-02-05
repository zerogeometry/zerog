import React, { useEffect, useRef } from 'react';

export const InteractiveGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: { x: number; y: number; ox: number; oy: number; active: boolean }[] = [];
    let mouse = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    
    // Performance Optimization: Increased Gap to reduce total points
    // Desktop: ~80px, Mobile ~100px
    const gapX = 80; 
    const gapY = 80; 
    
    const radius = 300; // Interaction radius
    const radiusSq = radius * radius;

    const initGrid = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      points = [];
      const cols = Math.ceil(width / gapX) + 1;
      const rows = Math.ceil(height / gapY) + 1;
      
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * gapX;
          const y = j * gapY;
          points.push({ x, y, ox: x, oy: y, active: false });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Optimization: Only stroke if we actually have points
      if (points.length === 0) return;

      const cols = Math.ceil(width / gapX) + 1;
      const rows = Math.ceil(height / gapY) + 1;

      // Update Physics
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // 1. Check distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        
        // 2. Check distance to origin (rest state)
        const dxO = p.x - p.ox;
        const dyO = p.y - p.oy;
        const distOriginSq = dxO * dxO + dyO * dyO;

        // Optimization: "Sleep" logic. 
        // Only calculate physics if near mouse OR not at rest.
        if (distSq < radiusSq || distOriginSq > 0.5) {
            let tx = p.ox;
            let ty = p.oy;

            if (distSq < radiusSq) {
               const dist = Math.sqrt(distSq);
               const angle = Math.atan2(dy, dx);
               const force = (radius - dist) / radius;
               const repulsion = force * 60;
               tx = p.ox - Math.cos(angle) * repulsion;
               ty = p.oy - Math.sin(angle) * repulsion;
            }

            p.x += (tx - p.x) * 0.1;
            p.y += (ty - p.y) * 0.1;
        }
      }

      // Draw Lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const p = points[i];
          
          if (c < cols - 1) {
              const right = points[i + 1];
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(right.x, right.y);
          }
          if (r < rows - 1) {
               const bottomIndex = i + cols;
               if (bottomIndex < points.length) {
                  const bottom = points[bottomIndex];
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(bottom.x, bottom.y);
               }
          }
        }
      }
      ctx.stroke();

      // Draw Dots
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      const markerSize = 1.5;
      for (let i = 0; i < points.length; i++) {
         const p = points[i];
         ctx.rect(p.x - markerSize/2, p.y - markerSize/2, markerSize, markerSize);
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    initGrid();
    animate();
    
    // Debounce resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initGrid, 100);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
       <canvas ref={canvasRef} />
    </div>
  );
};