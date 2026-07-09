/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: '#7a1f2b',
        'maroon-dark': '#4f121b',
        godavari: '#174d38',
        gold: '#c99a2e',
        cream: '#fff8e8',
        sandal: '#f4dfb7',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(79, 18, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
