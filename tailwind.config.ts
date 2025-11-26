import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vanilla: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f5dcc5',
          300: '#e8c4a0',
          400: '#d9a574',
          500: '#c98a54',
        },
        strawberry: {
          50: '#fef1f7',
          100: '#fee5f1',
          200: '#ffcce5',
          300: '#ffa3d0',
          400: '#ff69b4',
          500: '#f92a8b',
        },
        coffee: {
          50: '#f6f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#44403c',
        },
        clean: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
        },
      },
    },
  },
  plugins: [],
}
export default config
