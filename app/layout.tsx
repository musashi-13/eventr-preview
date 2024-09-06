import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./_components/nav-bar";
import Footer from "./_components/footer";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      
      <body className="relative bg-black circular-gradient text-white">
        <NavBar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
