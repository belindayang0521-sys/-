import React, { useState, useCallback } from 'react';
import GrumpyHeader from './components/GrumpyHeader';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { getGrumpyRecommendations } from './services/geminiService';
import { AppState, Coordinates, GeminiResponseData } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [resultData, setResultData] = useState<GeminiResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCleanMode, setIsCleanMode] = useState(false); // New state for Clean Mode

  const requestGeolocation = (): Promise<Coordinates | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          resolve(null); // Proceed without location
        },
        { timeout: 5000 }
      );
    });
  };

  const handleFormSubmit = useCallback(async (location: string, preference: string, budget: string) => {
    try {
      setAppState(AppState.LOCATING);
      setErrorMsg(null);
      
      const coords = await requestGeolocation();
      
      setAppState(AppState.THINKING);
      
      const response = await getGrumpyRecommendations(location, preference, budget, coords);
      
      setResultData(response);
      setAppState(AppState.RESULT);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg(error.message || "Something exploded.");
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResultData(null);
    setErrorMsg(null);
    setIsCleanMode(false);
  };

  return (
    <div className={`min-h-screen pb-20 selection:bg-red-900 selection:text-white ${isCleanMode ? 'bg-slate-900' : ''}`}>
      {/* Hide Header in Clean Mode */}
      {!isCleanMode && <GrumpyHeader />}
      
      <main className="container mx-auto px-4">
        {errorMsg && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-lg text-center font-bold">
             錯誤：{errorMsg} <br/>
             <span className="text-sm font-normal">（連個網頁都用不好，真是沒救了）</span>
          </div>
        )}

        {(appState === AppState.IDLE || appState === AppState.LOCATING || appState === AppState.THINKING || appState === AppState.ERROR) && (
          <>
             <div className="mt-6 text-center">
                 {appState === AppState.LOCATING && (
                     <p className="text-red-400 animate-pulse font-mono">正在偷看你的位置...</p>
                 )}
                 {appState === AppState.THINKING && (
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-red-400 font-mono">正在鄙視你的選擇...</p>
                     </div>
                 )}
             </div>
             
             {appState !== AppState.THINKING && (
                <InputForm onSubmit={handleFormSubmit} appState={appState} />
             )}
          </>
        )}

        {appState === AppState.RESULT && resultData && (
          <ResultDisplay 
            data={resultData} 
            onReset={handleReset} 
            isCleanMode={isCleanMode}
            setIsCleanMode={setIsCleanMode}
          />
        )}
      </main>
      
      {/* Hide Footer in Clean Mode */}
      {!isCleanMode && (
        <footer className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 py-2 text-center text-slate-600 text-xs">
           <p>Powered by Google Gemini | Not suitable for people with fragile egos</p>
        </footer>
      )}
    </div>
  );
};

export default App;