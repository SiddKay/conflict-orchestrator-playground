import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	safelist: [
		// Border colors for mood indication
		'border-l-green-400',
		'border-l-green-500',
		'border-l-yellow-400',
		'border-l-yellow-500',
		'border-l-orange-400',
		'border-l-red-500',
		'border-l-red-600',
		'border-l-slate-400',
		'border-l-[6px]',
		// Ring colors for tree nodes
		'ring-green-400',
		'ring-green-500',
		'ring-yellow-400',
		'ring-yellow-500',
		'ring-orange-400',
		'ring-red-500',
		'ring-red-600',
		'ring-slate-400',
		'ring-4',
		// Glow shadow effects
		'shadow-[0_0_15px_rgba(74,222,128,0.5)]',
		'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
		'shadow-[0_0_15px_rgba(250,204,21,0.5)]',
		'shadow-[0_0_15px_rgba(234,179,8,0.5)]',
		'shadow-[0_0_15px_rgba(251,146,60,0.5)]',
		'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
		'shadow-[0_0_15px_rgba(220,38,38,0.5)]',
		'shadow-slate-400/30',
		// Gradient classes
		'from-green-400',
		'from-green-500',
		'from-yellow-400',
		'from-yellow-500',
		'from-orange-400',
		'from-red-500',
		'from-red-600',
		'from-slate-400',
		'to-green-600',
		'to-green-700',
		'to-yellow-600',
		'to-yellow-700',
		'to-orange-600',
		'to-red-700',
		'to-red-800',
		'to-slate-600',
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
