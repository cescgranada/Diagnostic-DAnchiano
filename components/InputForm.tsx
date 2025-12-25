
import React, { useState, useRef } from 'react';
import { AnalysisParams, FileData } from '../types';

interface InputFormProps {
  onAnalyze: (params: AnalysisParams) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  // Competències
  const [groupComp, setGroupComp] = useState('');
  const [commComp, setCommComp] = useState('');
  const [groupCompFile, setGroupCompFile] = useState<FileData | undefined>();
  const [commCompFile, setCommCompFile] = useState<FileData | undefined>();

  // Valors
  const [groupVal, setGroupVal] = useState('');
  const [commVal, setCommVal] = useState('');
  const [groupValFile, setGroupValFile] = useState<FileData | undefined>();
  const [commValFile, setCommValFile] = useState<FileData | undefined>();

  // Personalitat
  const [groupPers, setGroupPers] = useState('');
  const [commPers, setCommPers] = useState('');
  const [groupPersFile, setGroupPersFile] = useState<FileData | undefined>();
  const [commPersFile, setCommPersFile] = useState<FileData | undefined>();

  const [model, setModel] = useState('gemini-3-flash-preview');
  const [temperature, setTemperature] = useState(0.3);

  const fileRefs = {
    groupComp: useRef<HTMLInputElement>(null),
    commComp: useRef<HTMLInputElement>(null),
    groupVal: useRef<HTMLInputElement>(null),
    commVal: useRef<HTMLInputElement>(null),
    groupPers: useRef<HTMLInputElement>(null),
    commPers: useRef<HTMLInputElement>(null),
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: FileData | undefined) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setter({
        data: result.split(',')[1],
        mimeType: file.type || 'application/pdf',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (setter: (val: FileData | undefined) => void, ref: React.RefObject<HTMLInputElement>) => {
    setter(undefined);
    if (ref.current) ref.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      groupCompetencies: groupComp, groupCompetenciesFile: groupCompFile,
      commissionCompetencies: commComp, commissionCompetenciesFile: commCompFile,
      groupValues: groupVal, groupValuesFile: groupValFile,
      commissionValues: commVal, commissionValuesFile: commValFile,
      groupPersonality: groupPers, groupPersonalityFile: groupPersFile,
      commissionPersonality: commPers, commissionPersonalityFile: commPersFile,
      model, temperature
    });
  };

  const renderSection = (title: string, icon: React.ReactNode, 
                        groupVal: string, groupSet: (v: string) => void, groupFile: FileData | undefined, groupFileSet: (v: FileData|undefined) => void, groupRef: React.RefObject<HTMLInputElement>,
                        commVal: string, commSet: (v: string) => void, commFile: FileData | undefined, commFileSet: (v: FileData|undefined) => void, commRef: React.RefObject<HTMLInputElement>) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grup */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Grup (Ideal)</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => groupRef.current?.click()} className={`text-[10px] px-2 py-1 rounded border font-bold transition-all ${groupFile ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {groupFile ? '✓ Carregat' : '+ Pujar PDF'}
              </button>
              {groupFile && (
                <button type="button" onClick={() => clearFile(groupFileSet, groupRef)} className="text-[10px] p-1 text-red-500 hover:bg-red-50 rounded transition-all" title="Esborrar fitxer">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <input type="file" ref={groupRef} className="hidden" accept=".pdf,.txt" onChange={(e) => handleFileUpload(e, groupFileSet)} />
          </div>
          <textarea className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm" placeholder="Descripció o requeriments..." value={groupVal} onChange={(e) => groupSet(e.target.value)} />
          {groupFile && <p className="text-[10px] text-indigo-600 truncate max-w-[150px]">{groupFile.name}</p>}
        </div>
        {/* Comissió */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Comissió (Realitat)</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => commRef.current?.click()} className={`text-[10px] px-2 py-1 rounded border font-bold transition-all ${commFile ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                {commFile ? '✓ Carregat' : '+ Pujar PDF'}
              </button>
              {commFile && (
                <button type="button" onClick={() => clearFile(commFileSet, commRef)} className="text-[10px] p-1 text-red-500 hover:bg-red-50 rounded transition-all" title="Esborrar fitxer">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <input type="file" ref={commRef} className="hidden" accept=".pdf,.txt" onChange={(e) => handleFileUpload(e, commFileSet)} />
          </div>
          <textarea className="w-full h-32 p-3 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm" placeholder="Descripció de l'equip..." value={commVal} onChange={(e) => commSet(e.target.value)} />
          {commFile && <p className="text-[10px] text-indigo-600 truncate max-w-[150px]">{commFile.name}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm flex gap-4 text-slate-800 items-center">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="text-sm">
          <p className="font-bold text-indigo-900 text-base mb-1">Diagnòstic 360° D'Anchiano</p>
          <p className="text-slate-600 leading-relaxed">S'analitzaran les 54 variables oficials: 18 <strong>Competències</strong>, 18 <strong>Valors</strong> i 18 trets de <strong>Personalitat</strong>. L'informe es presenta en <strong>pàgines independents</strong> per a una millor llegibilitat.</p>
        </div>
      </div>

      <div className="space-y-6">
        {renderSection("1. Competències", 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
          groupComp, setGroupComp, groupCompFile, setGroupCompFile, fileRefs.groupComp,
          commComp, setCommComp, commCompFile, setCommCompFile, fileRefs.commComp
        )}

        {renderSection("2. Valors", 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
          groupVal, setGroupVal, groupValFile, setGroupValFile, fileRefs.groupVal,
          commVal, setCommVal, commValFile, setCommValFile, fileRefs.commVal
        )}

        {renderSection("3. Personalitat", 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
          groupPers, setGroupPers, groupPersFile, setGroupPersFile, fileRefs.groupPers,
          commPers, setCommPers, commPersFile, setCommPersFile, fileRefs.commPers
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">IA Engine</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 text-sm border border-slate-200 rounded-lg bg-white">
              <option value="gemini-3-flash-preview">Gemini 3 Flash (Ràpid)</option>
              <option value="gemini-3-pro-preview">Gemini 3 Pro (Avançat)</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Creativitat: {temperature}</label>
            <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-extrabold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-4">
          {isLoading ? (
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <span className="text-lg uppercase tracking-wider">Executar Diagnòstic 360°</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
