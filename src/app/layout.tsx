import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gridmind-lemon.vercel.app"),
  title: { default: "GridMind Powerhouse Studio | Interactive 3D Electrical System Planner", template: "%s | GridMind Powerhouse Studio" },
  description: "Design and explore solar, battery, inverter, generator and borehole pump systems in an interactive 3D electrical power house. Configure equipment, size components and review system warnings.",
  applicationName: "GridMind Powerhouse Studio",
  keywords: ["3D electrical system planner","solar system design","off-grid power system","solar battery sizing","inverter sizing","borehole pump solar","electrical power house simulator","renewable energy planning","solar PV design tool","South Africa solar planning"],
  openGraph: { type: "website", url: "https://gridmind-lemon.vercel.app", siteName: "GridMind Powerhouse Studio", title: "GridMind | Interactive 3D Electrical System Planner", description: "Build a virtual power house, configure solar and storage equipment, and explore first-pass electrical system checks." },
  twitter: { card: "summary_large_image", title: "GridMind | Interactive 3D Electrical System Planner", description: "Plan solar, battery, inverter and borehole pump systems in an interactive 3D workspace." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (<html lang="en-ZA"><body>{children}</body></html>);
}
