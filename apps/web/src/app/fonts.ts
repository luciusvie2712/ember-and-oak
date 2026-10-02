import { Cormorant_Garamond, Inter } from "next/font/google";

export const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-display-loaded",
});

export const uiFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui-loaded",
});
