/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#E05A33",
        // secondary: "#58291B",
        // tertiary: "#EE7A69",
        primary: "#52FCA9",
        secondary: "#5D0EC1",
        tertiary: "#905AD5",
        error: "#E05A33",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
