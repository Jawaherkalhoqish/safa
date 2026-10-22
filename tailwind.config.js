/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: 'calc(var(--radius) + 4px)',
  			'2xl': 'calc(var(--radius) + 10px)',
  			'3xl': 'calc(var(--radius) + 18px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			safa: {
  				cream: '#FBF9F2',
  				mist: '#F1EEE4',
  				line: '#E3DDCD',
  				sand: '#D2B48C',
  				sandSoft: '#E7DAC4',
  				earth: '#8B7355',
  				olive: '#4B533E',
  				oliveSoft: '#7D8B5D',
  				palm: '#1E3A2F',
  				palmMid: '#2C4A3B',
  				palmDeep: '#14261E',
  				gold: '#C8A15A',
  				goldSoft: '#E4CF9E',
  				ink: '#22271F',
  				okBg: '#EDF3EE',
  				okFg: '#2F5D3F',
  				okLine: '#C9DCCF',
  				warnBg: '#FBF2DF',
  				warnFg: '#8A6212',
  				warnLine: '#EFDBB4',
  				dangerBg: '#FAEAE7',
  				dangerFg: '#8B2F24',
  				dangerLine: '#F0CBC5'
  			}
  		},
  		fontFamily: {
  			heading: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
  			body: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
  			display: ['Fraunces', '"IBM Plex Sans Arabic"', 'Georgia', 'serif'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			rise: {
  				from: { opacity: '0', transform: 'translateY(14px)' },
  				to: { opacity: '1', transform: 'none' }
  			},
  			'soft-pulse': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.55' }
  			},
  			'ring-out': {
  				'0%': { transform: 'scale(0.6)', opacity: '0.7' },
  				'100%': { transform: 'scale(2.4)', opacity: '0' }
  			},
  			drift: {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-6px)' }
  			},
  			'slide-in': {
  				from: { opacity: '0', transform: 'translateY(100%)' },
  				to: { opacity: '1', transform: 'none' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			rise: 'rise 0.65s cubic-bezier(0.16, 1, 0.3, 1) both',
  			'soft-pulse': 'soft-pulse 2.6s ease-in-out infinite',
  			'ring-out': 'ring-out 2.6s ease-out infinite',
  			drift: 'drift 6s ease-in-out infinite',
  			'slide-in': 'slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
