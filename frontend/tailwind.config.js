/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink:   "#0D0D0D",
        paper: "#F5F0E8",
        cream: "#EDE8DC",
        amber: { DEFAULT: "#E8A020", light: "#F5C060", dark: "#B87010" },
        sage:  "#3D5A44",
        rust:  "#C04830",
      },
      animation: {
        "spin-slow":  "spin 2s linear infinite",
        "fade-up":    "fadeUp 0.5s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: 1 },
          "50%":     { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
