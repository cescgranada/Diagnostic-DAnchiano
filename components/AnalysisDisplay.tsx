
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
    downloadFile('diagnostic-anchiano.md', content, 'text/markdown');
  };

  const exportLaTeX = () => {
    const latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[catalan]{babel}
\\usepackage{booktabs}
\\usepackage{geometry}
\\usepackage{longtable}
\\geometry{a4paper, margin=1in}
\\title{Informe de Diagnòstic Talent D'Anchiano}
\\author{Analista IA}
\\date{\\today}

\\begin{document}
\\maketitle

${content
  .replace(/#/g, '\\section*')
  .replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}')
  .replace(/\|/g, ' ') 
}

\\end{document}`;
    downloadFile('diagnostic-anchiano.tex', latex, 'application/x-tex');
  };

  const exportPython = () => {
    const pythonCode = `# Diagnòstic D'Anchiano - Google Colab
report_data = """
${content.replace(/"/g, '\\"')}
"""
def show_report():
    print(report_data)

if __name__ == "__main__":
    show_report()
`;
    downloadFile('diagnosi_anchiano.py', pythonCode, 'text/x-python');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in duration-500">
      <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Informe de Diagnòstic</span>
        </div>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Nova Consulta
        </button>
      </div>
      
      <div className="p-8 md:p-12 overflow-x-auto">
        <div className="markdown-content prose prose-slate max-w-none prose-headings:text-indigo-900 prose-strong:text-indigo-700">
          <div dangerouslySetInnerHTML={{ __html: transformMarkdown(content) }} />
        </div>
      </div>

      <div className="bg-slate-50 px-8 py-10 border-t border-slate-200 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => window.print()} className="flex items-center justify-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-sm font-extrabold text-slate-700">Imprimir PDF</span>
          </button>
          <button onClick={exportMarkdown} className="flex items-center justify-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-sm font-extrabold text-slate-700">Markdown (Word)</span>
          </button>
          <button onClick={exportLaTeX} className="flex items-center justify-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-sm font-extrabold text-slate-700">LaTeX (Overleaf)</span>
          </button>
          <button onClick={exportPython} className="flex items-center justify-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all">
            <span className="text-sm font-extrabold text-slate-700">Python (Colab)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function transformMarkdown(md: string): string {
  // Processament previ per evitar duplicitats de numeració i formatar títols
  let html = md
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-indigo-900 mt-10 mb-6 border-b-2 border-indigo-100 pb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-indigo-800 mt-8 mb-4 border-b pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-indigo-700">$1</strong>')
    // Numeració intel·ligent: Si la línia ja comença amb número, la mantenim sense crear llista HTML que dupliqui el número
    .replace(/^\d+\.\s(.*)/gim, (match) => `<p class="ml-2 mb-2 font-medium text-slate-800">${match}</p>`)
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
  
  // Neteja de caràcters de format en la capçalera
  const headerLine = rows[0].replace(/\*\*/g, ''); 
  const headerCells = headerLine.split('|').filter(c => c.trim().length > 0 || headerLine.indexOf('||') !== -1);
  
  let html = '<div class="overflow-x-auto my-8 border border-slate-200 rounded-2xl shadow-sm"><table class="min-w-full divide-y divide-slate-200"><thead>';
  html += '<tr class="bg-indigo-50">' + headerCells.map(c => `<th class="px-6 py-4 text-left text-xs font-extrabold text-indigo-900 uppercase tracking-widest border-r border-indigo-100 last:border-0">${c.trim()}</th>`).join('') + '</tr></thead>';
  
  html += '<tbody class="bg-white divide-y divide-slate-200">';
  
  rows.slice(1).forEach(row => {
    if (row.includes('---')) return;
    const cells = row.split('|').filter(c => c.trim().length > 0 || row.indexOf('||') !== -1);
    if (cells.length > 0) {
      // Detecció DAFO per aplicar estil de títol en cel·la si és necessari
      const lowerRow = row.toLowerCase();
      const isHeaderRow = lowerRow.includes('fortaleses') || lowerRow.includes('oportunitats') || lowerRow.includes('debilitats') || lowerRow.includes('amenaces');
      const rowClass = isHeaderRow ? 'bg-slate-50 font-bold' : 'hover:bg-indigo-50/10 transition-colors';
      
      html += `<tr class="${rowClass}">` + cells.map(c => {
        let content = c.trim().replace(/\*\*/g, '');
        // Suport bàsic per a llistes dins de cel·les usant br o transformant '-' en punts
        if (content.includes('- ')) {
            content = content.replace(/- /g, '• ').replace(/\n/g, '<br/>');
        }
        
        return `<td class="px-6 py-4 text-sm text-slate-700 border-r border-slate-100 last:border-0">${content}</td>`;
      }).join('') + '</tr>';
    }
  });
  
  html += '</tbody></table></div>';
  return html;
}

export default AnalysisDisplay;
