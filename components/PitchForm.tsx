
import React, { useState } from 'react';
import { PitchStyle, PitchData } from '../types';

interface PitchFormProps {
  onSubmit: (data: PitchData) => void;
  isLoading: boolean;
}

const PitchForm: React.FC<PitchFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [style, setStyle] = useState<PitchStyle>(PitchStyle.STARTUP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    onSubmit({ idea, style });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
      <div className="space-y-2">
        <label htmlFor="idea" className="block text-sm font-medium text-gray-300">
          Your big idea (1-2 lines)
        </label>
        <textarea
          id="idea"
          rows={3}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A coffee machine that uses AI to predict your mood..."
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-white placeholder-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-gray-300">
          Vibe Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as PitchStyle)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-white appearance-none cursor-pointer"
        >
          {Object.values(PitchStyle).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || !idea.trim()}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
          isLoading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Brewing your vibe...
          </span>
        ) : (
          'Generate VibePitch'
        )}
      </button>
    </form>
  );
};

export default PitchForm;
