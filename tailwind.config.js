/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        celpip: {
          blue: '#003366',
          lightblue: '#0066CC',
          accent: '#0099FF',
          dark: '#001a33'
        }
      }
    }
  },
  plugins: []
};
