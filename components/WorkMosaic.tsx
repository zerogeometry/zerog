import React, { useRef, useEffect, useState } from 'react';
import { PageView } from '../types';

interface WorkMosaicProps {
  onNavigate: (page: PageView) => void;
}

export const WorkMosaic: React.FC<WorkMosaicProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Assume we are unmuted initially (intent) so the first click will MUTE it.
  const [isMuted, setIsMuted] = useState(false);

  // Vimeo ID
  const VIMEO_ID = '1164393101';
  
  // URL Configuration:
  // muted=0: Try to start with sound ON
  // autoplay=1: Try to start playing immediately
  const iframeSrc = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&loop=1&autopause=0&muted=0&controls=0&background=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1`;

  const postToVimeo = (method: string, value?: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const data = { method, value };
      try {
        iframeRef.current.contentWindow.postMessage(JSON.stringify(data), '*');
      } catch (e) {
        iframeRef.current.contentWindow.postMessage(data, '*');
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Attempt to force play + unmute when visible
            postToVimeo('setVolume', 1);
            postToVimeo('setMuted', false);
            postToVimeo('play');
          } else {
            postToVimeo('pause');
          }
        });
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    
    if (nextState) {
        // Mute
        postToVimeo('setMuted', true);
        postToVimeo('setVolume', 0);
    } else {
        // Unmute
        postToVimeo('setMuted', false);
        postToVimeo('setVolume', 1);
    }
    // Ensure play is triggered on interaction in case browser blocked autoplay
    postToVimeo('play');
  };

  return (
    <section 
      ref={containerRef}
      className="h-screen w-full bg-[#0a0a0a] snap-start relative flex flex-col overflow-hidden group"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         <iframe 
            ref={iframeRef}
            src={iframeSrc} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            style={{ 
               width: '100vw', 
               height: '56.25vw', 
               minHeight: '100vh', 
               minWidth: '177.77vh',
               pointerEvents: 'none' 
            }}
         />
      </div>

      {/* 
        Full Screen Transparent Overlay
        Clicking toggles mute/unmute
      */}
      <div 
        className="absolute inset-0 z-50 cursor-pointer"
        onClick={toggleSound}
        onTouchStart={toggleSound}
      ></div>
    </section>
  );
};