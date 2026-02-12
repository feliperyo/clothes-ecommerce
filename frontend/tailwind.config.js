/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B6F5E', // Marrom rosé
        secondary: '#C4A99B', // Rosé médio/bege
        tertiary: '#E8DDD6', // Rosé claro/bege
        neutral: '#7A6459', // Marrom quente
        background: '#F7F3F0', // Bege suave
        text: '#3D3533', // Marrom escuro
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
