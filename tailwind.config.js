/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Traditional Godavari sweet-shop palette
        maroon: {
          DEFAULT: '#7B1E2B',
          light: '#9B2C3B',
          dark: '#5A1420',
        },
        forest: {
          DEFAULT: '#1F4D2E',
          light: '#2E6B41',
          dark: '#143620',
        },
        gold: {
          DEFAULT: '#C79A3A',
          light: '#E0BE63',
          dark: '#A67C24',
        },
        cream: {
          DEFAULT: '#FBF4E6',
          dark: '#F3E7CD',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px rgba(90, 20, 32, 0.10)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
