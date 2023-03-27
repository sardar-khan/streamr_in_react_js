/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E1E1E",
        secondary: "#ADADAD",
        bg_primary: "#F2F7F7",
        button: "#75FC9F",
        button_light: "#B3F9CB",
        gradiant: {
          start: "#75FC9F",
          end: "#CEECF6",
        },
      },
    },
  },
  plugins: [],
};
