import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Claude-inspired warm neutrals
        cream: {
          50: "#FCFBF9",
          100: "#FAF9F5",
          200: "#F5F4EE",
          300: "#EDEBE3",
          400: "#E2DFD3",
          500: "#D3CFC0",
        },
        ink: {
          50: "#F6F5F2",
          100: "#EDEBE6",
          200: "#D9D5CC",
          300: "#B5AFA1",
          400: "#8B8477",
          500: "#6B655A",
          600: "#4D483F",
          700: "#3D392F",
          800: "#2D2A24",
          900: "#1F1D18",
        },
        clay: {
          50: "#FBF1EC",
          100: "#F7E2D8",
          200: "#EFC4B1",
          300: "#E5A086",
          400: "#DA7C5D",
          500: "#C15F3C",
          600: "#A84F31",
          700: "#8A4028",
          800: "#6E3422",
          900: "#55281B",
        },
        sage: {
          50: "#F2F7F3",
          100: "#E3EFE5",
          200: "#C7DFCB",
          300: "#A2C8AA",
          400: "#77AC82",
          500: "#578F63",
          600: "#44744F",
          700: "#385C41",
          800: "#2E4A35",
          900: "#263C2C",
        },
        gold: {
          50: "#FBF6EB",
          100: "#F6EAD0",
          200: "#EDD5A1",
          300: "#E2BC6E",
          400: "#D7A64A",
          500: "#C08A30",
          600: "#A06F26",
          700: "#7F5820",
          800: "#66471B",
          900: "#523A17",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        serif: ["var(--font-amiri)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,29,24,0.04), 0 4px 16px rgba(31,29,24,0.05)",
        lift: "0 2px 4px rgba(31,29,24,0.05), 0 12px 32px rgba(31,29,24,0.10)",
        glow: "0 0 0 3px rgba(193,95,60,0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
