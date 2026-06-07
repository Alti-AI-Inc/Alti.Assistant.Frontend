'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Code2, Play, Copy, Check, Download, FileCode2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CodeIDEWidgetProps {
  code: string;
  language: string;
  guideText?: string;
}

export default function CodeIDEWidget({ code, language, guideText }: CodeIDEWidgetProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'guide'>('editor');
  const [copied, setCopied] = useState(false);

  // Auto-detect extension based on language
  const getFileExtension = (lang: string) => {
    const mappings: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      bash: 'sh',
      shell: 'sh',
      markdown: 'md',
      rust: 'rs',
      go: 'go',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      ruby: 'rb',
    };
    return mappings[lang.toLowerCase()] || 'txt';
  };

  const extension = getFileExtension(language);
  const fileName = `generated_code.${extension}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast.error('Failed to copy code.');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName}`);
    } catch (err) {
      console.error('Failed to download file:', err);
      toast.error('Failed to download file.');
    }
  };

  // Generate mock line numbers
  const lines = code.trim().split('\n');

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] w-full rounded-2xl border border-black/10 dark:border-zinc-800 bg-[#121214] text-zinc-300 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300 select-none">
      {/* IDE Top Bar */}
      <div className="flex items-center justify-between px-4 h-12 bg-[#1A1A1E] border-b border-zinc-800 shrink-0">
        {/* Window controls and active file */}
        <div className="flex items-center gap-4">
          {/* OS-like circles */}
          <div className="flex items-center gap-1.5 flex-none">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Tab Selection */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none',
                activeTab === 'editor'
                  ? 'bg-zinc-800/80 text-white shadow-xs border border-zinc-700/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <FileCode2 className="size-3.5 text-indigo-400" />
              <span>{fileName}</span>
            </button>

            {guideText && (
              <button
                onClick={() => setActiveTab('guide')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none',
                  activeTab === 'guide'
                    ? 'bg-zinc-800/80 text-white shadow-xs border border-zinc-700/50'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                <BookOpen className="size-3.5 text-emerald-400" />
                <span>Run Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {activeTab === 'editor' && (
            <>
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors duration-200 cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors duration-200 cursor-pointer"
                title="Download File"
              >
                <Download className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-auto min-h-0 bg-[#0E0E10] flex">
        {activeTab === 'editor' ? (
          <div className="flex w-full font-mono text-sm leading-relaxed py-4 pr-4">
            {/* Line numbers column */}
            <div className="w-12 select-none text-right text-zinc-600 pr-3 border-r border-zinc-800/60 shrink-0">
              {lines.map((_, i) => (
                <div key={i} className="h-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code lines */}
            <div className="flex-1 pl-4 overflow-x-auto min-w-0 select-text">
              <pre className="m-0 p-0 text-zinc-100">
                <code className="block select-text">
                  {lines.map((line, i) => (
                    <div key={i} className="h-6 select-text">
                      {/* Very basic token styling for look and feel */}
                      {line === '' ? '\u00A0' : highlightSyntax(line, language)}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-6 overflow-y-auto text-zinc-300 leading-relaxed text-sm select-text">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 select-none">
              <Play className="size-4 text-emerald-400 fill-emerald-400" />
              Execution & Setup Guide
            </h3>
            <div className="prose prose-invert max-w-none prose-sm select-text whitespace-pre-wrap">
              {guideText}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 h-8 bg-[#1A1A1E] text-zinc-500 text-[11px] font-medium border-t border-zinc-800 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Connected: Vertex AI</span>
          </span>
          <span>•</span>
          <span>{language.toUpperCase()}</span>
        </div>
        <div>
          <span>UTF-8</span>
          <span className="ml-3">Lines: {lines.length}</span>
        </div>
      </div>
    </div>
  );
}

// Basic regex helper to style common tokens for a premium IDE look
function highlightSyntax(line: string, lang: string): React.ReactNode {
  if (lang.toLowerCase() === 'python') {
    // Basic Python coloring
    const keywords = /\b(def|class|import|from|as|return|if|else|elif|for|while|in|is|not|and|or|try|except|with|lambda|pass)\b/g;
    const functions = /\b([a-zA-Z_]\w*)(?=\()/g;
    const comments = /(#.*)$/g;
    const strings = /(".*?"|'.*?')/g;

    return formatLine(line, [
      { regex: comments, className: 'text-zinc-500 italic' },
      { regex: strings, className: 'text-amber-300' },
      { regex: keywords, className: 'text-pink-400 font-semibold' },
      { regex: functions, className: 'text-sky-400' },
    ]);
  } else {
    // Basic JS/TS/Generic coloring
    const keywords = /\b(const|let|var|function|return|import|export|from|default|class|if|else|for|while|async|await|try|catch|new|throw|switch|case|break)\b/g;
    const functions = /\b([a-zA-Z_]\w*)(?=\()/g;
    const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)$/g;
    const strings = /(".*?"|'.*?'|`.*?`)/g;

    return formatLine(line, [
      { regex: comments, className: 'text-zinc-500 italic' },
      { regex: strings, className: 'text-amber-300' },
      { regex: keywords, className: 'text-pink-400 font-semibold' },
      { regex: functions, className: 'text-sky-400' },
    ]);
  }
}

interface FormatRule {
  regex: RegExp;
  className: string;
}

function formatLine(line: string, rules: FormatRule[]): React.ReactNode {
  // Simple tokenization by applying rules sequentially
  // For safety and correctness, we will just apply styled spans to matched segments
  // This is a mockup highlighter. If it fails, we fall back to plain text.
  try {
    let html = line;
    // Escape HTML special characters
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply rules (caution: regexes need to match the escaped text)
    rules.forEach((rule) => {
      html = html.replace(rule.regex, (match) => {
        return `<span class="${rule.className}">${match}</span>`;
      });
    });

    return <span dangerouslySetInnerHTML={{ __html: html }} className="select-text" />;
  } catch (err) {
    return <span className="select-text">{line}</span>;
  }
}
