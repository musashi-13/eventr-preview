import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./_components/nav-bar";
import Footer from "./_components/footer";
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import FontAwesome styles
import { config } from '@fortawesome/fontawesome-svg-core';
import { Suspense } from "react";
import Loader from "./_components/loading";
config.autoAddCss = false; 

export const metadata: Metadata = {
  title: "Eventr",
  description: "Social Ticket Booking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="bg-black">
      
      <body className="relative bg-black circular-gradient text-white">
        <NavBar/>
        <Suspense fallback={<div><Loader/></div>}>
        {children}
        </Suspense>
        <Footer/>
      </body>
    </html>
  );
}
