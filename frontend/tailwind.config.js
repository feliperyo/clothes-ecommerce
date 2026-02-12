/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C4A393',       // Rosé quente (tom de vinho rosé)
        secondary: '#D5C0B2',     // Rosé-bege claro
        tertiary: '#EDE5DE',      // Creme rosé pálido
        neutral: '#AD9185',       // Rosé-bege médio (footer/detalhes)
        beige: '#D4C5B5',         // Bege suave
        'beige-light': '#E8DDD2', // Bege claro
        background: '#FDF9F5',    // Branco creme quente
        text: '#3A302B',          // Marrom quente (leitura)
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
