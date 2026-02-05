import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  active: boolean; 
  spawning?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; 
  size: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface GridPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

export const BlackHoleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Configuration
    const NEON_LIME = '#ccff00';
    const HOT_LIME = '#eeffcc'; 
    const INITIAL_RADIUS = 20;
    const MAX_RADIUS = 100; 
    
    // Performance Tunings
    const MAX_STAR_COUNT_DESKTOP = 120;
    const MAX_STAR_COUNT_MOBILE = 50;
    
    // Grid Configuration - Increased spacing for performance
    const BASE_GRID_SPACING_DESKTOP = 60; 
    const BASE_GRID_SPACING_MOBILE = 80;  
    
    // Physics constants
    const GRID_COLOR = 'rgba(255, 255, 255, 0.08)'; 
    const GRID_SPRING = 0.1;
    const GRID_FRICTION = 0.85;
    
    const BASE_GRAVITY_RADIUS = 300; 
    const ACCELERATION = 0.8; 
    const PADDING_PCT = 0.05; 
    const IDLE_TIMEOUT_MS = 1000; 
    
    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let lastCollectTime = Date.now(); 

    // Game State
    let currentStarCount = 100; 
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let shockwaves: Shockwave[] = [];
    let gridPoints: GridPoint[] = [];
    let gridCols = 0;
    let gridRows = 0;
    let starsCollected = 0;
    
    let blackHole = {
      radius: INITIAL_RADIUS,
      pulse: 0, 
      x: -1000,
      y: -1000
    };

    const init = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      if (width === 0 || height === 0) return;

      const isMobile = width < 768;
      
      // Optimization: Cap DPR to 1.5 to save pixels on high-res screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Grid Setup
      const spacing = isMobile ? BASE_GRID_SPACING_MOBILE : BASE_GRID_SPACING_DESKTOP;
      gridPoints = [];
      gridCols = Math.ceil(width / spacing) + 2;
      gridRows = Math.ceil(height / spacing) + 2;
      const offsetX = -spacing;
      const offsetY = -spacing;

      for(let y = 0; y < gridRows; y++) {
        for(let x = 0; x < gridCols; x++) {
           const px = x * spacing + offsetX;
           const py = y * spacing + offsetY;
           gridPoints.push({
              x: px, y: py,
              baseX: px, baseY: py,
              vx: 0, vy: 0
           });
        }
      }

      // Stars Setup
      const startCount = isMobile ? 40 : 80;
      currentStarCount = startCount;
      
      stars = [];
      for (let i = 0; i < currentStarCount; i++) {
        stars.push(createStar(true));
      }
      starsCollected = 0;
      lastCollectTime = Date.now();
    };

    const createStar = (randomPosition: boolean = true): Star => {
      const s = Math.random() * 2 + 0.5;
      let sx, sy;
      
      if (randomPosition) {
        const padX = width * PADDING_PCT; 
        const padY = height * PADDING_PCT;
        sx = padX + Math.random() * (width - padX * 2);
        sy = padY + Math.random() * (height - padY * 2);
      } else {
        sx = blackHole.x;
        sy = blackHole.y;
      }

      return {
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        baseSize: s,
        size: s,
        alpha: Math.random() * 0.6 + 0.2, 
        active: true,
        spawning: !randomPosition 
      };
    };

    const explode = () => {
      const isMobile = width < 768;
      const particleCount = isMobile ? 30 : 60;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 20 + 5; 
        particles.push({
          x: blackHole.x,
          y: blackHole.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.3 ? NEON_LIME : '#ffffff'
        });
      }

      shockwaves.push({
        x: blackHole.x,
        y: blackHole.y,
        radius: 10,
        maxRadius: Math.max(width, height) * 1.2,
        opacity: 1.0
      });

      const growthFactor = 1.1;
      const maxStars = isMobile ? MAX_STAR_COUNT_MOBILE : MAX_STAR_COUNT_DESKTOP;
      currentStarCount = Math.min(Math.floor(currentStarCount * growthFactor), maxStars);

      blackHole.radius = INITIAL_RADIUS;
      blackHole.pulse = 40; 
      starsCollected = 0;
      lastCollectTime = Date.now();

      stars = [];
      for (let i = 0; i < currentStarCount; i++) {
          const star = createStar(false);
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 30 + 10; 
          star.vx = Math.cos(angle) * speed;
          star.vy = Math.sin(angle) * speed;
          stars.push(star);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      blackHole.x = e.clientX - rect.left;
      blackHole.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      blackHole.x = touch.clientX - rect.left;
      blackHole.y = touch.clientY - rect.top;
    };

    const drawGlowingOrb = (x: number, y: number, radius: number, color: string, glowAlpha: number) => {
       // 1. Outer Glow (Behind the core)
       // We only draw the glow if it's visible to save performance
       if (glowAlpha > 0.05) {
           const glowSpread = 20 + (radius * 0.4); 
           const outerRadius = radius + glowSpread;
           
           // Create a gradient that fades from the edge of the black hole outwards
           // Note: We start at 'radius' so the glow looks like it emanates from the ring
           const g = ctx.createRadialGradient(x, y, radius, x, y, outerRadius);
           g.addColorStop(0, `rgba(204, 255, 0, ${glowAlpha * 0.4})`);
           g.addColorStop(1, 'rgba(204, 255, 0, 0)');
           
           ctx.fillStyle = g;
           ctx.beginPath();
           ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
           ctx.fill();
       }

       // 2. Black Core (Fills the center, covering any inner gradient bleed)
       ctx.beginPath();
       ctx.arc(x, y, radius, 0, Math.PI * 2);
       ctx.fillStyle = '#000000';
       ctx.fill();

       // 3. Crisp Ring (Stroke on top)
       ctx.lineWidth = 2;
       ctx.strokeStyle = color;
       ctx.stroke();
    };

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      
      const now = Date.now();
      const padX = width * PADDING_PCT;
      const padY = height * PADDING_PCT;
      const isMobile = width < 768;
      const gravityRadius = isMobile ? 120 : BASE_GRAVITY_RADIUS;

      // --- 1. Background Grid & Physics ---
      const influenceRadius = blackHole.radius * 6; 
      const influenceRadiusSq = influenceRadius * influenceRadius;
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = GRID_COLOR; 
      ctx.beginPath();

      const waveWidth = 60;

      // Grid Physics Update
      for(let i = 0; i < gridPoints.length; i++) {
        const p = gridPoints[i];
        
        // 1. Spring Physics
        const dxBase = p.baseX - p.x;
        const dyBase = p.baseY - p.y;
        
        const distFromBaseSq = dxBase*dxBase + dyBase*dyBase;
        const dxHole = blackHole.x - p.x;
        const dyHole = blackHole.y - p.y;
        const distHoleSq = dxHole*dxHole + dyHole*dyHole;

        let active = false;
        
        if (distFromBaseSq > 0.1 || distHoleSq < influenceRadiusSq + 10000) {
            p.vx += dxBase * GRID_SPRING;
            p.vy += dyBase * GRID_SPRING;
            active = true;
        }

        // 2. Black Hole Pull
        if (distHoleSq < influenceRadiusSq) {
            const dist = Math.sqrt(distHoleSq);
            const t = (influenceRadius - dist) / influenceRadius;
            const ease = t * t; 
            const pull = ease * 2.5; 
            const angle = Math.atan2(dyHole, dxHole);
            p.vx += Math.cos(angle) * pull;
            p.vy += Math.sin(angle) * pull;
            active = true;
        }

        // 3. Shockwaves
        if (shockwaves.length > 0) {
            for(let j = 0; j < shockwaves.length; j++) {
                const s = shockwaves[j];
                const dxS = p.x - s.x;
                const dyS = p.y - s.y;
                const distSSq = dxS*dxS + dyS*dyS;
                const maxRange = s.radius + waveWidth;
                
                if (distSSq < maxRange * maxRange) {
                    const distS = Math.sqrt(distSSq);
                    const distFromWave = Math.abs(distS - s.radius);
                    if (distFromWave < waveWidth) {
                        const t = (waveWidth - distFromWave) / waveWidth;
                        const push = t * 10 * s.opacity; 
                        const angle = Math.atan2(dyS, dxS);
                        p.vx += Math.cos(angle) * push;
                        p.vy += Math.sin(angle) * push;
                        active = true;
                    }
                }
            }
        }

        if (active) {
            p.vx *= GRID_FRICTION;
            p.vy *= GRID_FRICTION;
            p.x += p.vx;
            p.y += p.vy;
        }
      }

      // Draw Grid Lines
      // Vertical
      for (let x = 0; x < gridCols; x++) {
          const pStart = gridPoints[x];
          ctx.moveTo(pStart.x, pStart.y);
          for (let y = 1; y < gridRows; y++) {
              const p = gridPoints[y * gridCols + x];
              ctx.lineTo(p.x, p.y);
          }
      }
      // Horizontal
      for (let y = 0; y < gridRows; y++) {
          const pStart = gridPoints[y * gridCols];
          ctx.moveTo(pStart.x, pStart.y);
          for (let x = 1; x < gridCols; x++) {
              const p = gridPoints[y * gridCols + x];
              ctx.lineTo(p.x, p.y);
          }
      }
      ctx.stroke();

      // --- 2. Update Shockwaves ---
      for (let i = shockwaves.length - 1; i >= 0; i--) {
          const s = shockwaves[i];
          s.radius += (s.maxRadius - s.radius) * 0.08 + 5; 
          s.opacity -= 0.02;
          if (s.opacity <= 0) {
              shockwaves.splice(i, 1);
          }
      }

      // --- 3. Stars Logic ---
      ctx.shadowBlur = 0;
      
      stars.forEach(star => {
        if (!star.active) return;

        star.x += star.vx;
        star.y += star.vy;
        
        if (star.x < padX) { star.x = padX; star.vx *= -0.5; }
        else if (star.x > width - padX) { star.x = width - padX; star.vx *= -0.5; }
        
        if (star.y < padY) { star.y = padY; star.vy *= -0.5; }
        else if (star.y > height - padY) { star.y = height - padY; star.vy *= -0.5; }

        const dx = blackHole.x - star.x;
        const dy = blackHole.y - star.y;
        const distSq = dx*dx + dy*dy;
        const gravityRadiusSq = gravityRadius * gravityRadius;

        if (distSq < gravityRadiusSq && distSq > 1) {
           const dist = Math.sqrt(distSq);
           const nx = dx / dist;
           const ny = dy / dist;
           const force = (1 - dist / gravityRadius) * ACCELERATION;
           star.vx += nx * force;
           star.vy += ny * force;
           
           if (!star.spawning && dist < blackHole.radius) {
                star.active = false;
                starsCollected++;
                blackHole.pulse = 5;
                lastCollectTime = now; 
           }
        }

        if (star.spawning) {
             const dist = Math.sqrt(distSq);
             if (dist > blackHole.radius + 15) star.spawning = false;
        }

        star.vx *= 0.94; 
        star.vy *= 0.94;

        ctx.fillStyle = NEON_LIME;
        if (ctx.globalAlpha !== star.alpha) ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // --- 4. Particles ---
      for (let i = particles.length - 1; i >= 0; i--) {
         const p = particles[i];
         p.x += p.vx;
         p.y += p.vy;
         p.vx *= 0.92; 
         p.vy *= 0.92;
         p.life -= 0.02;

         if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
         }

         ctx.globalAlpha = p.life;
         ctx.fillStyle = p.color;
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
         ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // --- 5. Shockwave Rendering ---
      ctx.lineWidth = 4;
      shockwaves.forEach(s => {
          ctx.strokeStyle = `rgba(204, 255, 0, ${s.opacity})`; 
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.stroke();
      });

      // --- 6. Black Hole Cursor Logic ---
      const progress = starsCollected / currentStarCount;
      if (starsCollected === currentStarCount && currentStarCount > 0) {
          explode();
      }

      const targetRadius = INITIAL_RADIUS + (progress * (MAX_RADIUS - INITIAL_RADIUS));
      blackHole.radius += (targetRadius - blackHole.radius) * 0.1;
      blackHole.pulse *= 0.85; 

      const timeSec = now / 1000;
      let pulseGlow = 0;
      let pulseSize = 0;

      if (progress > 0.5) {
          // Visual feedback that doesn't affect position
          const freq = 15 + (progress * 15); 
          const sine = Math.sin(timeSec * freq);
          pulseGlow = sine * (progress * 0.5); 
          pulseSize = sine * (progress * 4);
      }

      const renderRadius = Math.max(1, blackHole.radius + blackHole.pulse + pulseSize);
      const glowIntensity = 0.3 + (progress * 0.7) + pulseGlow;
      const isHot = progress > 0.8 && Math.random() > 0.5;
      const holeColor = isHot ? HOT_LIME : NEON_LIME;

      // Render the orb perfectly centered on mouse coordinates
      // (Removed trembleX/trembleY from position to ensure concentricity)
      drawGlowingOrb(blackHole.x, blackHole.y, renderRadius, holeColor, glowIntensity);

      // --- 7. Hint Arrow ---
      if (now - lastCollectTime > IDLE_TIMEOUT_MS && starsCollected < currentStarCount) {
          let nearest = null;
          let minDistSq = Infinity;
          for(const s of stars) {
              if(!s.active) continue;
              const dx = s.x - blackHole.x;
              const dy = s.y - blackHole.y;
              const dSq = dx*dx + dy*dy;
              if (dSq < minDistSq) {
                  minDistSq = dSq;
                  nearest = s;
              }
          }

          if (nearest) {
              const dx = nearest.x - blackHole.x;
              const dy = nearest.y - blackHole.y;
              const angle = Math.atan2(dy, dx);
              const arrowDist = renderRadius + 25;
              
              ctx.save();
              ctx.translate(blackHole.x + Math.cos(angle) * arrowDist, blackHole.y + Math.sin(angle) * arrowDist);
              ctx.rotate(angle);
              ctx.fillStyle = NEON_LIME;
              ctx.beginPath();
              ctx.moveTo(0, 0); 
              ctx.lineTo(-15, -8);
              ctx.lineTo(-15, 8);
              ctx.fill();
              ctx.restore();
          }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    init();
    render();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 200);
    };

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
    <div ref={containerRef} className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-auto cursor-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};