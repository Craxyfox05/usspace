import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VideoCallProvider } from "@/contexts/VideoCallContext";
import FloatingVideoCall from "@/components/VideoCall/FloatingVideoCall";
import CallNotification from "@/components/VideoCall/CallNotification";

import { cn } from "@/lib/utils";
import ClientBody from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Couples App",
  description: "A beautiful app for couples to share memories and stay connected",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          inter.className
        )}
      >
        <VideoCallProvider>
          <ClientBody>
            <main>
              {children}
            </main>
            <Toaster position="top-center" />
          </ClientBody>
          <FloatingVideoCall />
          <CallNotification />
        </VideoCallProvider>
      </body>
    </html>
  );
}
