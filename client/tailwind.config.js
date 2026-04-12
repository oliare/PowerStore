/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#0F2854",
          primary: "#1C4D8D",
          accent: "#4988C4",
          light: "#BDE8F5",
          bg: "#E1EEFF",
        },
      },
    },
  },
  plugins: [],
};
