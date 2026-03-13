/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F855A', // Verde
          dark: '#246B48',
          light: '#5AA37C',
        },
        secondary: {
          DEFAULT: '#F6AD55', // Amarelo
          dark: '#D68C3E',
          light: '#F8C784',
        },
        neutral: {
          100: '#F7FAFC',
          200: '#EDF2F7',
          300: '#E2E8F0',
          400: '#CBD5E0',
          500: '#A0AEC0',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
        }
      },
    },
  },
  plugins: [],
}