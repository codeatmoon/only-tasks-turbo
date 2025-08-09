import type { Config } from 'tailwindcss'

export default {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,jsx,ts,tsx,mdx}',
        './components/**/*.{js,jsx,ts,tsx,mdx}',
        './app/**/*.{js,jsx,ts,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config
