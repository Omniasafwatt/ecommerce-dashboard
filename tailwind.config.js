/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mobile 2000 Brand Colors - Light Blue
        'm2000': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C2D6B',
        },
        'm2000-cyan': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C2D6B',
        },
        'm2000-dark': '#111827',
        'white': '#FFFFFF',
      },
      backgroundImage: {
        'm2000-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
        'm2000-cyan-gradient': 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
      },
    },
  },
  plugins: [],
}

