/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      transitionproperty: {
        'height': 'height',
        'opacity': 'opacity',
      },
    }
  },
  plugins: [],
}

