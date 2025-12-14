import React, { useState } from 'react';
import { AppState } from '../types';

interface InputFormProps {
  onSubmit: (location: string, preference: string, budget: string) => void;
  appState: AppState;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, appState }) => {
  const [location, setLocation] = useState('');
  const [preference, setPreference] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appState === AppState.LOCATING || appState === AppState.THINKING) return;
    onSubmit(location, preference, budget);
  };

  const isLoading = appState === AppState.LOCATING || appState === AppState.THINKING;
  
  const getButtonText = () => {
    switch (appState) {
      case AppState.LOCATING: return '定位你這個路痴中...';
      case AppState.THINKING: return '勉強思考中...';
      default: return '選好了沒？按這裡 (快點)';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-xl border border-slate-700 shadow-xl backdrop-blur-sm mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Location Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-slate-300 font-bold text-lg">
            你在哪個鬼地方？ <span className="text-xs text-slate-500 font-normal">(不填我就用GPS定位)</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例如：信義區、台北車站..."
            className="w-full bg-slate-900 text-white border-2 border-slate-600 rounded-lg p-4 text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-slate-600"
            disabled={isLoading}
          />
        </div>

        {/* Budget Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-slate-300 font-bold text-lg">
            你的錢包有多厚？ <span className="text-xs text-red-400 font-bold">(必填)</span>
          </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-slate-900 text-white border-2 border-slate-600 rounded-lg p-4 text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
            disabled={isLoading}
          >
            <option value="" disabled>請選擇你的貧窮程度...</option>
            <option value="窮鬼 (低預算)">窮鬼 (低預算)</option>
            <option value="普通人 (中預算)">普通人 (中預算)</option>
            <option value="土豪 (高預算)">土豪 (高預算)</option>
            <option value="紀念日 (不計代價)">紀念日 (不計代價)</option>
            <option value="不知道">我不知道 (隨便你)</option>
          </select>
        </div>

        {/* Preference Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="preference" className="text-slate-300 font-bold text-lg">
            你想吃什麼？ <span className="text-xs text-slate-500 font-normal">(沒想法就留空，我幫你決定)</span>
          </label>
          <input
            id="preference"
            type="text"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="例如：拉麵、燒肉 (可留空)..."
            className="w-full bg-slate-900 text-white border-2 border-slate-600 rounded-lg p-4 text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-slate-600"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-4 px-6 rounded-lg font-black text-xl uppercase tracking-widest
            transform transition-all duration-200 mt-2
            ${isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-wait' 
              : 'bg-red-700 hover:bg-red-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/40 border-b-4 border-red-900'}
          `}
        >
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default InputForm;