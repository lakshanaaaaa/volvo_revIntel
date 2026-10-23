/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#080F1D',
          800: '#0B1426',
          700: '#101C30',
          600: '#14233B',
          500: '#1B2D49',
          400: '#1E3050',
          300: '#263854'
        },
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    }
  },
  plugins: []
};
