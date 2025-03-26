import React, { createContext, useContext, useEffect } from 'react';
import ComponentCode from './ComponentCode';
import { useTheme } from 'nextra-theme-docs';

// context for the preview mode
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
  const { resolvedTheme } = useTheme();
  const [showCode, setShowCode] = React.useState(false);
  const [useGlobalTheme, setUseGlobalTheme] = React.useState(true);
  const [localTheme, setLocalTheme] = React.useState<'light' | 'dark'>(
    resolvedTheme as 'light' | 'dark'
  );

  // Sync local theme with global theme when using global theme
  useEffect(() => {
    if (useGlobalTheme) {
      setLocalTheme(resolvedTheme as 'light' | 'dark');
    }
  }, [resolvedTheme, useGlobalTheme]);

  const toggleTheme = () => {
    setUseGlobalTheme(false);
    setLocalTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden mb-6 border-slate-200 ${resolvedTheme === 'dark' ? 'border-slate-700' : ''}`}
    >
      {title && (
        <div
          className={`px-4 py-2 border-b ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'} bg-slate-50 ${resolvedTheme === 'dark' ? 'bg-slate-800' : ''} flex items-center justify-between`}
        >
          <h3
            className={`font-medium text-sm  ${resolvedTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}
          >
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`text-xs px-2 py-1 rounded text-slate-600 ${resolvedTheme === 'dark' ? 'text-slate-400' : ''} hover:text-slate-900 ${resolvedTheme === 'dark' ? 'hover:text-slate-100' : ''} bg-slate-100 ${resolvedTheme === 'dark' ? 'bg-slate-800' : ''} hover:bg-slate-200 ${resolvedTheme === 'dark' ? 'hover:bg-slate-700' : ''} border border-slate-200 ${resolvedTheme === 'dark' ? 'border-slate-600' : ''} transition-colors`}
              aria-label={localTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {localTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {code && (
              <button
                onClick={() => setShowCode(!showCode)}
                className={`text-xs px-2 py-1 rounded text-slate-600 ${resolvedTheme === 'dark' ? 'text-slate-400' : ''} hover:text-slate-900 ${resolvedTheme === 'dark' ? 'hover:text-slate-100' : ''} bg-slate-100 ${resolvedTheme === 'dark' ? 'bg-slate-800' : ''} hover:bg-slate-200 ${resolvedTheme === 'dark' ? 'hover:bg-slate-700' : ''} border border-slate-200 ${resolvedTheme === 'dark' ? 'border-slate-600' : ''} transition-colors`}
                aria-label={showCode ? 'Hide code' : 'Show code'}
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`p-4 ${localTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} ${className}`}>
        <div
          className={`flex justify-center items-center p-4 rounded-lg ${localTheme === 'dark' ? 'bg-black' : 'bg-white'}`}
        >
          <PreviewModeContext.Provider value={localTheme}>{children}</PreviewModeContext.Provider>
        </div>
      </div>

      {code && showCode && (
        <div
          className={`border-t border-slate-200 ${resolvedTheme === 'dark' ? 'border-slate-700' : ''}`}
        >
          <ComponentCode code={code} />
        </div>
      )}
    </div>
  );
}
