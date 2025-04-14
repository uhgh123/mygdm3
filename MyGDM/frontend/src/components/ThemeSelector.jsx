import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSelector = () => {
  const { themes, setThemeById, activeTheme } = useContext(ThemeContext);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <div
          key={theme.id}
          onClick={() => setThemeById(theme.id)}
          className={`cursor-pointer border rounded-lg shadow p-4 transition-all ${
            activeTheme.id === theme.id ? 'ring-2 ring-primary' : ''
          }`}
          style={{
            backgroundColor: theme.background,
            color: theme.text,
            fontFamily: theme.font,
          }}
        >
          <h3 className="text-lg font-bold mb-1">{theme.name}</h3>
          <p className="text-sm">Primary: {theme.primary}</p>
          <p className="text-sm">Text: {theme.text}</p>
          <p className="text-sm">Font: {theme.font}</p>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;
