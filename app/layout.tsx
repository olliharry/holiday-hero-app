import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

//components
import Navbar from "./components/Navbar";

const inter = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Holiday Hero",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
/*<script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`}
        ></script>*/
