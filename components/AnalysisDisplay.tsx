
import React, { useState, useMemo } from 'react';

interface AnalysisDisplayProps {
  content: string;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ content, onReset }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    // Dividim per marcadors blindats
    let rawPages = content.split('[[PAGE_BREAK]]').filter(p => p.trim().length > 10);
    
    // Fallback si no hi ha marcadors
    if (rawPages.length <= 1) {
      const parts = content.split(/(?=# Informe de Diagnòstic:.* - (Competències|Valors|Personalitat))/g);
      rawPages = parts.filter(p => p && p.length > 50 && !['Competències', 'Valors', 'Personalitat'].includes(p));
    }
    
    return rawPages;
  }, [content]);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => downloadFile('informe-360-anchiano.md', content, 'text/markdown');
  
  const exportLaTeX = () => {
    const latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[catalan]{babel}
\\usepackage{geometry}
\\usepackage{longtable}
\\usepackage{booktabs}
\\geometry{a4paper, margin=1in}
\\title{Diagnòstic D'Anchiano 360}
\\begin{document}
\\maketitle
${content.replace(/#/g, '\\section*').replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')}
\\end{document}`;
    downloadFile('informe-360.tex', latex, 'application/x-tex');
  };

  const exportPython = () => {
    const pythonCode = `
# Informe D'Anchiano 360
# Generat automàticament per Analista Model D'Anchiano

full_report = """${content.replace(/"/g, '\\"')}"""

def get_page(page_num):
    pages = full_report.split('[[PAGE_BREAK]]')
    if 0 <= page_num < len(pages):
        return pages[page_num]
    return "Page not found"

if __name__ == "__main__":
    print(full_report)
`;
    downloadFile('analisis_360.py', pythonCode, 'text/x-python');
  };

  return (
    <div className="flex flex-col gap-6 animate-in zoom-in duration-500">
      {/* Navegació Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === idx ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secció {currentPage + 1} de {pages.length}</span>
        </div>
        
        <div className="flex gap-2">
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 text-sm font-bold text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 disabled:opacity-30 transition-all">Anterior</button>
          <button disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-30 shadow-md transition-all">Següent</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        {/* Capçalera de Pàgina */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diagnòstic Blindat D'Anchiano</span>
          </div>
          <button onClick={onReset} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Inici
          </button>
        </div>
        
        {/* Contingut del Informe */}
        <div className="p-8 md:p-12 min-h-[500px]">
          <div className="markdown-content prose prose-slate max-w-none prose-headings:text-indigo-900 prose-strong:text-indigo-700 prose-li:text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: transformMarkdown(pages[currentPage] || "Processant dades...") }} />
          </div>
        </div>

        {/* Panell de Descàrrega (Sempre present a totes les pàgines) */}
        <div className="bg-slate-50 p-8 border-t border-slate-200 print:hidden">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Exportació de l'Informe 360°</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => window.print()} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 012-2H5a2 2 0 012 2v4a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-xs font-bold text-slate-600">Imprimir PDF</span>
              </button>
              
              <button onClick={exportMarkdown} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="text-xs font-bold text-slate-600">Markdown / Word</span>
              </button>
              
              <button onClick={exportPython} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <span className="text-xs font-bold text-slate-600">Python / Colab</span>
              </button>
              
              <button onClick={exportLaTeX} className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-xs font-bold text-slate-600">LaTeX / Overleaf</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function transformMarkdown(md: string): string {
  let html = md
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-indigo-900 mt-2 mb-6 border-b-2 border-indigo-100 pb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-indigo-800 mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-indigo-700">$1</strong>')
    .replace(/^\d+\.\s(.*)/gim, '<p class="ml-2 mb-2 font-medium text-slate-800">$1</p>')
    .replace(/\n- (.*)/gim, '<li class="ml-6 mb-1 text-slate-700 list-disc">$1</li>');

  const lines = html.split('\n');
  let inTable = false;
  let tableRows: string[] = [];
  const processedLines: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('|')) {
      if (!inTable) inTable = true;
      tableRows.push(trimmedLine);
    } else {
      if (inTable) {
        processedLines.push(renderTable(tableRows));
        tableRows = [];
        inTable = false;
      }
      if (trimmedLine.length > 0 && !trimmedLine.startsWith('<')) {
        processedLines.push(`<p class="mb-4 text-slate-700 leading-relaxed">${line}</p>`);
      } else {
        processedLines.push(line);
      }
    }
  });

  if (inTable) processedLines.push(renderTable(tableRows));
  return processedLines.join('');
}

function renderTable(rows: string[]): string {
  if (rows.length === 0) return '';
  const headerLine = rows[0].replace(/\*\*/g, ''); 
  const headerCells = headerLine.split('|').filter(c => c.trim().length > 0 || headerLine.indexOf('||') !== -1);
  const isDAFO = rows.some(r => {
    const lr = r.toLowerCase();
    return lr.includes('fortaleses') || lr.includes('oportunitats') || lr.includes('debilitats') || lr.includes('amenaces');
  });
  
  let html = `<div class="overflow-x-auto my-8 border border-slate-200 rounded-2xl ${isDAFO ? 'shadow-lg bg-slate-50 p-1' : 'shadow-sm'}"><table class="min-w-full divide-y divide-slate-200">`;
  
  if (!isDAFO) {
    html += '<thead><tr class="bg-indigo-50">' + headerCells.map(c => `<th class="px-6 py-4 text-left text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-r border-indigo-100 last:border-0">${c.trim()}</th>`).join('') + '</tr></thead>';
  }

  html += '<tbody class="bg-white divide-y divide-slate-200">';
  
  rows.forEach((row, rowIndex) => {
    if (row.includes('---')) return;
    const cells = row.split('|').filter(c => c.trim().length > 0 || row.indexOf('||') !== -1);
    if (cells.length > 0) {
      const lowerRow = row.toLowerCase();
      let rowClass = 'hover:bg-slate-50 transition-colors';
      
      // Estils especials per a files de capçalera DAFO
      if (isDAFO && (lowerRow.includes('fortaleses') || lowerRow.includes('oportunitats') || lowerRow.includes('debilitats') || lowerRow.includes('amenaces'))) {
        rowClass = 'bg-slate-100 font-extrabold text-indigo-900';
      }

      html += `<tr class="${rowClass}">` + cells.map((c) => {
        const content = c.trim().replace(/\*\*/g, '');
        let cellClass = 'px-6 py-4 text-sm text-slate-700 border-r border-slate-100 last:border-0';
        let icon = '';

        // Detecidó de tipus de cel·la DAFO per aplicar colors i icones
        const upperContent = content.toUpperCase();
        if (upperContent.includes('FORTALESES')) {
          cellClass += ' bg-emerald-50 text-emerald-900 font-black border-b-2 border-emerald-200';
          icon = '<svg class="w-5 h-5 mb-1 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        } else if (upperContent.includes('OPORTUNITATS')) {
          cellClass += ' bg-sky-50 text-sky-900 font-black border-b-2 border-sky-200';
          icon = '<svg class="w-5 h-5 mb-1 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
        } else if (upperContent.includes('DEBILITATS')) {
          cellClass += ' bg-amber-50 text-amber-900 font-black border-b-2 border-amber-200';
          icon = '<svg class="w-5 h-5 mb-1 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
        } else if (upperContent.includes('AMENACES')) {
          cellClass += ' bg-rose-50 text-rose-900 font-black border-b-2 border-rose-200';
          icon = '<svg class="w-5 h-5 mb-1 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        } else if (upperContent.includes('CRÍTICA')) {
          cellClass += ' bg-red-100 text-red-800 font-bold';
        } else if (upperContent.includes('DESTACADA')) {
          cellClass += ' bg-emerald-100 text-emerald-800 font-bold';
        } else if (upperContent.includes('IRRELEVANT')) {
          cellClass += ' bg-slate-100 text-slate-400 italic';
        }

        // Suport per a llistes detallades internes (DAFO)
        let innerHTML = content;
        if (innerHTML.includes('- ')) {
          innerHTML = '<div class="space-y-3 py-2">' + innerHTML.split('- ').filter(i => i.trim()).map(i => {
            const parts = i.split(': ');
            if (parts.length > 1) {
              return `
                <div class="bg-white/50 p-3 rounded-lg border border-slate-100 shadow-sm">
                  <div class="flex gap-2">
                    <span class="text-indigo-500 font-black mt-0.5">•</span>
                    <div>
                      <strong class="text-slate-900 text-sm block mb-1">${parts[0].trim()}</strong>
                      <p class="text-xs text-slate-600 leading-relaxed">${parts.slice(1).join(': ').trim()}</p>
                    </div>
                  </div>
                </div>`;
            }
            return `<div class="text-xs text-slate-600 flex gap-2 ml-1"><span class="text-indigo-300">•</span> ${i.trim()}</div>`;
          }).join('') + '</div>';
        }

        return `<td class="${cellClass}">${icon}${innerHTML}</td>`;
      }).join('') + '</tr>';
    }
  });
  
  html += '</tbody></table></div>';
  return html;
}

export default AnalysisDisplay;
