import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import SideNav from "./ui/components/sidenav";
import WebsocketConnect from "./lib/socket/websocket.connect";
import { MultiplayerContextProvider } from "./lib/context/multiplayer.context/multiplayer.provider";
import { FreemodeContextProvider } from "./lib/context/freemode.context/freemode.provider";

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
        <MultiplayerContextProvider>
          <FreemodeContextProvider>
            <WebsocketConnect />
            <div>
              <SideNav />
            </div>
            <div>{children}</div>
          </FreemodeContextProvider>
        </MultiplayerContextProvider>
      </body>
    </html>
  );
}
