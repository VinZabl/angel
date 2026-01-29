/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cafe: {
          // Angel Game Credits theme: purple accents, off-white background
          accent: '#7C3AED',
          accent2: '#8B5CF6',
          dark: '#1F2937',
          cream: '#FAF9F6',
          beige: '#F5F3F0',
          latte: '#EDE9E5',
          espresso: '#8B5CF6',
          light: '#F0EDE8',
          primary: '#7C3AED',   // Violet-600 accent
          secondary: '#8B5CF6', // Violet-500 for gradients/hover
          darkBg: '#FAF9F6',    // Off-white main background
          darkCard: '#FFFFFF',  // White card surface
          glass: 'rgba(124, 58, 237, 0.08)',
          text: '#1F2937',
          textMuted: '#6B7280'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'anton': ['Anton', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};