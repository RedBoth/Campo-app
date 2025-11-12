/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4D7C0F",   //Verde oliva
        secondary: "#176635", //Verde oscuro
        neutral: {
          white: "#FFFFFF",
          gray50: "#F8FAFC",
          gray100: "#F1F5F9",
          gray300: "#CBD5E1",
          gray500: "#64748B",
          gray700: "#334155",
          gray900: "#0F172A",
        },
        softdanger: "#FEE2E2", //Rojo-100
        danger: "#B91C1C",   //Rojo-700
        aqua: {
          light: "#D1FAE5",
          DEFAULT: "#10B981",
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

