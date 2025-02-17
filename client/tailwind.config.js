/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      main: ["Poppins", "serif"],
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
      roman: "upper-roman",
    },
    extend: {
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ee3131",
        overlay: "rgba(0,0,0,0.7)",
      },
      colors: {
        main: "#ee3131",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
        8: "8 8 0%",
      },
      keyframes: {
        "slide-top": {
          "0%": {
            transform: "translateY(20px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
        "slide-top-sm": {
          "0%": {
            transform: "translateY(8px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
        "slide-right": {
          "0%": {
            transform: "translateX(-1000px);",
          },
          "100%": {
            transform: "translateX(0);",
          },
        },
        "slide-left": {
          "0%": {
            transform: "translateX(1000);",
          },
          "100%": {
            transform: "translateX(0);",
          },
        },
      },
      animation: {
        "slide-top":
          "slide-top 0.5s cubic-bezier(0.250, 0.460,0.450, 0.940) both",

        "slide-top-sm": "slide-top-sm 0.2s linear both",

        "slide-right":
          "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",

        "slide-left":
          "slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
