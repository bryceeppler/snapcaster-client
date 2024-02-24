const { fontFamily } = require('tailwindcss/defaultTheme');
// const talwind plugin helper
const plugin = require('tailwindcss/plugin');

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
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      boxShadow: {
        neon: "0 0 5px theme('colors.purple.500'), 0 0 20px theme('colors.purple.500')"
      }
    }
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const neonUtilities = {};
      const colors = theme('colors');
      for (const color in colors) {
        if (typeof colors[color] === 'object') {
          const color1 = colors[color]['200'];
          const color2 = colors[color]['700'];
          neonUtilities[`.neon-${color}`] = {
            boxShadow: `0 0 5px ${color1}, 0 0 20px ${color2}`
          };
        }
      }
      addUtilities(neonUtilities);
      
    })
  ],
  
};
