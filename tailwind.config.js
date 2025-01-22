/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'poke-red': "#ff0000",
        'poke-dred': "#CC0000",
        'poke-blue': "#3B4CCA",
        'poke-grey': "#1F3236",
        'gameboy-red': "#c4bebb",
        'gameboy-dgrey': "#272929"
      },
      borderWidth:{
        '50': '50px'
      },

      keyframes: {
        attack: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        attack: 'attack 0.3s ease-in-out',
      },


    },
  },
  plugins: [],
}

