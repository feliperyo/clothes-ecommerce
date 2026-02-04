/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C07837', // Rosa escuro/terracota
        secondary: '#DE9A8D', // Rosa médio
        tertiary: '#EBC9C3', // Rosa claro
        neutral: '#AA8476', // Marrom rosado
        background: '#FAF5F3', // Bege clarinho
        text: '#4A4A4A', // Cinza escuro
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
