import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        navy: {
          950: '#020617',
          900: '#060d24',
          850: '#0a1538',
          800: '#0e1e4d',
          750: '#142a66',
          700: '#1a3780',
          600: '#254b9f',
          500: '#3463c6'
        },
        gold: {
          50: '#fdfbf2',
          100: '#fcf6df',
          200: '#faeabf',
          300: '#f6db95',
          400: '#f0c765',
          500: '#d4af37',
          600: '#b89228',
          700: '#93701d',
          800: '#79581c',
          900: '#66491c',
          DEFAULT: '#d4af37'
        },
        primary: {
          50: '#fdfbf2',
          100: '#fcf6df',
          500: '#d4af37',
          600: '#b89228',
          700: '#93701d',
          DEFAULT: '#d4af37'
        }
      },
      fontFamily: {
        messiri: ['var(--font-messiri)', 'serif'],
        sans: ['var(--font-inter)', 'var(--font-messiri)', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
