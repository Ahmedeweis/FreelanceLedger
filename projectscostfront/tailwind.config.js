// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E3A6C', // Nuvica Navy
          50: '#e6f7f6',
          100: '#cfeff0'
        },
        'brand-dark': '#002D2D',
        'brand-primary': '#3AE079',   // Nuvica Accent Green
        'brand-light': '#F2F4F5',
        'brand-text': '#4A6581',      // Nuvica muted navy/gray
        accent: '#3AE079',            // Nuvica Accent Green
        bg: '#0f1724',
        card: '#121826',
        'nuvica-navy': '#0E3A6C',
        'nuvica-green': '#3AE079',
        'nuvica-gray': '#4A6581',
        'nuvica-bg-start': '#CBE0F2',
        'nuvica-bg-end': '#FFFFFF',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      }
    },
  },
  plugins: [],
}