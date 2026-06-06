/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      // Semantic colors backed by CSS-variable design tokens (styles/tokens.css).
      // Components use these (bg-surface, text-fg, border-border, ring-ring,
      // bg-*-soft) so the dark theme is a single data-theme flip.
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        fg: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        border: 'var(--color-border)',
        ring: 'var(--color-ring)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          warm: 'var(--color-accent-warm)',
          soft: 'var(--color-accent-soft)',
        },
        'on-accent': 'var(--color-on-accent)',
        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: 'var(--color-warning-soft)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          soft: 'var(--color-error-soft)',
        },
        info: 'var(--color-info)',
        'neutral-soft': 'var(--color-neutral-soft)',
      },
    },
  },
  plugins: [],
}
