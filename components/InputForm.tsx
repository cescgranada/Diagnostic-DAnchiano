
import React, { useState, useRef } from 'react';
import { AnalysisParams, FileData } from '../types';

interface InputFormProps {
  onAnalyze: (params: AnalysisParams) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [groupProfile, setGroupProfile] = useState('');
  const [commissionProfile, setCommissionProfile] = useState('');
  const [groupFile, setGroupFile] = useState<FileData | undefined>();
  const [commissionFile, setCommissionFile] = useState<FileData | undefined>();
  const [model, setModel] = useState('gemini-3-flash-preview');
  const [temperature, setTemperature] = useState(0.4); // Lower default for higher rigor

  const groupFileInputRef = useRef<HTMLInputElement>(null);
  const commissionFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: FileData | undefined) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];
      setter({
        data: base64Data,
        mimeType: file.type || 'application/pdf',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!groupProfile && !groupFile) || (!commissionProfile && !commissionFile)) return;
    onAnalyze({ 
      groupProfile, 
      groupFile, 
      commissionProfile, 
      commissionFile, 
      model, 
      temperature 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {/* Information Alert about the 18 Competencies */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3 text-indigo-800">
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">
          <p className="font-bold mb-1">Diccionari de Veritat D'Anchiano</p>
          <p className="opacity-90">L'anàlisi es basarà en 18 competències: <strong>Tasca</strong> (Productivitat, Qualitat, Coneixements...), <strong>Context</strong> (Adaptació, Innovació, Iniciativa...) i <strong>Persones</strong> (Lideratge, Negociació, Comunicació...).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Group Profile Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                1. Perfil del Grup (Ideal)
              </label>
              <p className="text-xs text-slate-500">Què necessita el context o el grup?</p>
            </div>
            <button
              type="button"
              onClick={() => groupFileInputRef.current?.click()}
              className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all border font-bold ${
                groupFile ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {groupFile ? 'PDF Carregat' : 'Pujar PDF'}
            </button>
            <input type="file" ref={groupFileInputRef} className="hidden" accept=".pdf,.txt" onChange={(e) => handleFileUpload(e, setGroupFile)} />
          </div>
          <textarea
            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm bg-white resize-none"
            placeholder="Descriu les competències ideals aquí o puja un document..."
            value={groupProfile}
            onChange={(e) => setGroupProfile(e.target.value)}
          />
          {groupFile && <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Arxiu: {groupFile.name}
          </p>}
        </div>

        {/* Commission Profile Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                2. Perfil de la Comissió (Realitat)
              </label>
              <p className="text-xs text-slate-500">Com és l'equip actual?</p>
            </div>
            <button
              type="button"
              onClick={() => commissionFileInputRef.current?.click()}
              className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all border font-bold ${
                commissionFile ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {commissionFile ? 'PDF Carregat' : 'Pujar PDF'}
            </button>
            <input type="file" ref={commissionFileInputRef} className="hidden" accept=".pdf,.txt" onChange={(e) => handleFileUpload(e, setCommissionFile)} />
          </div>
          <textarea
            className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm bg-white resize-none"
            placeholder="Descriu la realitat de l'equip aquí o puja els seus CVs..."
            value={commissionProfile}
            onChange={(e) => setCommissionProfile(e.target.value)}
          />
          {commissionFile && <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            Arxiu: {commissionFile.name}
          </p>}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-1 space-y-3">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest text-xs">Configuració de l'IA</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('gemini-3-flash-preview')}
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                  model === 'gemini-3-flash-preview' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Gemini Flash
              </button>
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-preview')}
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                  model === 'gemini-3-pro-preview' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Gemini Pro
              </button>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-widest text-xs">Temperatura (Rigor)</label>
              <span className="text-xs font-bold bg-indigo-50 px-2 py-1 rounded text-indigo-700 border border-indigo-100">{temperature}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.1" value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>Rigorós</span>
              <span>Creatiu</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || ((!groupProfile && !groupFile) || (!commissionProfile && !commissionFile))}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-5 px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-4 transform active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl uppercase tracking-wider">Generant Informe...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xl uppercase tracking-wider">Generar Diagnòstic</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
