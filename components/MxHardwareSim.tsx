import React from 'react';
import { PitchStyle } from '../types';

interface MxHardwareSimProps {
  intensity: number;
  setIntensity: (val: number) => void;
  style: PitchStyle;
  setStyle: (val: PitchStyle) => void;
  onGenerate: () => void;
}

const MxHardwareSim: React.FC<MxHardwareSimProps> = ({ 
  intensity, 
  setIntensity, 
  style, 
  setStyle, 
  onGenerate 
}) => {
  // Simulate dial rotation
  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(Number(e.target.value));
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.02] duration-300 w-full max-w-md mx-auto relative overflow-hidden group">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase">My Creative Console</h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-green-500/50 shadow-lg"></span>
                <span className="text-green-500 text-xs font-bold">CONNECTED</span>
            </div>
        </div>

        {/* Dial Section */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between gap-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-600 shadow-xl flex items-center justify-center relative">
                <div 
                    className="w-1 h-6 bg-indigo-500 rounded-full absolute top-1 origin-bottom transform transition-transform duration-100"
                    style={{ transform: `rotate(${(intensity / 100) * 270 - 135}deg)` }} // minimal rotation visual
                />
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                    DIAL
                </div>
             </div>
             
             <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Intensity Control</label>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={intensity} 
                    onChange={handleDialChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-500 font-mono">
                    <span>Calm</span>
                    <span>{intensity}%</span>
                    <span>Hype</span>
                </div>
             </div>
        </div>

        {/* Keypad Section */}
        <div className="grid grid-cols-2 gap-3">
             {Object.values(PitchStyle).map((s) => (
                 <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`
                        p-3 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                        ${style === s 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }
                    `}
                 >
                    <span className="text-xs font-bold block mb-1 opacity-70">MODE</span>
                    <span className="text-sm font-semibold truncate block">{s}</span>
                    {style === s && <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full" />}
                 </button>
             ))}
        </div>

        {/* Main Action Button */}
        <button 
            onClick={onGenerate}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-bold text-white shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 group-hover:from-pink-500 group-hover:to-purple-500"
        >   
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            GENERATE PITCH
        </button>

        <div className="hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded backdrop-blur border border-white/10 pointer-events-none transition-opacity">
            Turn physical dial to adjust
        </div>
      </div>
    </div>
  );
};

export default MxHardwareSim;
