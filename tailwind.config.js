/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'black1':   'var(--black1)',
        'black2':   'var(--black2)',
        'card':     'var(--card)',
        'card2':    'var(--card2)',
        'card3':    'var(--card3)',
        'border1':  'var(--border1)',
        'border2':  'var(--border2)',
        'border3':  'var(--border3)',
        'g1':       'var(--g1)',
        'g2':       'var(--g2)',
        'g3':       'var(--g3)',
        'g4':       'var(--g4)',
        'g5':       'var(--g5)',
        'g6':       'var(--g6)',
        'sidebar':  'var(--sidebar)',
        'grn':      '#4ade80',
        'grn2':     '#22c55e',
        'grn3':     '#16a34a',
        'pur':      '#a78bfa',
        'amb':      '#fbbf24',
        'blu':      '#60a5fa',
        'red1':     '#f87171',
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      borderRadius: {
        'r':   '12px',
        'rs':  '8px',
        'rxs': '6px',
      },
    },
  },
  plugins: [],
}
