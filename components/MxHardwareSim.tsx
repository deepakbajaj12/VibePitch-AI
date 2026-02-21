import React, { useState, useEffect } from 'react';
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
  const [activeContext, setActiveContext] = useState<'VS Code' | 'Figma' | 'LinkedIn' | 'Gmail'>('VS Code');

  // New states for "Plugin Layer"
  const [pluginStatus, setPluginStatus] = useState<'Active' | 'Syncing'>('Active');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString().split(' ')[0]} > ${msg}`]); 
  };

  React.useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulate active window detection
  const handleContextSwitch = (app: 'VS Code' | 'Figma' | 'LinkedIn' | 'Gmail') => {
      setActiveContext(app);
      setPluginStatus('Syncing');
      
      // Auto-adapt style based on context (Smart Feature)
      if (app === 'VS Code') setStyle(PitchStyle.SCIENTIFIC);
      if (app === 'Figma') setStyle(PitchStyle.GAME_TRAILER); // Creative
      if (app === 'LinkedIn') setStyle(PitchStyle.STARTUP);
      if (app === 'Gmail') setStyle(PitchStyle.STARTUP); // Professional

      setTimeout(() => setPluginStatus('Active'), 600);
      addLog(`Context Switch: ${app} Detected -> Style Auto-Set`);
  }

  // Simulate dial rotation
  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setIntensity(val);
    if (Math.random() > 0.8) addLog(`Dial Rotate: ${val}% (Intensity)`);
  };

  const handleActionsRingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = Number(e.target.value);
     setTeleprompterSpeed(val);
     // Simulate tone adjustment if not in presenter mode
     if (!isTeleprompterActive && Math.random() > 0.8) {
         addLog(`Ring Rotate: Adjust Tone (${val > 5 ? 'Formal' : 'Casual'})`);
     } else if (Math.random() > 0.8) {
         addLog(`Ring Rotate: Scroll Speed ${val.toFixed(1)}x`);
     }
  };

  const handleButtonPress = (btnId: number, label: string) => {
      addLog(`Button ${btnId} Press: ${label}`);
      // Simulate specialized logic based on button
      if (btnId === 1) onGenerate(); // Button 1 is always Generate
      if (btnId === 2) addLog(`AI Action: Improve Tone for ${activeContext}`);
      if (btnId === 3) addLog(`AI Action: Convert to ${activeContext === 'LinkedIn' ? 'Post' : 'Summary'}`);
      if (btnId === 4) addLog(`AI Action: Draft Investor Email from ${activeContext}`);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.02] duration-300 w-full max-w-md mx-auto relative overflow-hidden group flex flex-col h-full">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6 flex-grow">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                MX Context Aware
            </h3>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${pluginStatus === 'Active' ? 'bg-green-500 shadow-green-500/50' : 'bg-yellow-500'}`}></span>
                <span className={`text-xs font-bold ${pluginStatus === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{pluginStatus === 'Active' ? 'CONNECTED' : 'SYNCING...'}</span>
            </div>
        </div>
        
        {/* Context Awareness Section (Mock) */}
        <div className="bg-black/30 rounded-xl p-3 border border-gray-800 flex items-center justify-between">
            <div className="text-[10px] text-gray-500 font-mono">
                Running in:<br/>
                <span className="text-white font-bold text-sm">{activeContext}</span>
            </div>
            <div className="flex gap-2">
                {['VS Code', 'Figma', 'LinkedIn', 'Gmail'].map((app) => (
                    <button 
                        key={app}
                        onClick={() => handleContextSwitch(app as any)}
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] border transition-all ${activeContext === app ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-700'}`}
                        title={`Simulate Focus: ${app}`}
                    >
                        {app[0]}
                    </button>
                ))}
            </div>
        </div>

        {/* Dial Section */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between gap-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-600 shadow-xl flex items-center justify-center relative transform transition-transform hover:rotate-12 duration-500">
                <div 
                    className="w-1 h-6 bg-indigo-500 rounded-full absolute top-1 origin-bottom transform transition-transform duration-100"
                    style={{ transform: `rotate(${(intensity / 100) * 270 - 135}deg)` }} 
                />
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 text-center leading-tight">
                    TONE<br/>DIAL
                </div>
             </div>
             
             <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                    Intensity / Vibe
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
        
        {/* Actions Ring Simulator */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center relative animate-spin-slow">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400">RING</div>
             </div>
             <div className="flex-1 space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                    {activeContext === 'LinkedIn' ? 'Tone Adjustment' : 'Scroll Speed'}
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

        {/* Plugin Mapped Buttons */}
        <div className="grid grid-cols-2 gap-3">
             <button
                onClick={() => handleButtonPress(1, "Generate")}
                className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-xl text-left group overflow-hidden relative"
             >
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 block">Button 1</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                    ✨ Generate
                </span>
                <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-xl transition-all"></div>
             </button>

             <button
                onClick={() => handleButtonPress(2, `Improve Tone`)}
                className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-xl text-left group overflow-hidden relative"
             >
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 block">Button 2</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                    🎨 Improve
                </span>
                <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-xl transition-all"></div>
             </button>

             <button
                onClick={() => handleButtonPress(3, "Linked Post")}
                className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-xl text-left group overflow-hidden relative"
             >
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 block">Button 3</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                    🚀 To LinkedIn
                </span>
                <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-xl transition-all"></div>
             </button>

             <button
                onClick={() => handleButtonPress(4, "Email")}
                className="p-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-xl text-left group overflow-hidden relative"
             >
                <span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 block">Double Tap</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                    📧 Investor Email
                </span>
                 <div className="absolute inset-0 border-2 border-indigo-500/0 group-hover:border-indigo-500/50 rounded-xl transition-all"></div>
             </button>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-800">
            <button 
                onClick={toggleTeleprompter}
                className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${isTeleprompterActive ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}
            >   
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {isTeleprompterActive ? 'Stop Presentation' : 'Start Presentation'}
            </button>
        </div>

        {/* Event Logs */}
        <div className="bg-black/80 rounded-lg p-3 font-mono text-[9px] text-green-400/80 h-32 overflow-hidden flex flex-col justify-end border border-gray-800 shadow-inner">
             <div className="opacity-50 mb-1 border-b border-gray-800 pb-1 text-xs">LOGI OPTIONS+ PLUGIN EVENTS</div>
             {logs.map((log, i) => (
                 <div key={i} className="animate-in fade-in slide-in-from-left-2 truncate font-mono">
                     <span className="opacity-50 mr-2">{i+1}</span>{log}
                 </div>
             ))}
             <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default MxHardwareSim;
