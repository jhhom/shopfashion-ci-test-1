/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      // sans: ["Roboto"],
      sans: ["Open Sans"],
      // logo: ["Playfair Display"],
      // logo: ["EB Garamond"],
      logo: ["Edu TAS Beginner", "Red Hat Display"],
    },
    extend: {
      boxShadow: {
        "o-sm": "0 0 2px 0 rgba(0, 0, 0, 0.05)",
        "o-md":
          "0 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "o-lg":
          "0 0 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "o-xl":
          "0 0 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "o-2xl": "0 0 50px -12px rgba(0, 0, 0, 0.25)",
        "o-3xl": "0 0 60px -15px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        tada: "tada 8000ms infinite",
      },
      keyframes: {
        tada: {
          "0%": { transform: "scale(1)" },
          "1%, 2%": { transform: "scale(0.95) rotate(-3deg)" },
          "3%, 5%, 7%, 9%": { transform: "scale(1.05) rotate(3deg)" },
          "4%, 6%, 8%": { transform: "scale(1.05) rotate(-3deg)" },
          "10%": { transform: "scale(1) rotate(0)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
      },
    },
  },
  plugins: [],
};
