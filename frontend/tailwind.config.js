/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A0826D', // Rosé amarronzado
        secondary: '#D4B5A7', // Rosé suave
        tertiary: '#F0E6E0', // Bege rosé bem claro
        neutral: '#6B5549', // Marrom para footer/textos
        background: '#FBF8F6', // Bege bem claro
        text: '#2D2422', // Marrom escuro (boa leitura)
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
