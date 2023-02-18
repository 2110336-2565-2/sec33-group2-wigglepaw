/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {    
       keyframes: {
       
       show:{
        '100%' : {opacity: 1.0}
       }
       
      }, 
      animation:{
        'showing': 'show 0.8s ease-in-out forwards'

      },

      colors: {
      'bg-box-main': '#CCB0A4',
      'bg-main': '#E5D4C4'
      
    },},
  },
  plugins: [],

};
