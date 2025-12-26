/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    
      screens: {
        // Add your custom breakpoints here
        'size': '400px', // Custom breakpoint for extra-small screens
        'size_1': '600px', // Custom breakpoint larger than xl
        'size_2': '650px',
        'size_500' : '500px', 
      },

    },
  },
  plugins: [],
}