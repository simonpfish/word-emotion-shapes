import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const title = "Word Shapes";
const description = "Visualize Words with Embeddings";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👀</text></svg>",
    },
  ],
  twitter: {
    title,
    description,
    site: "@simonpfish",
    card: "summary_large_image",
    images: [
      {
        url: "https://wordshapes.vercel.app/screenshot.png",
        alt: "Word Shapes",
      },
    ],
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "https://wordshapes.vercel.app/screenshot.png",
        alt: "Word Shapes",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
