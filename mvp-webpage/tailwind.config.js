/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#27292B",
        shell: "#F5F7F8",
        line: "#D9E0E3",
        plastic: "#3B82F6",
        paper: "#F97316",
        garbage: "#10B981",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 60px rgba(20, 28, 32, 0.10)",
        soft: "0 12px 32px rgba(20, 28, 32, 0.08)",
      },
    },
  },
  plugins: [],
};
