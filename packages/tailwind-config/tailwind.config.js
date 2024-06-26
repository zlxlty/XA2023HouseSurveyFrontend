const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx,html}`,
    './index.html'
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandblue: colors.blue[500],
        brandred: colors.red[500],
        cloud: "#CEEAFF",
        orchid: "#7A90FE"
      },
      boxShadow: {
        neumorphism: "-.2rem -.2rem .5rem #FFFFFF75, .2rem .2rem .5rem #C9D9E875",
        "neumorphism-reverse":
          "-.2rem -.2rem .5rem #C9D9E8, .2rem .2rem .5rem #FFFFFF",
        "neumorphism-inner":
          "inset .2rem .2rem .5rem #C9D9E8, inset -.2rem -.2rem .5rem #FFFFFF",
        avatar:
          "-1px -1px 0px #FFFFFF, -2px -2px 2px #B8CCE0, inset -1px -1px 0px #FFFFFF, inset -2px -2px 2px #B8CCE0",
        "white-button":
          "0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE",
        "white-button-active": 
          "0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa",
        "black-button":
          "0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE",
      },
      backgroundImage: {
        "orchid-gradient": "linear-gradient(92.49deg, #8CA5FF 18.17%, #2B99FF 118.97%)"
      },
      fontFamily: {
        outline: ['Bungee Outline', 'sans-serif'],
        neox: ['NeoX', 'sans-serif'],
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
    require("tailwindcss-safe-area"),
  ],
};
