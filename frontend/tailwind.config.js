/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Brand colors (all via CSS variables) ===
        primary: {
          DEFAULT: 'var(--primary)',
          50: 'rgba(var(--primary-rgb), 0.08)',
          100: 'rgba(var(--primary-rgb), 0.12)',
          200: 'rgba(var(--primary-rgb), 0.18)',
          300: 'rgba(var(--primary-rgb), 0.28)',
          400: 'rgba(var(--primary-rgb), 0.42)',
          500: 'var(--primary)',
          600: 'var(--primary-hover)',
          700: 'rgba(var(--primary-rgb), 0.92)',
          800: 'rgba(var(--primary-rgb), 0.96)',
          900: 'rgba(var(--primary-rgb), 1)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          50: 'rgba(var(--secondary-rgb), 0.08)',
          100: 'rgba(var(--secondary-rgb), 0.14)',
          200: 'rgba(var(--secondary-rgb), 0.22)',
          300: 'rgba(var(--secondary-rgb), 0.34)',
          400: 'rgba(var(--secondary-rgb), 0.54)',
          500: 'var(--secondary)',
          600: 'var(--secondary-hover)',
          700: 'rgba(var(--secondary-rgb), 0.92)',
          800: 'rgba(var(--secondary-rgb), 0.96)',
          900: 'rgba(var(--secondary-rgb), 1)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          50: 'rgba(var(--accent-rgb), 0.10)',
          100: 'rgba(var(--accent-rgb), 0.16)',
          200: 'rgba(var(--accent-rgb), 0.22)',
          300: 'rgba(var(--accent-rgb), 0.32)',
          400: 'rgba(var(--accent-rgb), 0.5)',
          500: 'var(--accent)',
          600: 'rgba(var(--accent-rgb), 0.88)',
          700: 'rgba(var(--accent-rgb), 0.94)',
          800: 'rgba(var(--accent-rgb), 0.98)',
          900: 'rgba(var(--accent-rgb), 1)',
        },
        // ✨ NEW tertiary (Teal)
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          50: 'rgba(var(--tertiary-rgb), 0.08)',
          100: 'rgba(var(--tertiary-rgb), 0.12)',
          200: 'rgba(var(--tertiary-rgb), 0.18)',
          300: 'rgba(var(--tertiary-rgb), 0.28)',
          400: 'rgba(var(--tertiary-rgb), 0.42)',
          500: 'var(--tertiary)',
          600: 'var(--tertiary-hover)',
          700: 'rgba(var(--tertiary-rgb), 0.92)',
          800: 'rgba(var(--tertiary-rgb), 0.96)',
          900: 'rgba(var(--tertiary-rgb), 1)',
        },

        // Hover / soft variants
        'primary-hover': 'var(--primary-hover)',
        'secondary-hover': 'var(--secondary-hover)',
        'accent-soft': 'var(--accent-soft)',

        // Surfaces & semantic
        surface: {
          DEFAULT: 'var(--surface)',
          light: 'var(--surface-soft)',
          dark: 'var(--surface-elevated)',
        },
        background: 'var(--background)',
        card: 'var(--card-bg)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        muted: 'var(--text-muted)',

        // ❌ Removed: gray, slate, blue, indigo, purple, cyan, amber, emerald, rose, green, pink
        // → Yeh sab duplicate the, ab aap primary/secondary/accent/tertiary use karein.
      },
    },
  },
  plugins: [],
};