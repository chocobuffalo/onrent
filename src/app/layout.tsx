import {  Inter } from "next/font/google";
import "./globals.css";
import { CustomMetadata } from "@/types";
import { customMetadata } from "@/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: CustomMetadata = {
  ...customMetadata,title:`Inicio | ${customMetadata.siteName}`,

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
