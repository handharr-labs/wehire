import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/shared/presentation/providers/QueryClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeHire",
  description: "Branded recruitment microsite platform for small businesses in Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* QueryClientProvider is 'use client' internally — wraps only what needs it */}
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
