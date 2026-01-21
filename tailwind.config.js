/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          bg: "#fff7ed",     // warm off-white
          card: "#fffbeb",   // cream
          accent: "#f97316", // orange
        },
      },
    },
  },
  plugins: [],
};
