import React, { useEffect, useState, useRef } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasEndedRef = useRef(false);

  // Removed background=1 to prevents forced cropping/white bars issues in some contexts
  // Added transparent=0 to force black player background
  // Added playsinline=1 for better mobile handling
  const VIMEO_ID = '1158804517';
  const embedUrl = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&muted=1&title=0&byline=0&portrait=0&controls=0&loop=0&dnt=1&api=1&playsinline=1&transparent=0`;

  useEffect(() => {
    // Listen for Vimeo Player messages
    const handleMessage = (event: MessageEvent) => {
      // Vimeo events come from player.vimeo.com
      if (!event.origin.includes('vimeo')) return;

      try {
        // Vimeo sends data as a string or object depending on implementation, usually JSON string
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // When player is ready, attach listeners
        if (data.event === 'ready') {
          if (iframeRef.current && iframeRef.current.contentWindow) {
             iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'finish' }), '*');
             iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'timeupdate' }), '*');
          }
        }

        // Handle timeupdate
        if (data.event === 'timeupdate' && data.data) {
            const { percent, duration, seconds } = data.data;
            
            // Cutoff logic:
            // 1. If we are past 90% (0.90) - Highly preemptive
            // 2. OR if we are within 1.5 seconds of the end
            // This ensures we catch the end before any related videos screen or loop
            if ((percent && percent >= 0.90) || (duration && seconds && (duration - seconds <= 1.5))) {
                handleVideoEnd();
            }
        }

        // Fallback catch for finish event
        if (data.event === 'finish') {
          handleVideoEnd();
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);

    // Safety timeout in case events fail completely
    const timeoutId = setTimeout(() => {
        handleVideoEnd();
    }, 45000); 

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleVideoEnd = () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    
    setIsFading(true);
    // Transition to app quickly
    setTimeout(onComplete, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700 ease-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Loading Spinner */}
      {!iframeLoaded && !isFading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className={`w-full h-full pointer-events-none bg-black transition-opacity ${
            isFading 
              ? 'opacity-0 duration-0' // Instant hide
              : iframeLoaded 
                ? 'opacity-100 duration-1000' 
                : 'opacity-0 duration-1000'
          }`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          onLoad={() => setIframeLoaded(true)}
          style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
        ></iframe>
        
        {/* Transparent Overlay to prevent interaction */}
        <div className="absolute inset-0 bg-transparent" />
      </div>

      <button 
        onClick={handleVideoEnd}
        className="absolute bottom-8 right-8 text-white/30 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors z-20 cursor-pointer"
      >
        Skip Intro
      </button>
    </div>
  );
};
