import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ksBlack: "#070707",
        ksGold: "#C8A45D",
        ksOffWhite: "#F6F4EF",
      },
      boxShadow: {
        ks: "0 20px 60px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        ks: "28px",
      },
    },
  },
  plugins: [],
} satisfies Config;
