/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        crimson: '#dc2626',
        page: '#050505',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'drift': 'drift 18s linear infinite',
        'glitch': 'glitch 0.25s cubic-bezier(.25,.46,.45,.94) infinite',
        'shiver': 'shiver 0.15s infinite',
        'zip': 'zip 0.5s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '20%, 80%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -30px)' },
        },
        drift: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(250%)' },
        },
        zip: {
          '0%': { transform: 'translateX(-100%) scaleX(0)', opacity: '0' },
          '50%': { transform: 'translateX(50%) scaleX(1)', opacity: '1' },
          '100%': { transform: 'translateX(200%) scaleX(0)', opacity: '0' },
        },
        shiver: {
          '0%, 100%': { transform: 'translate(0)' },
          '50%': { transform: 'translate(-2px, 2px)' },
        },
        glitch: {
          '0%': { clipPath: 'inset(10% 0 30% 0)', transform: 'translate(-8px)', filter: 'hue-rotate(90deg)' },
          '20%': { clipPath: 'inset(50% 0 10% 0)', transform: 'translate(8px)', filter: 'none' },
          '40%': { clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-8px)', filter: 'hue-rotate(-90deg)' },
          '60%': { clipPath: 'inset(70% 0 5% 0)', transform: 'translate(8px)' },
          '100%': { clipPath: 'inset(10% 0 30% 0)', transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}