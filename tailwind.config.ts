import type { Config } from "tailwindcss"
import { withUt } from "uploadthing/tw"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D1B4E",
        accent: "#C9A227",
        cream: "#F8F6F1",
      },
    },
  },
  plugins: [],
}

export default withUt(config)