import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MinigamesAI",
  description: "Small games created using AI to keep your brain running",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://beamanalytics.b-cdn.net/beam.min.js"
        data-token={process.env.NEXT_PUBLIC_BEAM_TOKEN}
        async
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NavBar />
        <main className="flex-grow flex">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
