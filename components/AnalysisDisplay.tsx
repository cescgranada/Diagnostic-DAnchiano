
import React from 'react';

interface AnalysisDisplayProps {
  content: string;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ content, onReset }) => {
  
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

  const exportMarkdown = () => {
    downloadFile('informe-danchiano.md', content, 'text/markdown');
  };

  const exportLaTeX = () => {
    const latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[catalan]{babel}
\\usepackage{booktabs}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\title{Informe de Diagnòstic D'Anchiano}
\\author{Analista D'Anchiano IA}
\\date{\\today}

\\begin{document}
\\maketitle

${content
  .replace(/#/g, '\\section*')
  .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
  .replace(/\|/g, ' ') 
}

\\end{document}`;
    downloadFile('informe-danchiano.tex', latex, 'application/x-tex');
  };

  const exportPython = () => {
    const pythonCode = `# Informe D'Anchiano - Compatible amb Google Colab
# Aquest script imprimeix el diagnòstic generat

report_content = """
${content.replace(/"/g, '\\"')}
"""

def print_report():
    print("="*50)
    print("INFORME DE DIAGNÒSTIC D'ANCHIANO")
    print("="*50)
    print(report_content)

if __name__ == "__main__":
    print_report()
`;
    downloadFile('analisis_danchiano.py', pythonCode, 'text/x-python');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in duration-500">
      <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center print:hidden">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Resultats del Diagnòstic</span>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9m-9-9a9 9 0 019-9" />
          </svg>
          Nova Consulta
        </button>
      </div>
      
      <div className="p-8 md:p-12 overflow-x-auto">
        <div className="markdown-content prose prose-slate max-w-none prose-headings:text-indigo-900 prose-strong:text-indigo-700">
          <div dangerouslySetInnerHTML={{ __html: transformMarkdown(content) }} />
        </div>
      </div>

      <div className="bg-slate-50 px-8 py-8 border-t border-slate-200 print:hidden">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center sm:text-left">Opcions d'Exportació</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span className="text-sm font-bold text-slate-700">Imprimir PDF</span>
          </button>
          
          <button 
            onClick={exportMarkdown}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="text-sm font-bold text-slate-700">Markdown (Word)</span>
          </button>

          <button 
            onClick={exportLaTeX}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            <span className="text-sm font-bold text-slate-700">LaTeX (Overleaf)</span>
          </button>

          <button 
            onClick={exportPython}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <span className="text-sm font-bold text-slate-700">Python (Colab)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function transformMarkdown(md: string): string {
  let html = md
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-indigo-900 mt-10 mb-6 border-b-2 border-indigo-100 pb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-indigo-800 mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-indigo-700">$1</strong>')
    .replace(/\n- (.*)/gim, '<li class="ml-6 mb-2 text-slate-700 list-disc">$1</li>')
    .replace(/\n\s*(\d+)\. (.*)/gim, '<li class="ml-6 mb-2 text-slate-700 list-decimal">$1. $2</li>');

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
      if (trimmedLine.length > 0) {
        processedLines.push(`<p class="mb-4 text-slate-700 leading-relaxed">${line}</p>`);
      }
    }
  });

  if (inTable) processedLines.push(renderTable(tableRows));

  return processedLines.join('');
}

function renderTable(rows: string[]): string {
  if (rows.length === 0) return '';
  
  let html = '<div class="overflow-x-auto my-8 shadow-md border border-slate-200 rounded-2xl"><table class="min-w-full divide-y divide-slate-200"><thead>';
  
  const headerCells = rows[0].split('|').filter(c => c.trim().length > 0 || rows[0].indexOf('||') !== -1);
  html += '<tr class="bg-indigo-50">' + headerCells.map(c => `<th class="px-6 py-4 text-left text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-r border-indigo-100 last:border-0">${c.trim()}</th>`).join('') + '</tr></thead>';
  
  html += '<tbody class="bg-white divide-y divide-slate-200">';
  
  rows.slice(1).forEach(row => {
    if (row.includes('---')) return;
    const cells = row.split('|').filter(c => c.trim().length > 0 || row.indexOf('||') !== -1);
    if (cells.length > 0) {
      const isSwotHeader = row.includes('**Debilitats**');
      const rowStyle = isSwotHeader ? 'bg-slate-50 font-bold' : '';
      html += `<tr class="hover:bg-indigo-50/30 transition-colors ${rowStyle}">` + cells.map(c => `<td class="px-6 py-4 text-sm text-slate-700 border-r border-slate-100 last:border-0">${c.trim()}</td>`).join('') + '</tr>';
    }
  });
  
  html += '</tbody></table></div>';
  return html;
}

export default AnalysisDisplay;
