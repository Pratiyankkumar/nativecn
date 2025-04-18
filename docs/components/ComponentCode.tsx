import React, { useState } from 'react';
import { useTheme } from 'nextra-theme-docs';

interface ComponentCodeProps {
  code: string;
  language?: string;
  title?: string;
}

export default function ComponentCode({ code, language = 'tsx', title }: ComponentCodeProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4">
      {title && (
        <div
          className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
        >
          {title}
        </div>
      )}
      <div className="relative">
        <pre
          className={`rounded-lg overflow-auto p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border`}
        >
          <code
            className={`text-sm language-${language} ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
          >
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 p-1.5 rounded-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${isDarkMode ? 'hover:text-slate-100' : 'hover:text-slate-900'} ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} ${isDarkMode ? 'border-slate-600' : 'border-slate-200'} border transition-colors`}
          aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
