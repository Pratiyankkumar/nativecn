/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './theme.config.tsx',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: '#ffffff',
        foreground: '#252525',
        card: '#ffffff',
        'card-foreground': '#252525',
        popover: '#ffffff',
        'popover-foreground': '#252525',
        primary: '#343434',
        'primary-foreground': '#fbfbfb',
        secondary: '#f7f7f7',
        'secondary-foreground': '#343434',
        muted: '#f7f7f7',
        'muted-foreground': '#8d8d8d',
        accent: '#f7f7f7',
        'accent-foreground': '#343434',
        destructive: '#e13636',
        'destructive-foreground': '#e13636',
        border: '#ebebeb',
        input: '#ebebeb',
        ring: '#b4b4b4',

        // Dark mode colors
        dark: {
          background: '#252525',
          foreground: '#fbfbfb',
          card: '#252525',
          'card-foreground': '#fbfbfb',
          popover: '#252525',
          'popover-foreground': '#fbfbfb',
          primary: '#fbfbfb',
          'primary-foreground': '#343434',
          secondary: '#444444',
          'secondary-foreground': '#fbfbfb',
          muted: '#444444',
          'muted-foreground': '#b4b4b4',
          accent: '#444444',
          'accent-foreground': '#fbfbfb',
          destructive: '#9e2626',
          'destructive-foreground': '#f85d5d',
          border: '#444444',
          input: '#444444',
          ring: '#8d8d8d',
        },

        // Sidebar colors
        sidebar: {
          DEFAULT: '#fbfbfb',
          foreground: '#252525',
          primary: '#343434',
          'primary-foreground': '#fbfbfb',
          accent: '#f7f7f7',
          'accent-foreground': '#343434',
          border: '#ebebeb',
          ring: '#b4b4b4',
        },

        'sidebar-dark': {
          DEFAULT: '#343434',
          foreground: '#fbfbfb',
          primary: '#5e46ff',
          'primary-foreground': '#fbfbfb',
          accent: '#444444',
          'accent-foreground': '#fbfbfb',
          border: '#444444',
          ring: '#707070',
        },
      },
      borderRadius: {
        xl: 16,
        lg: 10,
        md: 8,
        sm: 6,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
