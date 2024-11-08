/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        drawer: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "w-3/5",
          },
        },
      },
      animation: {
        "drawer-animation": "drawer 0.2s linear",
      },
      colors: {
        primary: "#D31B27",
      },
    },
  },
  plugins: [],
};
