import {  Inter } from "next/font/google";
import "./globals.css";
import { CustomMetadata } from "@/types";
import { customMetadata } from "@/constants";
import  Providers  from "@/libs/providers";
import { auth } from "@/auth";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: CustomMetadata = {
  ...customMetadata,title:`Inicio | ${customMetadata.siteName}`,

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  
  return (
    <Providers session={session}>
      <html lang="en">
        <body
          className={`${inter.variable} antialiased`}
          >
          {children}
        </body>
      </html>
    </Providers>
  );
}
