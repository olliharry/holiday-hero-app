import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

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
      <head>
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`}
        ></script>
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}