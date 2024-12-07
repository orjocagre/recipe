/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px -37px 10px 40px rgba(0,0,0,1)',
        'innerCustom': 'inset 0px 0px 10px 0px rgba(0,0,0,0.30)',
      },
      colors: {
        // primaryColor: '#F4CE14',
        // secondaryColor: '#495E57',
        // lightColor: '#F5F7F8',
        // darkColor: '#45474B',
        primaryColor: '#e7b343',
        secondaryColor: '#497248',
        lightColor: '#cfc39d',
        secondaryLigthColor: '#abbc86',
        darkColor: '#39553f',
        whiteColor: '#fffdf1',
      },
      fontFamily: {
        primaryFont: ['Caveat', 'cursive'],
        secondaryFont: ['Open Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

