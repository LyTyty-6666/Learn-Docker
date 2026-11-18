import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_COLORS } from '../styles/theme';

export { THEME_COLORS };

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('dockmaster_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('dockmaster_theme', next);
      } catch (e) {}
      return next;
    });
  };

  const colors = THEME_COLORS[themeMode] || THEME_COLORS.dark;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = colors.bg;
      document.documentElement.style.backgroundColor = colors.bg;
      document.body.style.color = colors.text;
      document.documentElement.setAttribute('data-theme', themeMode);
    }
  }, [colors.bg, colors.text, themeMode]);

  return (
    <ThemeContext.Provider value={{ theme: themeMode, isDark: themeMode === 'dark', toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      isDark: true,
      toggleTheme: () => {},
      colors: THEME_COLORS.dark,
    };
  }
  return context;
}
