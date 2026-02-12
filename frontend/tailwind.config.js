/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A0A0', // Rosé premium
        secondary: '#DBBFBF', // Rosé claro suave
        tertiary: '#F2E4E4', // Rosé pálido
        neutral: '#B08E8E', // Rosé médio (footer/detalhes)
        background: '#FDF8F8', // Branco rosé
        text: '#3A2F2F', // Marrom escuro (leitura)
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
