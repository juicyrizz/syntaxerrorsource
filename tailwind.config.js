/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        'accent': '#ADF8FF',
        'card-bg': 'rgba(10, 10, 10, 0.6)',
      },
      spacing: {
        '15': '3.75rem',
        '25': '6.25rem',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '115': '1.15',
      },
      backdropBlur: {
        'lg': '16px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite alternate',
        'text-glow': 'pulse-text-glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};