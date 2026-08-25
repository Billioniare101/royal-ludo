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
      },
    },
  },
  plugins: [],
};
