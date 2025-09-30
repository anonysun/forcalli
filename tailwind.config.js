/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        'korean': ['Noto Sans KR', 'system-ui', 'sans-serif'],
        'dongle': ['Dongle', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

