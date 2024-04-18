/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
				base: ['1rem', '1.4rem'] /*16px*/,
				md: ['1.125rem', '1.75rem'] /*18px*/,
				lg: ['1.25rem', '1.625rem'] /*20px*/,
				xl: ['1.5rem', '2.25rem'] /*24px*/,
				'2xl': ['2rem', '2.6rem'] /*32px*/,
				'3xl': ['2.5rem', '3.25rem'] /*40px*/,
				'5xl': ['4rem', '5.2rem'] /*64px*/,
			},
      colors: {
        black: {
          DEFAULT: '#010101',
        },
        primary: {
          DEFAULT: '#F29212',
        },
        gray: {
          500: 'rgb(33,33,33)',
          600: '#2E2D2C',
          800: '#191919',
        }
      }
    },
  },
  plugins: [],
}