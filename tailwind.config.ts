import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neuro-purple': '#8a2be2',
        'neuro-orange': '#ff6a00',
        'neuro-pink': '#ff008c',
        'neuro-dark-1': '#0b0b0f',
        'neuro-dark-2': '#141419',
        'neuro-panel': '#1a1a24',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config
