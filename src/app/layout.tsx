import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SideNav from "./ui/sidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess",
  description: "A chess game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex", gap: "1em" }}>
        <div>
          <SideNav />
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
