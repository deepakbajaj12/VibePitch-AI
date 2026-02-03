
import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  script: string;
  audioBlob?: Blob;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ script, audioBlob }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play().catch(e => console.error("Auto-play blocked:", e));
      
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  return (
    <div className="w-full max-w-2xl bg-gray-900 border border-indigo-500/30 rounded-2xl p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h3 className="text-xl font-bold gradient-text">Your Generated Pitch</h3>
        <p className="text-gray-300 leading-relaxed text-lg italic">
          "{script}"
        </p>
      </div>

      <div className="pt-6 border-t border-gray-800">
        <audio ref={audioRef} controls className="w-full h-12" />
      </div>
    </div>
  );
};

export default AudioPlayer;
