/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aiken-purple': '#1a1533',
        'aiken-blue': '#0f1729',
        'aiken-surface': '#2d2150',
      },
      backgroundImage: {
        'aiken-gradient': 'linear-gradient(to bottom right, #1a1533, #0f1729)',
      }
    },
  },
  plugins: [],
}