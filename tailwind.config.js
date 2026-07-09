/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7A1F2B',
          light: '#9E2B3A',
          dark: '#5C1420',
        },
        forest: {
          DEFAULT: '#1F3D2B',
          light: '#2A5238',
          dark: '#122318',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#E8C158',
          dark: '#A97D10',
        },
        cream: {
          DEFAULT: '#FBF3E3',
          light: '#FFFBF2',
          dark: '#F0E4C8',
        },
      },
      fontFamily: {
        display: ['"Tiro Telugu"', '"Georgia"', 'serif'],
        body: ['"Poppins"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px 0 rgba(122, 31, 43, 0.12)',
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
