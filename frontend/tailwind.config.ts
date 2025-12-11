// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
 theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#a78bfa",
        strong: "#9333ea",
      },
      panel: "#0f0f0f",
    },
  },
},
  plugins: [],
};
