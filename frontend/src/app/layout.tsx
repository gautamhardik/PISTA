import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppProvider } from "@/lib/store";

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
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#07080a] text-white`}>
        <AppProvider>
          <Sidebar />
          <main className="ml-[60px] min-h-screen">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
