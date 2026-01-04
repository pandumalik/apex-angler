/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#13a4ec",
        "background-light": "#f6f7f8",
        "background-dark": "#101c22",
        "surface-dark": "#192b33",
        "input-bg": "#192b33",
        "border-color": "#325567",
        "text-secondary": "#92b7c9",
      },
      fontFamily: {
        "display": ["Inter", "Noto Sans", "sans-serif"]
      },
    },
  },
  plugins: [],
}
