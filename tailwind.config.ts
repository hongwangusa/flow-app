import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Flow / 流动 brand palette
        flow: {
          navy: '#0D1B2A',       // deep navy — the scholar's night sky
          teal: '#1B8A8F',       // bioluminescent teal — living, earned
          tealLight: '#2ABFBF',  // lighter teal for hover states
          gold: '#C9A84C',       // harvest gold — XP made visible
          goldLight: '#E8C76A',  // lighter gold for highlights
          coral: '#E8644B',      // coral — surprise, heartbeat
          ink: '#101827',        // near-black for text
          mist: '#F0F4F8',       // light background
          slate: '#4A5568',      // muted text
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        chinese: ['var(--font-noto-sc)', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'flow-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #0D2A35 50%, #0A2020 100%)',
        'flow-card': 'linear-gradient(145deg, rgba(27,138,143,0.08) 0%, rgba(201,168,76,0.04) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C9A84C, #E8C76A, #C9A84C)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(27,138,143,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(27,138,143,0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
