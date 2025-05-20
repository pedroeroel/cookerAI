import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CookerAI",
  description: "A cooking assistant AI",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen max-w-screen flex-col flex`}
      >
      <header className="flex flex-col items-center justify-center py-5">
        <h1 className="text-4xl font-bold">CookerAPI</h1>
        <p className="text-lg">Your personal cooking assistant</p>
        <a href="https://ai.google.dev" target="_blank" className="hover:text-gray-400 text-sm text-gray-500 transition duration-250">
        Powered by <strong>Gemini API</strong>
        </a>
      </header>
      {children}
      <footer className="w-full flex flex-col items-center py-5">
        <a href="https://github.com/pedroeroel/" target="_blank" className="w-fit hover:text-blue-500 transition duration-200">
        By <b>Roel</b> &copy;
        </a>
      </footer>
      </body>
    </html>
  );
}
