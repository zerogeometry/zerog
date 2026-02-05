import React, { useEffect, useRef, useState } from 'react';

interface CursorState {
  isHovering: boolean;
  previewImage: string | null;
}

export const CustomCursor: React.FC = () => {
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    previewImage: null,
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM update for performance (removes React render lag)
      if (cursorRef.current) {
        // Use translate3d for GPU acceleration
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      
      if (previewRef.current) {
         // Preview is offset by 40px
         previewRef.current.style.transform = `translate3d(${e.clientX + 40}px, ${e.clientY + 40}px, 0)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest('[data-cursor-hover]');
      
      if (hoverTarget) {
        const preview = hoverTarget.getAttribute('data-cursor-preview');
        setState({
          isHovering: true,
          previewImage: preview,
        });
      } else {
        setState({
          isHovering: false,
          previewImage: null,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Base size is 30px, grows to 100px on hover
  const size = state.isHovering ? 100 : 30;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ cursor: 'none' }}
    >
      {/* The main circular cursor */}
      <div
        ref={cursorRef}
        className="absolute rounded-full border-2 border-[#ccff00] mix-blend-difference will-change-transform"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: '#ccff00', // Always filled with green
          top: 0,
          left: 0,
          transition: 'width 0.3s ease-out, height 0.3s ease-out', // Only animate size, position is instantaneous
        }}
      />

      {/* The image preview */}
      <div
        ref={previewRef}
        className={`absolute overflow-hidden rounded-lg shadow-2xl border border-white/20 bg-black/50 backdrop-blur-md transition-opacity duration-300 will-change-transform ${
          state.isHovering && state.previewImage ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '200px',
          aspectRatio: '16/9',
          top: 0,
          left: 0,
        }}
      >
        {state.previewImage && (
          <img
            src={state.previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};