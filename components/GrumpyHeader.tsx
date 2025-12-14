import React from 'react';

const GrumpyHeader: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 border-b border-red-900/50 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-6xl font-black text-red-600 tracking-tighter uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          暴躁美食家
        </h1>
        <div className="absolute -top-4 -right-8 text-4xl animate-bounce">💢</div>
      </div>
      <p className="mt-4 text-slate-400 text-lg md:text-xl font-medium italic">
        "你的品味爛透了，讓我來拯救你的週末。"
      </p>
    </header>
  );
};

export default GrumpyHeader;