/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color: Deep blue
        primary: {
          50: '#f0f4f9',
          100: '#d9e2f2',
          200: '#b3c5e5',
          300: '#8ea9d8',
          400: '#6980cb',
          500: '#4a57be',
          600: '#3c46a1',
          700: '#2f3683',
          800: '#212766',
          900: '#0f172a', // Main primary color
        },
        // Secondary color: Gold/amber accent
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main secondary color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral tones: Slate grays
        slate: {
          50: '#f8fafc',  // Lightest
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155', // Darkest
          800: '#1e293b',
          900: '#0f172a',
        },
        // Success/Error states
        success: '#10b981', // Green
        error: '#ef4444',   // Red
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
  safelist: [
    // Add commonly used classes that might not be directly in the HTML
    // This ensures they're included in the final CSS
    'bg-primary-900',
    'text-primary-900',
    'bg-secondary-500',
    'text-secondary-500',
    'bg-slate-50',
    'text-slate-600',
    'text-slate-700',
    'text-error',
    'text-success',
    'alert-error',
    'alert-success',
    'aspect-w-1',
    'aspect-h-1'
  ]
}