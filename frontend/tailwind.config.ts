import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary:   'rgb(var(--primary)   / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        elevated:  'rgb(var(--elevated)  / <alpha-value>)',
        content:   'rgb(var(--content)   / <alpha-value>)',
        muted:     'rgb(var(--muted)     / <alpha-value>)',
        faint:     'rgb(var(--faint)     / <alpha-value>)',
        accent:    'rgb(var(--accent)    / <alpha-value>)',
        border:    'rgb(var(--border)    / <alpha-value>)',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'blink':      'blink 1.2s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
