/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette based on provided scheme
        // Ivory Mist, Ocean Breeze, Golden Nectar, Sunset Ember + dark background
        'nb-app-bg': '#050505',
        'nb-ivory': '#FFF8F0',
        'nb-ocean': '#9DD9D2',
        'nb-golden': '#F4D06F',
        'nb-sunset': '#FF8811',
        'nb-border': '#050505',
        'nb-muted': '#4B5563',
        'nb-danger': '#EF4444',
        'nb-danger-soft': '#FEE2E2',

        // Semantic aliases
        'nb-bg': '#050505',
        'nb-surface': '#FFF8F0',
        'nb-surface-alt': '#9DD9D2',
        'nb-primary': '#FF8811',
        'nb-primary-soft': '#F4D06F',
        'nb-accent': '#9DD9D2',
        'nb-accent-soft': '#F4D06F',
      },
        boxShadow: {
          // Brutalist but cleaner: strong vertical shadows without heavy side block
          'nb-lg': '0 6px 0 0 rgba(15, 23, 42, 0.9)',
          'nb-md': '0 4px 0 0 rgba(15, 23, 42, 0.75)',
        },
        borderRadius: {
          // Slight rounding but mostly blocky
          'nb': '0.75rem',
        },
        fontFamily: {
          display: ['Inter', 'system-ui', 'sans-serif'],
          body: ['Inter', 'system-ui', 'sans-serif'],
        },
    },
  },
  plugins: [],
}
