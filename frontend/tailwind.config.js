/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f9f4ea',
          200: '#f1e6cd',
          300: '#e7d4a7',
          400: '#dbbe7b',
          500: '#cca552',
          600: '#b48a3c',
          700: '#926b31',
          800: '#77562c',
          900: '#634728',
        },
        roseGold: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#e58085',
          500: '#c55d64',
          600: '#aa424a',
          700: '#8f333b',
          800: '#752b31',
          900: '#62272c',
        },
        royal: {
          900: '#0b132b',
          800: '#1c2541',
          700: '#3a506b',
        },
        emeraldLuxury: {
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
