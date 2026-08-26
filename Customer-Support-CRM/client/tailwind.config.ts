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
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          DEFAULT: '#6366f1'
        },
        azm: {
          purple: '#6d28d9',
          indigo: '#4f46e5',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          dark: '#090d16',
          card: '#111827',
          border: '#1f293d'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-cairo)', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
