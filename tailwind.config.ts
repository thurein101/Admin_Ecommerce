// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // အခုဆိုရင် default font က Inter ဖြစ်သွားပါမယ်
      },
    },
  },
};
export default config;