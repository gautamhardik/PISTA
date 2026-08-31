import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Outfit, Cinzel, Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppProvider } from "@/lib/store";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PISTA — Transaction Intelligence",
  description:
    "Every transaction leaves clues. Real-time fraud risk intelligence and transaction decisioning powered by production machine learning.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${cinzel.variable} ${spaceGrotesk.variable} ${cormorant.variable} ${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#07080a] text-white selection:bg-[#C7F36B]/30 selection:text-white`}>
        <AppProvider>
          <Sidebar />
          <main className="ml-[60px] min-h-screen relative">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
