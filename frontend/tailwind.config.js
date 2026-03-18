/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        glow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" }
        }
      },
      animation: {
        floaty: "floaty 10s ease-in-out infinite",
        floatySlow: "floaty 14s ease-in-out infinite",
        glow: "glow 6s ease-in-out infinite"
      },
      boxShadow: {
        glass: "0 18px 60px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.10), 0 24px 80px rgba(124,92,255,0.25)"
      }
    }
  },
  plugins: []
};