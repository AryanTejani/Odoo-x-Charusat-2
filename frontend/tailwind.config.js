/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['General Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#EBF5FF',
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#010103'
        },
        text: {
          DEFAULT: '#1F2937',
          muted: '#6B7280',
          dark: '#F9FAFB'
        }
      },
      boxShadow: {
        'card': '0 4px 15px 0 rgba(0,0,0,0.05)',
        'primary': '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    }
  },
  darkMode: 'class',
  plugins: [],
}