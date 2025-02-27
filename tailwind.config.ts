/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	theme: {
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(220, 70%, 40%)", // Deep blue primary
			foreground: "hsl(220, 10%, 98%)",
		  },
		  secondary: {
			DEFAULT: "hsl(220, 20%, 90%)",
			foreground: "hsl(220, 30%, 20%)",
		  },
		  destructive: {
			DEFAULT: "hsl(0, 84.2%, 60.2%)",
			foreground: "hsl(220, 10%, 98%)",
		  },
		  muted: {
			DEFAULT: "hsl(220, 20%, 85%)",
			foreground: "hsl(220, 20%, 40%)",
		  },
		  accent: {
			DEFAULT: "hsl(220, 60%, 50%)", // Vibrant blue accent
			foreground: "hsl(220, 10%, 98%)",
		  },
		  popover: {
			DEFAULT: "hsl(220, 50%, 98%)",
			foreground: "hsl(220, 30%, 20%)",
		  },
		  card: {
			DEFAULT: "hsl(220, 50%, 98%)",
			foreground: "hsl(220, 30%, 20%)",
		  },
		  eco: {
			light: "#e3f2fd", // Light blue
			default: "#42a5f5", // Medium blue
			dark: "#1565c0", // Dark blue
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };