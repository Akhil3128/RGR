/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette: traditional Godavari sweet-shop feel
        maroon: {
          DEFAULT: '#7B1E26',
          dark: '#5C1219',
          light: '#9A2B34',
        },
        forest: {
          DEFAULT: '#1F4D36',
          dark: '#143526',
          light: '#2C6B4B',
        },
        gold: {
          DEFAULT: '#C99A2E',
          dark: '#A87E1F',
          light: '#E4BE5E',
        },
        cream: {
          DEFAULT: '#FAF3E3',
          dark: '#F1E5CC',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(91, 30, 38, 0.10)',
        'card-hover': '0 6px 20px rgba(91, 30, 38, 0.18)',
      },
    },
  },
  plugins: [],
}
