/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {    
       keyframes: {
        animation: {
          wiggle: 'wiggle 5s ease-in-out infinite',
      },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'scale(2)' },
        }
      }, 
      colors: {
      'bg-box-main': '#CCB0A4',
      'bg-main': '#E5D4C4'
      
    },},
  },
  plugins: [],

};
