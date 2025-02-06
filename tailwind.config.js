const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
  	screens: {
  		sm: '480px',
  		md: '768px',
  		lg: '976px',
  		xl: '1440px',
  		xxl: '1545px',
		smlaptop: '1280px',
		below1550:'1550px'
  	},
  	extend: {
  		backgroundImage: {
  			foil: "url('/bg-holo.webp')"
  		},
  		aspectRatio: {
  			card: '5 / 7'
  		},
  		container: {
  			center: 'true',
  			padding: '2rem'
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					color: 'inherit',
  					strong: {
  						color: 'inherit',
  						fontWeight: 'bold'
  					},
  					a: {
  						color: '#f95b60',
  						'&:hover': {
  							color: '#f04248'
  						}
  					},
  					h1: {
  						color: 'inherit'
  					},
  					h2: {
  						color: 'inherit'
  					},
  					h3: {
  						color: 'inherit'
  					},
  					blockquote: {
  						borderLeftColor: '#fce7f3'
  					}
  				}
  			}
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
		  borderRadius: {
			xl: 'calc(var(--radius) + 4px)',
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
		  },
  		fontFamily: {
  			sans: ['var(--font-geist-sans)', ...fontFamily.sans],
  			serif: ['Poppins', 'sans-serif'],
			genos: ['Genos'],
			montserrat: ['Montserrat'],
			inter: ['Inter', 'sans-serif'],
  		},
  		keyframes: {
			shine: {
				"0%": {
				  "background-position": "0% 0%",
				},
				"50%": {
				  "background-position": "100% 100%",
				},
				to: {
				  "background-position": "0% 0%",
				},
			  },
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'caret-blink': 'caret-blink 1.25s ease-out infinite',
  			marquee: 'marquee var(--duration) infinite linear',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
			shine: "shine var(--duration) infinite linear",
  		}
  	}
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ]
};