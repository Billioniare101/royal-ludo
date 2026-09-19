/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          purple: '#6B21A8',
          gold: '#F59E0B',
          dark: '#1E1B4B',
        },
        foundation: {
          ink: '#17251F',
          paper: '#F7F3EA',
          coral: '#E76F51',
          sand: '#E9D8B4',
          sage: '#7EA690',
          muted: '#B5C3BA',
        },
      },
    },
  },
  plugins: [],
};
