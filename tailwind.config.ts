import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.12)',
        'card-hover': '0 2px 4px rgb(0 0 0 / 0.06), 0 16px 32px -8px rgb(0 0 0 / 0.18)',
        // Sombra "offset" sem blur — usada no site público (identidade de
        // santinho/cartaz impresso), não no admin.
        'hard-sm': '3px 3px 0 0 #0f172a',
        hard: '5px 5px 0 0 #0f172a',
        'hard-hover': '7px 7px 0 0 #0f172a',
      },
    },
  },
  plugins: [typography],
};

export default config;
