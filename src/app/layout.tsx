import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GridMind — Powerhouse Studio",
  description: "Build and explore an interactive 3D electrical power system.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
