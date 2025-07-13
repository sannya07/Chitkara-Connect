/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGray: "#2D2D2D", // Customize shades as needed
        mediumGray: "#3A3A3A",
        lightGray: "#6B6B6B",
      },
    },
  },
  plugins: [],
  
}