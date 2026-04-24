import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Darker_Grotesque } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ['700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: "QuikVault",
    template: "%s | QuikVault",
  },
  description: "File storage, made effortless.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${darkerGrotesque.variable} font-poppins h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
