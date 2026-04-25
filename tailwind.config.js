/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          800: '#1e1b4b',
          900: '#111827',
          DEFAULT: '#111827', // Allows 'bg-royal'
        },
        gold: {
          100: '#fef9c3',
          200: '#fde047',
          400: '#facc15',
          500: '#eab308', 
          600: '#ca8a04',
          DEFAULT: '#eab308', // <--- THIS Allows 'bg-gold' to work!
        },
        cream: '#FDFBF7', 
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'], 
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};