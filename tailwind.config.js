/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      // Sets the default focus ring color
      ringColor: {
        DEFAULT: '#ec4899', 
      },
    },
  },
  plugins: [

  ],
  
};
