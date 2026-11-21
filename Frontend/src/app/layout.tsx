import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeritasChain - Decentralized News Verification",
  description:
    "Platform verifikasi berita terdesentralisasi & pelacakan revisi artikel berbasis AI Gemini dan Blockchain Base Sepolia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-600 selection:text-white">
        <Web3Provider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </Web3Provider>
      </body>
    </html>
  );
}
