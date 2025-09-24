/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#365c12",   //Verde oscuro
        secondary: "#004643", //Verde agua oscuro
        neutral: {
          light: "#FAFAFA",   //Blanco-50
          brown: "#292624",     //Marron oscuro
          dark: "#302f2c" //Asfalto
        },
        success: "#22c55e", //Verde-500
        danger: "#ef4444",  //Rojo-500
        warning: "#f59e0b"  //Amarillo-500
      }
    },
  },
  plugins: [],
}

