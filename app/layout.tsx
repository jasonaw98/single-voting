import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FingerprintProvider } from "@fingerprint/react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's Vote",
  description: "Vote for your favorite team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-900">
        <FingerprintProvider
          apiKey={process.env.NEXT_PUBLIC_FINGERPRINT_API_KEY!}
          region="ap"
        >
          <Toaster position="top-center" />
          {children}
        </FingerprintProvider>
      </body>
    </html>
  );
}
