import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#8AAAE5',
        secondary: '#5C88C4',
        button: '#6FDCE3',
        background: '#FFFDB5'
      }
    },
  },
  plugins: [],
};
export default config;
