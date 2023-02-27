/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        show: {
          "100%": { opacity: 1.0 },
        },
      },
      animation: {
        showing: "show 0.8s forwards",
      },
      colors: {
        "bg-box-main": "#CCB0A4",
        "bg-main": "#E5D4C4",
        "wp-blue": "#213951",
        "wp-light-blue": "#3b6691",
      },
      fontFamily: {
        sans: ["Ubuntu", "sans-serif"],
        mono: ['"Ubuntu Condensed"', "ui-monospace"],
      },
    },
  },
  plugins: [],
};
