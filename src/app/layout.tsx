import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

// latin-ext je obavezan za č, ć, š, đ, ž
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "GRAND COMPANY — Posjeduj ljepotu",
  description:
    "Kreativni studio za strategiju brenda, vizuelni identitet, pakovanje i iskustvene web-stranice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bs" className={`${interTight.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
