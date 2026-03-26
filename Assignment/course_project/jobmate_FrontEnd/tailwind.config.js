/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        // Màu Modern Professional (Deep Indigo & Slate)
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
        },
        accent: {
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
        },
        secondary: '#0f172a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#f43f5e',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['2.25rem', { lineHeight: '1.2', fontWeight: '900' }],
        h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['1.125rem', { lineHeight: '1.4', fontWeight: '700' }],
        body: ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '600' }],
        button: ['0.875rem', { lineHeight: '1', fontWeight: '700' }],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 14px -6px rgba(15, 23, 42, 0.16)',
        premium: '0 12px 28px -12px rgba(79, 70, 229, 0.35)',
        // Backward-compatible alias for existing usages.
        deep: '0 12px 28px -12px rgba(79, 70, 229, 0.35)',
      },
    },
  },
  plugins: [],
}
