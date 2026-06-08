import type { Metadata } from "next";
import { Orbitron, DM_Sans } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Xiaozhi ESP32 AI Assistant",
  description:
    "A fully functional voice AI assistant built by hand on a chip smaller than your thumbnail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${orbitron.variable} ${dmSans.variable} font-body bg-bg text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
