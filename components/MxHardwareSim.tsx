import React from 'react';
import { PitchStyle } from '../types';

interface MxHardwareSimProps {
  intensity: number;
  setIntensity: (val: number) => void;
  style: PitchStyle;
  setStyle: (val: PitchStyle) => void;
  onGenerate: () => void;
  teleprompterSpeed: number;
  setTeleprompterSpeed: (val: number) => void;
  toggleTeleprompter: () => void;
  isTeleprompterActive: boolean;
}

const MxHardwareSim: React.FC<MxHardwareSimProps> = ({ 
  intensity, 
  setIntensity, 
  style, 
  setStyle, 
  onGenerate,
  teleprompterSpeed,
  setTeleprompterSpeed,
  toggleTeleprompter,
  isTeleprompterActive
}) => {
  const [logs, setLogs] = React.useState<string[]>([]);
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString().split(' ')[0]} > ${msg}`]); // keep last 5
  };

  React.useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulate dial rotation
  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This function maps to Logitech Creative Console Dial
    const val = Number(e.target.value);
    setIntensity(val);
    if (Math.random() > 0.8) addLog(`Dial Rotate: ${val}%`); // don't spam logs
  };

  const handleActionsRingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     // This function maps to Logitech MX Master 4 Actions Ring (Scroll Speed)
     const val = Number(e.target.value);
     setTeleprompterSpeed(val);
     if (Math.random() > 0.8) addLog(`Actions Ring: ${val.toFixed(1)}x`);
  };

  const handleStyleChange = (s: PitchStyle) => {
      setStyle(s);
      addLog(`Button Press: ${s.split(' ')[0]} Mode`);
  };

  const handleGenerateClick = () => {
      addLog(`Button Press: GENERATE`);
      onGenerate();
  }

  const handlePrompterClick = () => {
      addLog(`Button Press: TOGGLE PROMPTER`);
      toggleTeleprompter();
  }


  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.02] duration-300 w-full max-w-md mx-auto relative overflow-hidden group flex flex-col h-full">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6 flex-grow">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase">My Creative Console</h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-green-500/50 shadow-lg"></span>
                <span className="text-green-500 text-xs font-bold">CONNECTED</span>
            </div>
        </div>
        
        {/* SDK Status Indicator */}
        <div className="text-[10px] text-gray-500 font-mono border-l-2 border-green-500 pl-2">
            SDK Status: Active <br/>
            Plugin ID: com.vibepitch.mx
        </div>

        {/* Dial Section */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between gap-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-600 shadow-xl flex items-center justify-center relative transform transition-transform hover:rotate-12 duration-500">
                <div 
                    className="w-1 h-6 bg-indigo-500 rounded-full absolute top-1 origin-bottom transform transition-transform duration-100"
                    style={{ transform: `rotate(${(intensity / 100) * 270 - 135}deg)` }} 
                />
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                    DIAL
                </div>
             </div>
             
             <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                    Intensity Control
                    <span className="text-indigo-400">{intensity}%</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={intensity} 
                    onChange={handleDialChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
             </div>
        </div>
        
        {/* Actions Ring Simulator (New Feature) */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center relative animate-spin-slow">
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                    Actions Ring (Teleprompter)
                    <span className="text-indigo-400">{teleprompterSpeed.toFixed(1)}x</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={teleprompterSpeed} 
                    onChange={handleActionsRingChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
             </div>
        </div>

        {/* Keypad Section */}
        <div className="grid grid-cols-2 gap-3">
             {Object.values(PitchStyle).map((s, idx) => (
                 <button
                    key={s}
                    onClick={() => handleStyleChange(s)}
                    className={`
                        p-3 rounded-xl border transition-all duration-200 text-left relative overflow-hidden group
                        ${style === s 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }
                    `}
                 >
                    <span className="text-[10px] font-bold block mb-1 opacity-70 uppercase tracking-wider">Button {idx + 1}</span>
                    <span className="text-xs font-bold truncate block">{s.split(' ')[0]}</span>
                    {style === s && <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full" />}
                 </button>
             ))}
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={handleGenerateClick}
                className="py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl font-bold text-white shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:from-pink-500 group-hover:to-purple-500 text-sm"
            >   
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                GENERATE
            </button>
            
            <button 
                onClick={handlePrompterClick}
                className={`py-4 rounded-2xl font-bold border transition-all flex items-center justify-center gap-2 text-sm ${isTeleprompterActive ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}
            >   
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                PRESENTER MODE
            </button>
        </div>

        {/* Event Logs */}
        <div className="mt-4 bg-black/40 rounded-lg p-3 font-mono text-[10px] text-gray-400 h-24 overflow-hidden flex flex-col justify-end border border-gray-800">
             <div className="opacity-50 mb-1 border-b border-gray-800 pb-1">LOGI OPTIONS+ EVENTS</div>
             {logs.map((log, i) => (
                 <div key={i} className="animate-in fade-in slide-in-from-left-2 truncate">
                     <span className="text-green-500">➜</span> {log}
                 </div>
             ))}
             <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default MxHardwareSim;
