import "@/app/globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/dancing-script/400.css";
import "@fontsource/dancing-script/700.css";
import { Toaster } from "sonner";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import ClientBody from "./ClientBody";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "UsSpace – A Special Place for Love",
  description: "Celebrate your journey, share moods, relive memories — no matter the distance.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClientBody>
          <main>
            {children}
          </main>
          <Toaster position="top-center" />
        </ClientBody>
      </body>
    </html>
  );
}
