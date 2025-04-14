// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class', // ✅ This is correct
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',     // blue-600
        secondary: '#4b5563',   // gray-600
        accent: '#16a34a',      // green-600
        warning: '#facc15',     // yellow-400
        danger: '#dc2626',      // red-600
        neutral: '#f3f4f6',     // gray-100
        base: '#ffffff',
        dark: '#1f2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),      // for better form styling
    require('@tailwindcss/typography'), // for content formatting (like FAQ and forum posts)
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto'
        }
      });
    }),
  ],
};
