import React, { createContext, useEffect, useState } from 'react';
import { themes } from '../themes/themes';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // ✅ Initialize theme with safe fallback
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('theme');

    // Handle legacy "light" string format
    if (saved && !saved.startsWith('{')) {
      const fallback = themes.find(t => t.id === saved);
      return fallback || themes[0];
    }

    try {
      return saved ? JSON.parse(saved) : themes[0];
    } catch {
      return themes[0];
    }
  });

  // ✅ Apply theme to :root
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(activeTheme));

    const root = document.documentElement;
    root.style.setProperty('--color-primary', activeTheme.primary);
    root.style.setProperty('--color-bg', activeTheme.background);
    root.style.setProperty('--color-text', activeTheme.text);
    root.style.setProperty('--font-family', activeTheme.font);

    document.body.style.backgroundColor = activeTheme.background;
    document.body.style.color = activeTheme.text;
    document.body.style.fontFamily = activeTheme.font;
  }, [activeTheme]);

  const setThemeById = (id) => {
    const found = themes.find((t) => t.id === id);
    if (found) setActiveTheme(found);
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setThemeById, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
