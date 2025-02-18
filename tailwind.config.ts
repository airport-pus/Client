import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',

      '2md':'803px',
      
      'lg': '1024px',
      'xl': '1280px',
      '2xl':'1536px'
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        gray200: "#F2F2F2",
        gray300: "#F7F7F7",
        gray350: "#FBFBFB",
        gray400: "#7B7B7B",
        gray500: "#4F5561",
        gray575: "#757575",
        gray600: "#6B7280",
        gray700: "#7A7A7A",
        gray800: "#767676",
        grayBorder: "#D1D5DB",
        grayHover: "#F3F3F3",
        grayCustom: "#606060",
        bgcolor: "#F3F4F5",

        blue100: "#EFF6FF",
        blue150: "#D1E0FF",
        blue200: "#D2E4FF",
        blue300: "#BFDBFE",
        blue500: "#215DCE", 

        green100: "#E2FFEB",
        green500: "#16A34A",

        yellow100: "#FFFBD8",
        yellow300: "#FABE00",
        yellow500: "#CA8A04",

        red100: "#FFECEC",
        red500: "#FF0000",

        lightBlueBackground: "#EFF6FF",
        lightBlueText: "#4F5561",
        lightBlueBorder: "#BFDBFE",

        black: "#000000",
        black100:"#111111",
        black150:"#111827",

        white: "#FFFFFF",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      keyframes: {
        marker: {
          "0%": { width: "0%", transform: "skewY(-7deg)" },
          "100%": { width: "100%", transform: "skewY(-7deg)" },
        },
      },

      animation: {
        marker: "marker 1s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
