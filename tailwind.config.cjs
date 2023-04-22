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
        freelance: "#169C64",
        hotel: "#C3177E",
        good: "#40be62",
        neutral: "#ee9500",
        bad: "#EA4E2C",
        // for admin, help centers
        datatable_pending: "#EE9500",
        datatable_acked: "#43A4DA",
        datatable_resolved: "#3FBD61",
        datatable_rejected: "#BDBDBD", // gray to not distract, save red for noti
      },
      fontFamily: {
        sans: ["Ubuntu", "Sarabun", "sans-serif"],
        mono: ['"Ubuntu Condensed"', "ui-monospace"],
        card: ["Goldman", "cursive"],
      },
    },
  },
  plugins: [],
};
