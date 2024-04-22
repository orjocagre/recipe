/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#F4CE14',
        secondaryColor: '#495E57',
        lightColor: '#F5F7F8',
        darkColor: '#45474B',
      },
      fontFamily: {
        primaryFont: ['Caveat', 'cursive'],
        secondaryFont: ['Open Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

