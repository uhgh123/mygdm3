import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { setThemeById, themes, activeTheme } = useContext(ThemeContext);

  return (
    <div className="flex gap-2 flex-wrap p-4">
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={`btn ${activeTheme.id === theme.id ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setThemeById(theme.id)}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
