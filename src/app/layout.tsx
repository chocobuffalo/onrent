import { CustomMetadata } from "@/types";
import { customMetadata } from "@/constants";
import  Providers  from "@/libs/providers";
import Toast from "@/components/atoms/Toast/Toast";
import { auth } from "@/auth";
import "./globals.css";


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
          className={``}
          >
          {children}
          <Toast />
        </body>
      </html>
    </Providers>
  );
}
