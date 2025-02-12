import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        gray500: '#4F5561',
        gray575: '#757575',
        gray600: '#6B7280',

        blue100: '#EFF6FF',
        blue200: '#D2E4FF',
        blue300: '#BFDBFE',
        blue500: '#215DCE',

        lightBlueBackground: '#EFF6FF',
        lightBlueText: '#4F5561',
        lightBlueBorder: '#BFDBFE',
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"], 
      },
      keyframes: {
        marker: {
          '0%': { width: '0%', transform: 'skewY(-7deg)' },
          '100%': { width: '100%', transform: 'skewY(-7deg)' }
        }
      },
      
      animation: {
        marker: 'marker 1s ease-out forwards'
      }
    },
  },
  plugins: [],
} satisfies Config;