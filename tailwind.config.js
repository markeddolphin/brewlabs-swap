const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "380px",
      xsm: "450px",
      xmd: "610px",
      ls: "1440px",
      ...defaultTheme.screens,
    },
    fontSize: {
      ...defaultTheme.fontSize,
    },
    extend: {
      colors: {
        dark: "#0F2131",
        brand: "#FFDE0D",
        eth: "#5D78DE",
        bsc: "#E4B00A",
        primary: "#EEBB19",
        green: "#2FD35D",
        yellow: "#ffde00",
        grey: "#CFCFCF",
        danger: "#D9563A",
        tailwind: "#3F3F46",
      },
      boxShadow: {
        inner: "inset 0px 0px 6px #000000",
      },
    },
    fontFamily: {
      brand: ['"Questrial"'],
      roboto: ['"Roboto"'],
      dash: ['"Roboto"'],
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    plugin(function ({ addVariant }) {
      addVariant("home", ".home &");
    }),
  ],
  darkMode: "class",
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#4b5563",
          "primary-focus": "#3f3f46",
          accent: "#fb923c",
          "accent-focus": "#3f3f46",
        },
      },
    ],
  },
};
