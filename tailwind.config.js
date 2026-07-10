/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7A1F2B',
          light: '#9B2C3B',
          dark: '#5A1420',
        },
        forest: {
          DEFAULT: '#14532D',
          light: '#1B6B3A',
          dark: '#0D3D20',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C96A',
          dark: '#B8942E',
        },
        cream: {
          DEFAULT: '#FFF8E7',
          dark: '#F8EFD8',
        },
        beige: '#F8EFD8',
        ink: {
          DEFAULT: '#2B1B12',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(43, 27, 18, 0.08)',
        soft: '0 4px 16px rgba(43, 27, 18, 0.06)',
        glow: '0 0 40px rgba(212, 175, 55, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
