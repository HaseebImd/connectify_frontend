/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1877F2',
          hover: '#166FE5',
          light: '#E7F3FF',
        },
        secondary: {
          DEFAULT: '#42B883',
          hover: '#369870',
          light: '#E8F5E8',
        },
        background: '#F0F2F5',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F5F5F5',
        },
        text: {
          primary: '#1C1E21',
          secondary: '#65676B',
          muted: '#8A8D91',
        },
        border: {
          DEFAULT: '#DADDE1',
          light: '#E4E6EA',
        },
        error: {
          DEFAULT: '#E41E3F',
          light: '#FFEBEE',
        },
        success: {
          DEFAULT: '#42B883',
          light: '#E8F5E8',
        },
        warning: {
          DEFAULT: '#FF9800',
          light: '#FFF3E0',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', '"Roboto Mono"', 'Consolas', '"Courier New"', 'monospace'],
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '88': '22rem',
      },
      height: {
        '13': '3.25rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
