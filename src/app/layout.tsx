import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GridMind — Energy Intelligence",
  description: "Understand your energy system and explore energy scenarios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
