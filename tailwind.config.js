/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'black1':   '#080808',
        'black2':   '#0f0f0f',
        'card':     '#181818',
        'card2':    '#1e1e1e',
        'card3':    '#242424',
        'border1':  '#272727',
        'border2':  '#333333',
        'border3':  '#404040',
        'g1':       '#f4f4f4',
        'g2':       '#d4d4d4',
        'g3':       '#a3a3a3',
        'g4':       '#737373',
        'g5':       '#525252',
        'g6':       '#3a3a3a',
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
