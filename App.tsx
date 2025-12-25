
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { AppStep, AnalysisParams } from './types';
import { performAnalysis } from './geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (params: AnalysisParams) => {
    setLoading(true);
    setError(null);
    setStep(AppStep.LOADING);
    
    try {
      const response = await performAnalysis(params);
      setResult(response);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      setError(err.message || "S'ha produït un error inesperat.");
      setStep(AppStep.INPUT);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setResult('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        {step === AppStep.INPUT && (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Diagnòstic de Talent i Comissions
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Analitza el grau d'ajust entre les competències que demana el context i les que realment posseeix la comissió de treball mitjançant la metodologia <strong>D'Anchiano</strong>.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 text-red-700 animate-bounce">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            )}

            <InputForm onAnalyze={handleAnalyze} isLoading={loading} />
          </div>
        )}

        {step === AppStep.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 text-center animate-pulse">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">El consultor d'IA està treballant</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                S'estan analitzant els 4 àmbits del model D'Anchiano: Estratègic, Executiu, Relacional i Personal...
              </p>
            </div>
          </div>
        )}

        {step === AppStep.RESULT && (
          <AnalysisDisplay content={result} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xl tracking-wider">Estratègic</span>
              <span className="text-[10px] uppercase">Pensament</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xl tracking-wider">Executiu</span>
              <span className="text-[10px] uppercase">Acció</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xl tracking-wider">Relacional</span>
              <span className="text-[10px] uppercase">Persones</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-white font-bold text-xl tracking-wider">Personal</span>
              <span className="text-[10px] uppercase">Autogestió</span>
            </div>
          </div>
          <p className="text-sm border-t border-slate-800 pt-6">
            &copy; {new Date().getFullYear()} Analista Model D'Anchiano. Eina avançada de diagnòstic competencial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
