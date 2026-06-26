
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
				heading: ['"SF Pro Display"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				danger: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				// A.R.I.A luxury dark intelligence palette
				corporate: {
					dark: '#15121F',          // primary background
					darkSecondary: '#211B33', // panel surfaces
					darkTertiary: '#1C172B',  // card surface
					gray: '#94A3B8',
					lightGray: '#CBD5E1',
					accent: '#8B5CF6',        // champagne gold
					accentDark: '#6D28D9',
					info: '#38BDF8',          // AI blue
					border: '#2A2440',
					borderLight: '#211B33'
				},
				brand: {
					DEFAULT: '#8B5CF6',
					light: '#A78BFA',
					dark: '#6D28D9',
					navy: '#15121F',
					panel: '#211B33'
				},
				alert: {
					negative: '#B91C1C',
					warning: '#F59E0B',
					positive: '#15803D'
				},
				premium: {
					black: '#15121F',
					darkGray: '#211B33',
					gray: '#94A3B8',
					silver: '#CBD5E1',
					gold: '#8B5CF6'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
			'glow-pulse': {
				'0%, 100%': { opacity: '0.3' },
				'50%': { opacity: '0.6' }
			},
			'float': {
				'0%, 100%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-8px)' }
			},
			'scanline': {
				'0%': { transform: 'translateY(-100%)' },
				'100%': { transform: 'translateY(400%)' }
			},
			'ring-pulse': {
				'0%, 100%': { transform: 'scale(1)', opacity: '0.1' },
				'50%': { transform: 'scale(1.15)', opacity: '0.3' }
			},
			'fade-in-scale': {
				'0%': { opacity: '0', transform: 'scale(0.8)' },
				'100%': { opacity: '1', transform: 'scale(1)' }
			},
			'scanline-bar': {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(400%)' }
			},
			'marquee': {
				'0%': { transform: 'translateX(0%)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			'drift': {
				'0%, 100%': { transform: 'translate(0, 0)', opacity: '0.3' },
				'25%': { transform: 'translate(10px, -15px)', opacity: '0.6' },
				'50%': { transform: 'translate(-5px, 10px)', opacity: '0.4' },
				'75%': { transform: 'translate(15px, 5px)', opacity: '0.5' }
			}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
			'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
			'float': 'float 6s ease-in-out infinite',
			'scanline': 'scanline 4s linear infinite',
			'ring-pulse': 'ring-pulse 3s ease-in-out infinite',
			'fade-in-scale': 'fade-in-scale 1.2s ease-out forwards',
			'marquee': 'marquee 20s linear infinite',
			'drift': 'drift 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
