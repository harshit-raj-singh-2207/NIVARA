/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F5FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#8098F9',
          500: '#6366F1', // Primary Indigo
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        sensory: {
          calm: '#E0F2FE', // Light soothing blue
          active: '#FEF3C7', // Warm Amber
          overload: '#FEE2E2', // Soft Red
          safe: '#D1FAE5', // Soft Mint Green
          teal: '#14B8A6',
          purple: '#8B5CF6',
        },
        slate: {
          850: '#1E293B',
          950: '#0F172A',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
