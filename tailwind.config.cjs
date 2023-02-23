/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-box-main": "#CCB0A4",
        "bg-main": "#E5D4C4",
      },
    },
    fontFamily: {
      sans: "Ubuntu",
    },
  },
  plugins: [],
};
