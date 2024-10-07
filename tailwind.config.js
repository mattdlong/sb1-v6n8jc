/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#000000',
        accent: '#E60978',
        text: '#333333',
        border: '#666666',
        highlight: '#999999',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        title: ['PLUMPFULL', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}