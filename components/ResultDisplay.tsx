import React, { useState } from 'react';
import { GeminiResponseData } from '../types';

interface ResultDisplayProps {
  data: GeminiResponseData;
  onReset: () => void;
  isCleanMode: boolean;
  setIsCleanMode: (v: boolean) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset, isCleanMode, setIsCleanMode }) => {
  const { recommendations, text } = data;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopyText = () => {
    if (!recommendations) return;
    
    const plainText = recommendations.map(item => 
      `🍽️ ${item.name}\n⭐ 專家點評：${item.professional_recommendation}\n📍 ${item.name} (請自行搜尋地圖)`
    ).join('\n\n');

    const fullText = `【週末吃什麼清單】\n\n${plainText}\n\n(由暴躁美食家不情願地提供)`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  // Render Function Call Results (Structured)
  if (recommendations && recommendations.length > 0) {
    return (
      <div className={`w-full max-w-5xl mx-auto animate-fade-in-up pb-12 ${isCleanMode ? 'mt-20' : 'mt-8'}`}>
        
        {/* Header for Result Section */}
        <div className="text-center mb-10 relative">
            {isCleanMode && (
              <button 
                onClick={() => setIsCleanMode(false)}
                className="fixed top-6 right-6 bg-slate-800/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-slate-700 transition-all z-50 border border-slate-600"
              >
                ✕ 退出純淨模式
              </button>
            )}

            <h2 className="text-3xl md:text-4xl font-black text-red-500 mb-2 drop-shadow-md">
                ## {isCleanMode ? '【週末吃這個，不准有意見】' : '【暴躁美食家勉強幫你選的名單】'}
            </h2>
            <p className="text-slate-400 italic">
              {isCleanMode ? '"跟著吃就對了。"' : '"這三個再不吃，你就餓死算了。"'}
            </p>
        </div>

        {/* Action Buttons (Hidden in Clean Mode) */}
        {!isCleanMode && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setIsCleanMode(true)}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              截圖模式 (隱藏介面)
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg font-bold text-sm transition-all"
            >
              {copyStatus === 'copied' ? (
                 <>
                   <span className="text-green-400">✓ 已複製</span>
                 </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  複製文字清單 (傳給朋友)
                </>
              )}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((item, idx) => {
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`;
            
            return (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-red-500/50 transition-all hover:-translate-y-1 shadow-xl flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white leading-tight mb-2 min-h-[3.5rem] flex items-center">
                        {item.name}
                    </h3>
                    <div className="flex text-amber-500 text-sm font-bold tracking-widest">
                       {Array(item.vibe_score).fill('💢').join('')}
                    </div>
                  </div>

                  {/* Snarky Comment (Hidden in Clean Mode if preferred, currently keeping it for flavor but can be hidden) */}
                  {!isCleanMode && (
                    <div className="bg-red-900/20 border-l-4 border-red-700 p-3 mb-4 rounded-r">
                        <p className="text-red-200 italic text-sm">
                        "{item.snarky_comment}"
                        </p>
                    </div>
                  )}

                  {/* Professional Recommendation */}
                  <div className={`${isCleanMode ? 'mt-0' : 'mt-auto'}`}>
                    <h4 className="text-slate-500 text-xs uppercase font-bold mb-1">專家建議</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {item.professional_recommendation}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <a 
                  href={googleMapsLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-900 p-4 text-center text-slate-400 text-sm font-bold hover:bg-red-900 hover:text-white transition-colors border-t border-slate-700"
                >
                  去 Google Maps 看看這鬼地方 ↗
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions (Hidden in Clean Mode) */}
        {!isCleanMode && (
            <div className="text-center mt-12 pt-8 border-t border-slate-800">
                <p className="text-2xl font-black text-slate-500 uppercase tracking-widest mb-6">
                    選好了就快滾去吃，別再煩我了！
                </p>
                <button 
                    onClick={onReset}
                    className="text-slate-600 hover:text-red-400 font-bold underline decoration-2 underline-offset-4 transition-colors text-sm"
                >
                    重選 (但我會生氣)
                </button>
            </div>
        )}
      </div>
    );
  }

  // Render Text Response (Likely asking for info or insulting)
  // Clean Mode doesn't apply here effectively as there are no cards to show
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in-up">
      <div className="bg-slate-900 border-2 border-red-900/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>

        <h3 className="text-red-500 font-bold text-xl mb-4 uppercase tracking-widest border-b border-red-900/30 pb-2">
            美食家有話要說：
        </h3>
        
        <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:text-slate-300">
             {text?.split('\n').map((line, i) => (
                 <p key={i}>{line}</p>
             ))}
        </div>

        <div className="mt-8 flex justify-center">
            <button 
                onClick={onReset}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold border border-slate-600 transition-all"
            >
                好啦，我補充資訊就是了
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;