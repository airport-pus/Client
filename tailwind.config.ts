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

        gray400: "#7B7B7B",
        gray500: "#4F5561",
        gray575: "#757575",
        gray600: "#6B7280",
        gray700: "#7A7A7A",
        grayBorder: "#D1D5DB",
        grayHover: "#F3F3F3",
        grayCustom: "#606060",

        blue100: "#EFF6FF",
        blue200: "#D2E4FF",
        blue300: "#BFDBFE",
        blue500: "#215DCE", 

        green100: "#E2FFEB",
        green500: "#16A34A",

        yellow100: "#FFFBD8",
        yellow500: "#CA8A04",

        red100: "#FFECEC",
        red500: "#FF0000",

        lightBlueBackground: "#EFF6FF",
        lightBlueText: "#4F5561",
        lightBlueBorder: "#BFDBFE",

        green600: "#16A34A",
        yellow600: "#CA8A04",
        yellow300: "#FABE00",
        red600: "#FF0000",

        black: "#000000",
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
