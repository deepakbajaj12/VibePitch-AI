import React, { useState, useEffect, useRef } from 'react';

interface TeleprompterProps {
  script: string;
  speed: number; // Controlled by Actions Ring (1-10)
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

const Teleprompter: React.FC<TeleprompterProps> = ({ script, speed, isPlaying, onTogglePlay, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    
    const scroll = () => {
      if (isPlaying && scrollRef.current) {
        scrollRef.current.scrollTop += (speed * 0.5); // Adjust multiplier for smoothness
        
        // Loop or stop at end? Let's just stop at end
        if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight) {
           // onTogglePlay(); // Option to stop at end
        }
        
        animationFrameId = requestAnimationFrame(scroll);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header / Controls Overlay */}
      <div className="flex items-center justify-between p-6 bg-gray-900 border-b border-gray-800 z-10 sticky top-0">
         <div className="flex items-center gap-4">
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                TELEPROMPTER LIVE
            </h2>
         </div>

         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 uppercase font-mono">Actions Ring Speed</span>
                <span className="text-xl font-mono text-indigo-400 font-bold">{speed.toFixed(1)}x</span>
            </div>
            <button 
                onClick={onTogglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
            >
                {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>
         </div>
      </div>

      {/* Scrolling Text Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-20 scroll-smooth no-scrollbar"
        style={{ scrollBehavior: 'auto' }} // Disable smooth scroll for JS animation
      >
        <div className="max-w-4xl mx-auto">
            <p className="text-5xl md:text-7xl font-bold text-white leading-tight text-center transition-all duration-300 transform origin-top" 
               style={{ 
                   transform: `scale(${1 + (speed * 0.02)})`, // Slight zoom effect on speed
                   opacity: isPlaying ? 1 : 0.7 
               }}>
                {script}
            </p>
            {/* Spacer at bottom to allow full scroll */}
            <div className="h-[80vh]"></div>
        </div>
      </div>
      
      {/* Mirror Guide Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/30 pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-red-500/30 text-xs font-mono uppercase tracking-widest pointer-events-none">Eye Level</div>

    </div>
  );
};

export default Teleprompter;
