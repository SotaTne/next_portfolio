import type { Config } from "tailwindcss";

const config: Config = {
  //<div className={`w-[${props.size}px] h-[${props.size}px]`}>
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        "ekite-purple": "#716fbc",
        "ekite-purple-dark": "#525089",
      },
      height: {
        "top-screen": "calc(100vh - 86px)",
      },
    },
  },
  plugins: [],
};
export default config;
