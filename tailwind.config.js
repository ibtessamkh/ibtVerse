/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maple: { 50: '#fff6f7', 100: '#f9e4e8', 300: '#dda6b2', 500: '#a84a60', 700: '#793347', 900: '#40202b' },
        ink: '#252321', paper: '#fbf9f8', oat: '#f3efec'
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Playfair Display', 'Georgia', 'serif'] },
      boxShadow: { soft: '0 22px 70px rgba(60, 33, 40, .11)' }
    }
  },
  plugins: []
}
