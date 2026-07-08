import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          950: "#0A0A0A",
          900: "#121212",
        },
        gray: {
          800: "#1C1C1E",
          700: "#2A2A2C",
          600: "#3D3D40",
          400: "#8A8A8E",
          300: "#A8A8AC",
        },
        white: {
          DEFAULT: "#F5F5F2",
          pure: "#FFFFFF",
        },
        red: {
          700: "#7A1818",
          600: "#A32020",
        },
        steel: {
          600: "#6E7681",
          400: "#8A94A0",
        },
      },
      fontFamily: {
        heading: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.40)",
        "card-hover": "0 20px 40px -8px rgba(0,0,0,0.50)",
        elevated: "0 8px 24px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
