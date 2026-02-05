import React, { useEffect, useRef } from 'react';

export const GravityWellCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Configuration
    const GRID_SPACING = 30; // Denser grid for smoother curves
    const NEON_LIME = { r: 204, g: 255, b: 0 }; // #ccff00
    const DARK_GREY = { r: 40, g: 40, b: 40 }; 
    const MOUSE_RADIUS = 400; // Larger influence area
    const MAX_DEPTH = 250; 
    const PULL_STRENGTH = 0.6; // X/Y Pinch strength
    const ELASTICITY = 0.3; // Snappy response, low lag
    const DAMPING = 0.85; // Physics damping
    const FOV = 800; 

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    
    // Grid Points
    let points: { 
        baseX: number; 
        baseY: number; 
        x: number; 
        y: number; 
        z: number; 
        vx: number;
        vy: number;
        vz: number;
    }[] = [];

    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    const init = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      cols = Math.ceil(width / GRID_SPACING) + 8;
      rows = Math.ceil(height / GRID_SPACING) + 8;
      const offsetX = -GRID_SPACING * 4;
      const offsetY = -GRID_SPACING * 4;

      points = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * GRID_SPACING + offsetX;
          const py = y * GRID_SPACING + offsetY;
          points.push({
            baseX: px,
            baseY: py,
            x: px, 
            y: py, 
            z: 0, 
            vx: 0,
            vy: 0,
            vz: 0
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
       const rect = container.getBoundingClientRect();
       mouse.x = e.clientX - rect.left;
       mouse.y = e.clientY - rect.top;
       mouse.active = true;
    };
    
    const handleMouseLeave = () => {
        mouse.active = false;
        mouse.x = -10000;
        mouse.y = -10000;
    }

    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
        const scale = FOV / (FOV + z);
        return {
            x: (x - cx) * scale + cx,
            y: (y - cy) * scale + cy,
            scale: scale
        };
    };

    const getColor = (intensity: number) => {
        // Linear interpolation for color
        const r = DARK_GREY.r + (NEON_LIME.r - DARK_GREY.r) * intensity;
        const g = DARK_GREY.g + (NEON_LIME.g - DARK_GREY.g) * intensity;
        const b = DARK_GREY.b + (NEON_LIME.b - DARK_GREY.b) * intensity;
        
        // Alpha ramp
        const a = 0.15 + (0.85 * intensity);
        
        return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`;
    };

    let animationFrameId: number;

    const animate = () => {
       ctx.fillStyle = '#000000';
       ctx.fillRect(0, 0, width, height);

       const cx = width / 2;
       const cy = height / 2;
       
       // --- 1. Physics Step ---
       for (let i = 0; i < points.length; i++) {
           const p = points[i];
           
           let targetX = p.baseX;
           let targetY = p.baseY;
           let targetZ = 0;

           if (mouse.active) {
                const dx = mouse.x - p.baseX;
                const dy = mouse.y - p.baseY;
                const distSq = dx * dx + dy * dy;

                if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / MOUSE_RADIUS);
                    
                    // Smooth easing
                    const ease = force * force; 

                    // Z-Depth (Funnel)
                    targetZ = ease * MAX_DEPTH;

                    // X/Y Suction (Pinch)
                    const pull = ease * PULL_STRENGTH;
                    targetX = p.baseX + dx * pull;
                    targetY = p.baseY + dy * pull;
                }
           }

           // Explicit Velocity Verlet-ish integration for smoothness + snap
           const ax = (targetX - p.x) * ELASTICITY;
           const ay = (targetY - p.y) * ELASTICITY;
           const az = (targetZ - p.z) * ELASTICITY;

           p.vx = (p.vx + ax) * DAMPING;
           p.vy = (p.vy + ay) * DAMPING;
           p.vz = (p.vz + az) * DAMPING;

           p.x += p.vx;
           p.y += p.vy;
           p.z += p.vz;
       }

       // --- 2. Draw Rectangular Grid ---
       ctx.lineWidth = 1;

       const drawLine = (p1: typeof points[0], p2: typeof points[0]) => {
            // Calculate average intensity for the segment
            const z1 = p1.z;
            const z2 = p2.z;
            const maxZ = Math.max(z1, z2);
            
            // Normalize intensity based on depth
            const intensity = Math.min(1, Math.pow(maxZ / (MAX_DEPTH * 0.8), 1.5));
            
            // Optimization: If dormant, use simple batch color? 
            // For now, individual strokes look best for the gradient effect.
            
            const proj1 = project(p1.x, p1.y, p1.z, cx, cy);
            const proj2 = project(p2.x, p2.y, p2.z, cx, cy);

            // Skip off-screen lines
            if (proj1.x < -100 || proj1.x > width + 100 || proj1.y < -100 || proj1.y > height + 100) return;

            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.strokeStyle = getColor(intensity);
            ctx.stroke();
       };

       // Horizontal Lines
       for (let y = 0; y < rows; y++) {
           for (let x = 0; x < cols - 1; x++) {
               const idx = y * cols + x;
               drawLine(points[idx], points[idx + 1]);
           }
       }
       // Vertical Lines
       for (let x = 0; x < cols; x++) {
           for (let y = 0; y < rows - 1; y++) {
               const idx = y * cols + x;
               drawLine(points[idx], points[idx + cols]);
           }
       }

       animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    // Listeners
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
