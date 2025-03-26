import React, { useState, createContext, useContext } from 'react';
import ComponentCode from './ComponentCode';

// Create a context for the preview mode
export const PreviewModeContext = createContext<'light' | 'dark'>('light');

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
  code?: string;
  title?: string;
}

export default function ComponentPreview({
  children,
  className = '',
  code,
  title,
}: ComponentPreviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCode, setShowCode] = useState(false);

  const currentMode = isDarkMode ? 'dark' : 'light';

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      {title && (
        <div className="px-4 py-2 border-b bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="flex gap-2">
            {code && (
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                aria-label={showCode ? 'Hide code' : 'Show code'}
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      )}

      <div className={`p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} ${className}`}>
        <div
          className={`flex justify-center items-center p-4 rounded-lg ${isDarkMode ? 'bg-black' : 'bg-white'}`}
        >
          <PreviewModeContext.Provider value={currentMode}>{children}</PreviewModeContext.Provider>
        </div>
      </div>

      {code && showCode && (
        <div className="border-t">
          <ComponentCode code={code} />
        </div>
      )}
    </div>
  );
}
